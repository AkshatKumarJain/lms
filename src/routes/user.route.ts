import userController from "../controllers/user.controller";
import express from "express";
import { authMiddleware, authorizeRole } from "redis-jwt-auth"

const router = express.Router();

router.get("/", userController.getAllUsers);
router.get("/findByEmail", authMiddleware({required: true}), userController.getUserByEmail);
router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);
router.delete("/delete", authorizeRole("admin"), userController.deleteUser);
router.post("/logout", userController.logoutUser);
router.post("/refresh", userController.rotateRefreshToken);
router.post("/send-verify-otp", authMiddleware({required: true}), authorizeRole("student", "teacher"), userController.sendVerifyOTP);
router.post("/verify-email", authMiddleware({required: true}), authorizeRole("student", "teacher"), userController.verifyEmail);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password/:token", userController.resetPassword);

export default router;