import mongoose, {Document} from "mongoose"

export interface IUser extends Document{
    username: string,
    email: string,
    Password: string,
    role: string,
    isAccountVerified: boolean,
    verifyOTP: string,
    verifyOTPExpiresAt: number,
    resetOTP: string,
    resetOTPExpiresAt: number
}

export interface Istudent{
    userId: mongoose.Types.ObjectId,
    enrolledCourses: Array<mongoose.Types.ObjectId>,
    completedCourses: Array<mongoose.Types.ObjectId>
}

export interface Iteacher{
    userId: mongoose.Types.ObjectId,
    publishedCourses: Array<mongoose.Types.ObjectId>
}