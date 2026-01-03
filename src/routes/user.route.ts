import userController from "../controllers/user.controller";
import express from "express";
import { authMiddleware } from "redis-jwt-auth"

const router = express.Router();

router.get("/", userController.getAllUsers);
router.get("/findByEmail",authMiddleware({required: true}), userController.getUserByEmail);
router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);
router.delete("/delete", userController.deleteUser);
router.post("/logout", userController.logoutUser);
router.post("/refresh", userController.rotateRefreshToken);
router.post("/send-verify-otp", authMiddleware({required: true}), userController.sendVerifyOTP);
router.post("/verify-email", authMiddleware({required: true}), userController.verifyEmail);

export default router;