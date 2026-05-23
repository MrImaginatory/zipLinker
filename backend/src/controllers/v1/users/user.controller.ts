import User from "../../../models/users/user.model.js";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import sendResponse from "../../../utils/responseHandler.util.js"
import logger from "../../../utils/logger.util.js";

const signupController = async (req: Request, res: Response) => {
    const { email, userName, password } = req.body;

    try {

        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return sendResponse(res, 409, "User Already Exists! Please Login");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email,
            userName,
            password: hashedPassword
        })
        // req.session.userId = user.userId;
        return sendResponse(res, 201, "User Created Successfully", user.userId);
    } catch (error) {
        logger.error(`[${req.method} ${req.originalUrl}] Error in signupController : ${error}`);
        return sendResponse(res, 500, "Internal Server Error");
    }
}

const loginController = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return sendResponse(res, 401, "Invalid Credentials");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return sendResponse(res, 401, "Invalid Credentials");
        }
        req.session.userId = user.userId;
        return sendResponse(res, 200, "User Logged In Successfully", user.userId);
    } catch (error) {
        logger.error(`[${req.method} ${req.originalUrl}] Error in loginController : ${error}`);
        return sendResponse(res, 500, "Internal Server Error");
    }
}

export {
    signupController,
    loginController
}