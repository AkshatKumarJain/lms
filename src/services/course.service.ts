import mongoose from "mongoose";
import courseModel from "../models/course.model";
import { userModel } from "../models/user.model";
import transporter from "../config/nodemailer.config";

class Course{
    async createCourse(title: string, description: string, thumbnail: string, author: string) {
        const course = await courseModel.create({
            title: title,
            description: description,
            thumbnail: thumbnail,
            author: author
        })

        if(!course)
        {
            throw new Error("Cannot create course");
        }

        await this.sendCreateCourseMail(author, course._id.toString(), title);

        return course;
    }

    private async sendCreateCourseMail(author: string, courseId: string, title: string){
        const findAuthor = await userModel.findOne({author});
        if(!findAuthor)
        {
            console.log("No such user exists");
            return;
        }
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: findAuthor.email,
            subject: `Course created successfully.`,
            text: `Hello ${findAuthor.username}, you just published a course: ${title} with course id: ${courseId} with email: ${findAuthor.email}.`
        }

        const mail = await transporter.sendMail(mailOptions);
        if (!mail) {
            console.log("couldn't send mail");
        }

        else{
            console.log(mail);
        }
    }
}

export = new Course;