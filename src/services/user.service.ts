import { createUserDTO } from "../interfaces/user.interface";
import userModel from "../models/user.model";
import transporter from "../config/nodemailer.config";

class UserService{
    async createUser(data: createUserDTO){
        const {username, email, Password, confirmPassword} = data;
        if(!username || !email || !Password || !confirmPassword)
        {
            throw new Error("All fields are required!")
        }

        // check if the password lenght is of atleast 6 characters.
        if(Password.length < 6)
        {
            throw new Error("Password length must be of atleast 6 characters.")
        }

        // check if the length of password exceed 15 characters.
        if(Password.length > 15)
        {
            throw new Error("Password length cannot exceed 15 characters.")
        }   
        
        // check if user already exists or not
        const findUser = await userModel.findOne({email: email});
        if(findUser)
        {
            throw new Error("User Email already exists.");
        }

        // password and confirmPassword must be same
        if(Password!==confirmPassword)
        {
            throw new Error("Password and confirm password must be same!")
        }

        const createdUser = await userModel.create({
            username, 
            email,
            Password
        });
        if(!createdUser)
        {
            throw new Error("Cannot create User")
        }
        await createdUser.save();

        // send email to registered email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: `Welcome ${username} to stayFinder.`,
            text: `Welcome to stayFinder. Your account has been created with email id: ${email}.`
        }

        const mail = await transporter.sendMail(mailOptions);
        if(!mail)
        {
            console.log("couldn't send mail");
        }

        this.sendMail(email, username);

        return createdUser;
    }

    async sendMail(email: string, username: string){
        // send email to registered email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: `Welcome ${username} to stayFinder.`,
            text: `Welcome to stayFinder. Your account has been created with email id: ${email}.`
        }

        const mail = await transporter.sendMail(mailOptions);
        if(!mail)
        {
            console.log("couldn't send mail");
        }
    }
}

export = new UserService();