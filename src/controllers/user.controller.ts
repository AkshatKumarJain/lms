import express from "express";
import { Request, Response } from "express";
// import userModel from "../models/user.model";
import { createUserDTO, IUser } from "../interfaces/user.interface";
import userService from "../services/user.service";

class UserController{
    async getAllUsers(req: Request, res: Response): Promise<Response>{
        try {
            const allUser = await userService.getAllUsers();
            return res.status(200).json({
                data: allUser,
                message: "Data fetched successfully",
            })
        } catch (error) {
            return res.status(500).json({
                message: "Error",
                error: (error as Error).message
            })
        }
    }

    async getUserByEmail(req: Request, res: Response): Promise<Response> {
        const {email} = req.body;
        if(!email)
        {
            return res.status(400).json({
                message: "Email is required"
            })
        }
        try {
            const getUser = await userService.getUserByEmail(email);
            return res.status(200).json({
                data: getUser,
                message: "User fetched successfully"
            })
        } catch (error) {
            return res.status(500).json({
                error: (error as Error).message
            })
        }
    }

    async getUserProfile(req: Request, res: Response): Promise<Response> {
        const userId = req.user!.userId;
        if(!userId)
        {
            return res.status(400).json({
                message: "Invalid token"
            })
        }

        try {
            const userProfile = await userService.getUserProfile(userId);
            if(!userProfile)
            {
                return res.status(400).json("No such user");
            }
            return res.status(200).json({
                message: "User profile fetched successfully",
                data: userProfile
            })
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error",
                error: (error as Error).message
            })
        }
    }

    async createUser(req: Request, res: Response): Promise<Response>{
        try {
            const payload: createUserDTO = req.body;
            const createdUser = await userService.createUser(payload);
            return res.status(201).json({
                data: createdUser,
                message: "User created successfully"
            })
        } catch (error) {
            return res.status(500).json({
                error: (error as Error).message
            })
        }
    }

    async deleteUser(req: Request, res: Response): Promise<Response>{
        const {email} = req.body;
        if(!email)
        {
            return res.status(400).json({
                message: "email is required"
            })
        }
        try {
        const deletedUser = await userService.deleteUser(email);
        if(!deletedUser)
        {
            return res.status(400).json({
                message: "No user found with this email"
            })
        }
        return res.status(201).json({
            data: deletedUser,
            message: "User deleted successfully"
        })
        } catch (error) {
            return res.status(500).json({
                error: (error as Error).message
            })
        }
    }

    async loginUser(req: Request, res: Response): Promise<Response>{
        const {email, password} = req.body;
        try {
            const token = await userService.loginUser(email, password);
            console.log("token ", token );
            if(!token)
            {
                return res.status(404).json({
                    message: "could not get token"
                })
            }
            return res.status(200).json({
            token,
            message: "Success"
        })
        } catch (error) {
            return res.status(500).json({
                error: (error as Error).message
            });
        }
    }

    async logoutUser(req: Request, res: Response): Promise<Response>{
        const {userId} = req.body;
        if(!userId)
        {
            return res.status(404).json({
                message: "couldn't fetch data"
            })
        }
        try {
            const isLogout = await userService.logoutUser(userId);
            if(!isLogout)
            {
                return res.status(400).json({
                    message: "something went wrong"
                })
            }
            return res.status(200).json({
                data: userId,
                message: "User logout successful"
            })
        } catch (error) {
            return res.status(500).json({
                error: (error as Error).message
            })
        }
    }

    async rotateRefreshToken(req: Request, res: Response): Promise<Response>{
        const {refreshToken} = req.body;
        if(!refreshToken)
        {
            return res.status(404).json({
                message: "refresh tokens are empty"
            })
        }
        try {
            const isRotate = await userService.refreshUser(refreshToken);
            if(!isRotate)
            {
                return res.status(400).json({
                    message: "Something went wrong"
                })
            }
            return res.status(200).json({
                message: "user refreshed successfully"
            })
        } catch (error) {
            return res.status(500).json({
                error: (error as Error).message
            })
        }
    }

    async sendVerifyOTP(req: Request, res: Response): Promise<Response>{
        const {userId} = req.body;
        if(!userId)
        {
            return res.status(400).json({
                message: "UserId is required"
            })
        }
        try {
            const otp = await userService.sendVerifyOTP(userId);
            if(!otp)
            {
                return res.status(300).json({
                    message: "could not send otp."
                })
            }
            return res.status(200).json({
                otp,
                message: "Otp sent successfully."
            })
        } catch (error) {
            return res.status(500).json({
                error: (error as Error).message
            })
        }
    }

    async verifyEmail(req: Request, res: Response): Promise<Response>{
        const { userId, otp } = req.body;
        if(!userId)
        {
            return res.status(400).json({
                message: "User id is important"
            })
        }
        try {
            const isEmailVerified = await userService.verifyEmail(userId, otp);
            if(!isEmailVerified)
            {
                return res.status(400).json({
                    message: "could not verify email"
                })
            }
            return res.status(200).json({
                message: "Email has been verified"
            })
        } catch (error) {
            return res.status(500).json({
                error: (error as Error).message
            })
        }
    }

    async forgotPassword(req: Request, res: Response): Promise<Response>{
        const {email} = req.body;
        if(!email)
        {
            return res.status(400).json({
                message: "Email is required"
            })
        }

        try {
            const isEmailSent = await userService.forgotPassword(email);
            if(!isEmailSent)
            {
                return res.status(400).json({
                    message: "could not send email"
                })
            }

            return res.status(200).json({
                message: "If this email exists, email will be sent."
            })
        } catch (error) {
            return res.status(500).json({
                error: (error as Error).message
            })
        }
    }

    async resetPassword(req: Request, res: Response): Promise<Response>{
        const {token} = req.params;
        const {newPassword} = req.body;
        if (!token) {
        return res.status(400).json({ message: "Reset token is required" });
        }
        if(!newPassword)
            {
                return res.status(400).json({
                    message: "New password is required"
                })
            }
        try {
            const result = await userService.resetPassword(token, newPassword);
            
            return res.status(201).json({
                message: "Password has been changed successfully"
            })
        } catch (error) {
            return res.status(500).json({
                error: (error as Error).message
            })
        }
    }
}

export = new UserController();