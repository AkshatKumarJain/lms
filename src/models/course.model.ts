import mongoose, {Model} from "mongoose";
import { ICourse } from "../interfaces/course.interface";

const courseSchema = new mongoose.Schema<ICourse>({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: "NA"
    },
    thumbnail: {
        type: String,
        required: true
    },
    totalEnrolledStudends: {
        type: Number,
        default: 0
    },
    enrolledStudents: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Student",
        default: []
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        required: true
    },
    isPublished: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const courseModel = mongoose.model<ICourse>("Course", courseSchema);
export default courseModel;