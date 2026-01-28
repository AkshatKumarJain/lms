import mongoose from "mongoose";

export interface ICourse{
    title: string,
    description?: string,
    thumbnail: string,
    totalEnrolledStudends?: Number,
    enrolledStudents?: Array<mongoose.Types.ObjectId>,
    author: mongoose.Types.ObjectId,
    isPublished: boolean
}

export interface ISection{
    title: string,
    course: mongoose.Types.ObjectId,
    order: number
}

export interface ILesson{
    title?: string,
    section: mongoose.Types.ObjectId,
    order: number
}