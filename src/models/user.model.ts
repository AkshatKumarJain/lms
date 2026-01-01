import { IUser, UserDocument } from "../interfaces/user.interface";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema<IUser>(
    {
        username: {
            type: String, 
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            index: true,
            lowercase: true
        },
        Password: {
            type: String,
            required: true,
            min: [6, "Password must be of atleast 6 characters."],
            max: [15, "Password cannot exceed 15 characters."]
        },
        role: {
            type: String,
            enum: ["student", "teacher"],
            default: "student"
        },
        isAccountVerified: {
            type: Boolean,
            default: false
        },
        verifyOTP: {
            type: String,
            default: ""
        },
        verifyOTPExpiresAt: {
            type: Number,
            default: 0
        },
        resetOTP: {
            type: String,
            default: ""
        },
        resetOTPExpiresAt: {
            type: Number,
            default: 0
        },
        is2FAEnabled: {
            type: Boolean,
            default: false
        }
    },
    {timestamps: true}
);

userSchema.pre("save", async function (next) {
     const user = this as UserDocument;
    if(!user.isModified("Password"))
        return;
        const salt = await bcrypt.genSalt(10);
        user.Password = await bcrypt.hash(user.Password, salt);
    } 
);

userSchema.methods.comparePassword = async function (this: UserDocument,
    Password: string
): Promise<boolean> {
    return bcrypt.compare(Password, this.Password);
}

export default mongoose.model<IUser>("User", userSchema);