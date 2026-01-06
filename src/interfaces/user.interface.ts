import mongoose from "mongoose"
import { HydratedDocument } from "mongoose";

export interface IUser{
    _id: mongoose.Types.ObjectId; 
    username: string;
    email: string;
    Password: string;
    role: "student" | "teacher" | "admin";
    isAccountVerified: boolean;
    verifyOTP: string;
    verifyOTPExpiresAt: number;
    resetOTP: string;
    resetOTPExpiresAt: number;
    is2FAEnabled: boolean;
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
    confirmPassword: string,
    role?: "student" | "teacher" | "admin"
}

export type UserDocument = HydratedDocument<IUser>;