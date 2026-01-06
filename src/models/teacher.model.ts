import mongoose from "mongoose";
import { ITeacher } from "../interfaces/user.interface";

const teacherSchema = new mongoose.Schema<ITeacher>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel'
    },
    publishedCourses: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Course'
    }
}, { timestamps: true });

export default mongoose.model("Teacher", teacherSchema);