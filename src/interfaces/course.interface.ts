import mongoose from "mongoose";

export interface ICourse{
    title: string,
    description: string,
    thumbnail: string,
    content: Array<[]>,
    totalEnrolledStudends: Number,
    enrolledStudents: Array<mongoose.Schema.Types.ObjectId>,
    author: mongoose.Schema.Types.ObjectId
}