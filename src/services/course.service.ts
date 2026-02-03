import mongoose from "mongoose";
import courseModel from "../models/course.model";
import { userModel } from "../models/user.model";
import transporter from "../config/nodemailer.config";
import userService from "./user.service";
import { createCourseDTO, ICourse } from "../interfaces/course.interface";
import Section from "../models/section.model";
import Lesson from "../models/lesson.model";

class Course{
    async getAllCourses() {
        const allCourses = await courseModel.find();
        return allCourses;
    }

    async getCourseById(courseId: string) {
        const courseById = await courseModel.findById(courseId);
        return courseById;
    }

    async createCourse(data: createCourseDTO) {
        const { author, title, description, thumbnail } = data;
        const findUser = await userModel.findById(author);
        // console.log(findUser?.role);
        if(findUser?.isAccountVerified===false)
        {
            throw new Error("Your account must be verified for publishing a course");
        }
        const course = await courseModel.create({
            author: findUser?.username,
            title,
            description,
        } as ICourse)

        if(!course)
        {
            throw new Error("Cannot create course");
        }

        // image handling for thumbnail
        if(thumbnail)
        {
            const uploadThumbnail = await userService.uploadImage(thumbnail);
            course.thumbnail = uploadThumbnail.url
        }

        //await this.sendCreateCourseMail(author, course._id.toString(), title);

        return course;
    }

    // async publishCourse() {

    // }

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


    async createSection(title: string, courseId: string, order: number) {
        const findCourse = await courseModel.findById(courseId);
        if(!findCourse)
        {
            throw new Error("course with this id doesn't exists.");
        }
        const createdSection = await Section.create({
            title,
            course: findCourse._id,
            order
        })
        if(!createdSection)
        {
            throw new Error("Couldn't create section");
        }

        return createdSection;
    }

    async getSectionById(id: string, courseId: string) {
        const findCourse = await courseModel.findById(courseId);
        if(!findCourse)
        {
            throw new Error("Invalid course id");
        }
        const findSectionById = await Section.findById(id);
        return findSectionById;
    }

    async createLesson(title: string, sectionId: string, order: number) {
        const findSection = await Section.findById(sectionId);
        if(!findSection)
        {
            throw new Error("section with this id does not exists.");
        }
        const createdLesson = await Lesson.create({
            title,
            section: findSection._id,
            order
        })

        if(!createdLesson)
        {
            throw new Error("could not create lesson.");
        }

        return createdLesson;
    }

    async getLessonById(id: string) {
        const findLessonById = await Lesson.findById(id);
        return findLessonById;
    }

}

export = new Course;