import mongoose from "mongoose";
import { ILesson } from "../interfaces/course.interface";

const lessonSchema = new mongoose.Schema<ILesson>({
    title: {
        type: String,
        default: "NA"
    },
    section: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "section",
        required: true
    },
    order: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const Lesson = mongoose.model<ILesson>("Lesson", lessonSchema);
export default Lesson;
