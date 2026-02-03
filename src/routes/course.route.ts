import express from "express";
import courseController from "../controllers/course.controller";
import { authMiddleware, authorizeRole } from "redis-jwt-auth";
import { upload } from "../middlewares/multer.middleware";

const router = express.Router()

router.get("/", courseController.getAllCourses);
router.get("/:id", authMiddleware({ required: true }), courseController.getCourseById);
router.post("/create", authMiddleware({ required: true }), authorizeRole('teacher', 'admin'), upload.single("thumbnail"), courseController.createCourse);
router.get("/:courseId/:id", authMiddleware({ required: true }), courseController.getSectionById);
router.post("/create-section/:courseId", authMiddleware({ required: true }), authorizeRole('teacher', 'admin'), courseController.createSection);
// router.get(); // get lesson by id
// router.post() // create lesson

export default router;