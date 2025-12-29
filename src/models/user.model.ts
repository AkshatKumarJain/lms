import { IUser } from "../interfaces/user.interface";
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
        }
    },
    {timestamps: true}
);

export default mongoose.model<IUser>("User", userSchema);