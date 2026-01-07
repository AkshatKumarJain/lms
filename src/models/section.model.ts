import mongoose from "mongoose"
import { ISection } from "../interfaces/course.interface"

const sectionSchema = new mongoose.Schema<ISection>({
    title: {
        type: String,
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    order: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const Section = mongoose.model<ISection>("Section", sectionSchema);
export default Section;