import mongoose from "mongoose"
import { HydratedDocument } from "mongoose";

export interface IUser{
    username: string;
    email: string;
    Password: string;
    role: string;
    isAccountVerified: boolean;
    verifyOTP: string;
    verifyOTPExpiresAt: number;
    resetOTP: string;
    resetOTPExpiresAt: number;
    is2FAEnabled: Boolean;
    comparePassword(Password: string): Promise<boolean>;
}

export interface IStudent{
    userId: mongoose.Types.ObjectId;
    enrolledCourses: Array<mongoose.Types.ObjectId>;
    completedCourses: Array<mongoose.Types.ObjectId>;
}

export interface ITeacher{
    userId: mongoose.Types.ObjectId;
    publishedCourses: Array<mongoose.Types.ObjectId>;
}

export interface createUserDTO{
    username: string;
    email: string;
    Password: string;
    confirmPassword: string
}

export type UserDocument = HydratedDocument<IUser>;