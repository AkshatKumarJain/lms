import express from "express";
import { Request, Response } from "express";
import courseService from "../services/course.service";
import { ICourse, ISection, ILesson } from "../interfaces/course.interface";
import userService from "../services/user.service";

class CourseController{
    async getAllCourses(req: Request, res: Response): Promise<Response>{
        try {
            const allCourses = await courseService.getAllCourses();
            return res.status(200).json({
                message: "Courses fetched successfully",
                data: allCourses
            })
        } catch (error) {
            return res.status(500).json({
                error: (error as Error).message
            })
        }
    }

    async getCourseById(req: Request, res: Response): Promise<Response>{
        const {courseId} = req.params;
        if(!courseId)
        {
            return res.status(400).json({
                message: "Course id is necessary"
            })
        }

        try {
            const courseById = await courseService.getCourseById(courseId);
            return res.status(200).json({
                message: "Course fetched successfully",
                data: courseById
            })
        } catch (error) {
            return res.status(500).json({
                error: (error as Error).message
            })
        }
    }

    async createCourse(req: Request, res: Response): Promise<Response>{
        const author = req.user?.userId;
        const { title, description } = req.body;
        const thumbnail = req.file
        if(!author)
        {
            return res.status(400).json({
                message: "No user found"
            })
        }
        if(!title)
        {
            return res.status(300).json({
                message: "Title is required"
            })
        }
        try {
           const createdCourse = await courseService.createCourse({author, title, description, thumbnail});

           return res.status(201).json({
               message: "Course created successfully",
               data: createdCourse
        }) 
        } catch (error) {
            return res.status(500).json({
                error: (error as Error).message
            })
        }
    }
}

export = new CourseController;