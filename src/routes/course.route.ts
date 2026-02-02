import express from "express";
import courseController from "../controllers/course.controller";
import { authMiddleware, authorizeRole } from "redis-jwt-auth";
import { upload } from "../middlewares/multer.middleware";

const router = express.Router()

router.get("/", courseController.getAllCourses);
router.get("/:id", authMiddleware({ required: true }), courseController.getCourseById);
router.post("/create", authMiddleware({ required: true }), authorizeRole('teacher'), upload.single("thumbnail"), courseController.createCourse)

export default router;