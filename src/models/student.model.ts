import mongoose from "mongoose";
import { IStudent } from "../interfaces/user.interface";

const studentProfile = new mongoose.Schema<IStudent>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel'
    },
    enrolledCourses: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Course',
        default: []       
    },
    completedCourses: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Course',
        default: []
    }
},
{ timestamps: true }
)

export default mongoose.model<IStudent>("Student", studentProfile);