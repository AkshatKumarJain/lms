import express from "express";
import { Request, Response } from "express";
import userModel from "../models/user.model";
import { createUserDTO, IUser } from "../interfaces/user.interface";
import userService from "../services/user.service";

class UserController{
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
                message: "Error",
                error: error as Error
            })
        }
    }
}

export = new UserController();