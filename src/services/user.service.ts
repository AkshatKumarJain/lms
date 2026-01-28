import { createUserDTO, IUser } from "../interfaces/user.interface";
import {userModel} from "../models/user.model";
import transporter from "../config/nodemailer.config";
import { issueTokens, revokeAll, rotateRefreshToken } from "redis-jwt-auth";
import crypto from "crypto"
import { OAuth2Client } from "google-auth-library";
import Student from "../models/student.model";
import Teacher from "../models/teacher.model";

class UserService {
    async getAllUsers() {
        const allUsers = await userModel.find().select("-Password");
        return allUsers;
    }

    async getUserByEmail(data: string) {
        if (!data || data === undefined) {
            throw new Error("Email is required");
        }

        const getUser = await userModel.findOne({ email: data }).select("-Password");
        return getUser;
    }

    async getUserProfile(id: string) {
        const getUser = await userModel.findById(id).select("-Password");
        return getUser;
    }

    async updateUserProfile(id: string) {
       
    }

    async createUser(data: createUserDTO) {
        const { username, email, Password, confirmPassword, role } = data;
        if (!username || !email || !Password || !confirmPassword) {
            throw new Error("All fields are required!")
        }

        // check if the password lenght is of atleast 6 characters.
        if (Password.length < 6) {
            throw new Error("Password length must be of atleast 6 characters.")
        }

        // check if the length of password exceed 15 characters.
        if (Password.length > 15) {
            throw new Error("Password length cannot exceed 15 characters.")
        }

        // check if user already exists or not
        const findUser = await userModel.findOne({ email: email });
        if (findUser) {
            throw new Error("User Email already exists.");
        }

        // password and confirmPassword must be same
        if (Password !== confirmPassword) {
            throw new Error("Password and confirm password must be same!")
        }

        const createdUser = await userModel.create({
            username: data.username,
            email: data.email,
            Password: data.Password,
            role: data.role ? data.role: undefined
        } as IUser);
        if (!createdUser) {
            throw new Error("Cannot create User")
        }
        await createdUser.save();

        if(createdUser.role==='student')
        {
            const createdStudentProfile = await Student.create({userId: createdUser._id})
            if(!createdStudentProfile)
            {
                throw new Error("Could not create student profile.")
            }
            console.log("student profile created");
        }

        if(createdUser.role==='teacher')
        {
            const createdTeacherProfile = await Teacher.create({userId: createdUser._id})
            if(!createdTeacherProfile)
            {
                throw new Error("Could not create teacher profile.")
            }
            console.log("teacher profile created");
        }

        this.sendMail(email, username);

        return createdUser;
    }

    private async sendMail(email: string, username: string) {
        // send email to registered email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: `Welcome ${username} to lms.`,
            text: `Welcome to lms. Your account has been created with email id: ${email}.`
        }

        const mail = await transporter.sendMail(mailOptions);
        if (!mail) {
            console.log("couldn't send mail");
        }
    }

    async deleteUser(data: string): Promise<any> {
        const deletedUser = await userModel.findOneAndDelete({ email: data });
        return deletedUser;
    }

    async loginUser(email: string, password: string) {
        const findUser = await userModel.findOne({ email: email });
        if (!findUser) {
            const err:any = new Error("User with this email doesn't exist.");
            err.statusCode = 404;
            throw err;

        }
        const checkPassword = await findUser.comparePassword(password);
        if (!checkPassword) {
            throw new Error("email or password is incorrect.");
        }
        const { accessToken, refreshToken } = await issueTokens({ userId: findUser._id.toString() });
        if (!accessToken || !refreshToken) {
            throw new Error("couldn't get tokens")
        }
        const obj = { accessToken, refreshToken };
        return obj;
    }

    async logoutUser(data: string){
        const isrevoked = await revokeAll(data.toString());
        return isrevoked;
    }

    async refreshUser(refreshToken: string){
        const newRefreshToken = await rotateRefreshToken(refreshToken);
        if(!newRefreshToken)
        {
            throw new Error("couldn't create new refresh token!");
        }
        return newRefreshToken;
    }

    async sendVerifyOTP(userId: any){
        const findUser = await userModel.findById(userId);
        console.log(findUser);
        if(!findUser)
        {
            throw new Error("User doesn't exists.")
        }
        if(findUser.isAccountVerified===true)
        {
            throw new Error("Account is already verified");
        }
        const otp: string = String(Math.floor(100000 + Math.random() * 900000));
        findUser.verifyOTP = otp;
        findUser.verifyOTPExpiresAt = Date.now() + 300 * 1000;
        console.log(otp);
        await findUser.save();

        console.log(findUser);

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: findUser.email,
            subject: "Account verification otp",
            text: `Your otp is ${otp}. Verify your account using this otp. It will expire in 5 minutes.` 
        }

        const isOTP = await transporter.sendMail(mailOptions);
        console.log(isOTP);
        if(!isOTP)
        {
            throw new Error("could not send otp");
        }
        return otp;
    }

    async verifyEmail(userId: any, otp: string){
        const findUser = await userModel.findById(userId);
        if(!findUser)
        {
            throw new Error("User does not exists");
        }

        if(findUser.verifyOTP==="" || findUser.verifyOTP!==otp)
        {
            throw new Error("Invalid or empty otp");
        }

        if(findUser.verifyOTPExpiresAt < Date.now())
        {
            throw new Error("otp has been expired")
        }
        findUser.isAccountVerified = true;
        findUser.verifyOTP = "";
        findUser.verifyOTPExpiresAt = 0;
        await findUser.save();

        return findUser.isAccountVerified;
    }

    async forgotPassword(email: string){
        const findUser = await userModel.findOne({email: email});

        if(!findUser)
        {
            throw new Error("If this email exists, the link has been sent");
        }

        if(findUser.isAccountVerified===false)
        {
            throw new Error("You need to verify your account first.");
        }

        const rawToken = crypto.randomBytes(32).toString('hex');
        const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

        findUser.resetOTP = tokenHash;
        findUser.resetOTPExpiresAt = Date.now() + 300 * 1000;

        await findUser.save();

        const resetUrl = `http://localhost:5173/reset-password/${rawToken}`;

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: findUser.email,
            subject: "Reset password email",
            text: `click the link below to reset your password.
            <a href="${resetUrl}">${resetUrl}</a>
            ` 
        }

        console.log(mailOptions);

        const sendEmail = await transporter.sendMail(mailOptions);

        if(!sendEmail)
        {
            throw new Error("could not send email");
        }

        return sendEmail;

    }

    async resetPassword(token: string, newPassword: string){
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

        const findUser = await userModel.findOne({
            resetOTP: tokenHash,
            resetOTPExpiresAt: {$gt: Number(new Date())}
        })

        if(!findUser)
        {
            throw new Error("Invalid or expired token")
        }

        const oldPassword: string = findUser.Password;

        findUser.Password = newPassword;
        await findUser.save();

        findUser.resetOTP = "";
        findUser.resetOTPExpiresAt = 0;

         await this.logoutUser(findUser._id.toString());

        return {
            message: "Password reset successful. Please login again.",
        };
    }

    // async getGoogleClient(){
    //     const clientId = process.env.GOOGLE_CLIENT_ID;
    //     const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    //     const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    //     if(!clientId || !clientSecret)
    //     {
    //         throw new Error("Both clientId and client Secret are required");
    //     }

    //     return new OAuth2Client(
    //         clientId,
    //         clientSecret,
    //         redirectUri
    // )
    // }
}

export = new UserService();