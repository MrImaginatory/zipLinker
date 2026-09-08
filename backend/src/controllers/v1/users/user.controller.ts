import User from "../../../models/users/user.model.js";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import sendResponse from "../../../utils/responseHandler.util.js"
import logger from "../../../utils/logger.util.js";
import { generateAndStoreTokens } from "../../../utils/jwt.util.js";
import redisClient from "../../../database/redis.js";
import jwt from "jsonwebtoken";
import config from "../../../config/config.js";


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

        const clientIp = req.ip || req.socket.remoteAddress || "0.0.0.0";
        const userAgent = req.headers["user-agent"] || "";
        const tokens = await generateAndStoreTokens(user.userId, clientIp, userAgent);

        // Store session explicitly
        req.session.userId = user.userId;

        // Set token in cookie since middleware checks for req.cookies.authToken
        res.cookie('authToken', tokens.accessToken, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 15 // Match access token expiry (15m approx)
        });

        // Set refresh token in cookie as well, so frontend doesn't need to store it in localStorage
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 * 24 * 7 // Match refresh token expiry (7d approx)
        });

        return sendResponse(res, 200, "User Logged In Successfully", tokens);
    } catch (error) {
        logger.error(`[${req.method} ${req.originalUrl}] Error in loginController : ${error}`);
        return sendResponse(res, 500, "Internal Server Error");
    }
}

const logoutController = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        // Purge tokens from Redis if refresh token is provided
        if (refreshToken) {
            try {
                const decoded = jwt.decode(refreshToken) as jwt.JwtPayload;
                if (decoded && decoded.userId && decoded.jti) {
                    await redisClient.del(`auth:access:${decoded.userId}:${decoded.jti}`);
                    await redisClient.del(`auth:refresh:${decoded.userId}:${decoded.jti}`);
                }
            } catch (e) {
                logger.error(`Error decoding refresh token on logout: ${e}`);
            }
        }

        req.session.destroy((err) => {
            if (err) {
                logger.error(`Error destroying session during logout: ${err}`);
            }
        });

        res.clearCookie("authToken");
        res.clearCookie("refreshToken");
        sendResponse(res, 200, "User Logged Out Successfully");
    } catch (error) {
        logger.error(`Error in logoutController : ${error}`);
        sendResponse(res, 500, "Internal Server Error");
    }
}

const refreshController = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
        return sendResponse(res, 400, "Refresh Token is required");
    }

    try {
        // Verify refresh token signature and expiration
        const decoded = jwt.verify(refreshToken, config.JWT.SECRET) as jwt.JwtPayload;

        if (decoded.type !== "refresh") {
            return sendResponse(res, 401, "Invalid token type");
        }

        const { userId, jti } = decoded;

        // Verify token exists in Redis
        const storedTokenData = await redisClient.get(`auth:refresh:${userId}:${jti}`);
        if (!storedTokenData) {
            return sendResponse(res, 401, "Refresh token has been revoked or expired");
        }

        const clientIp = req.ip || req.socket.remoteAddress || "0.0.0.0";
        // In strict mode, we would verify IP here too:
        // const parsedData = JSON.parse(storedTokenData);
        // if (parsedData.ip !== clientIp) { return sendResponse(res, 403, "IP mismatch"); }

        // Optionally delete old tokens to rotate refresh token
        await redisClient.del(`auth:access:${userId}:${jti}`);
        await redisClient.del(`auth:refresh:${userId}:${jti}`);

        // Generate and store new tokens
        const userAgent = req.headers["user-agent"] || "";
        const tokens = await generateAndStoreTokens(userId, clientIp, userAgent);

        res.cookie('authToken', tokens.accessToken, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 15
        });

        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 * 24 * 7
        });

        return sendResponse(res, 200, "Tokens Refreshed Successfully", tokens);
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            return sendResponse(res, 401, "Refresh Token Expired");
        }
        logger.error(`[${req.method} ${req.originalUrl}] Error in refreshController : ${error}`);
        return sendResponse(res, 401, "Invalid Refresh Token");
    }
}

const getSessionsController = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const currentJti = req.jti;

        if (!userId) {
            return sendResponse(res, 401, "Unauthorized");
        }

        const jtis = await redisClient.smembers(`user:sessions:${userId}`);
        const sessions = [];

        for (const jti of jtis) {
            const sessionDataStr = await redisClient.get(`auth:access:${userId}:${jti}`);
            if (sessionDataStr) {
                const sessionData = JSON.parse(sessionDataStr);
                sessions.push({
                    ...sessionData,
                    isCurrentSession: jti === currentJti
                });
            } else {
                // Clean up expired session from the set
                await redisClient.srem(`user:sessions:${userId}`, jti);
            }
        }

        // Sort sessions by loginTime descending
        sessions.sort((a, b) => new Date(b.loginTime).getTime() - new Date(a.loginTime).getTime());

        return sendResponse(res, 200, "Active sessions retrieved successfully", sessions);
    } catch (error) {
        logger.error(`[${req.method} ${req.originalUrl}] Error in getSessionsController : ${error}`);
        return sendResponse(res, 500, "Internal Server Error");
    }
}

const revokeSessionController = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        const targetJti = req.params.jti;

        if (!userId || !targetJti) {
            return sendResponse(res, 400, "User ID and session JTI are required");
        }

        if (targetJti === req.jti) {
            return sendResponse(res, 403, "Cannot revoke the current active session");
        }

        // Remove from Redis
        await redisClient.del(`auth:access:${userId}:${targetJti}`);
        await redisClient.del(`auth:refresh:${userId}:${targetJti}`);
        await redisClient.srem(`user:sessions:${userId}`, targetJti as string);

        return sendResponse(res, 200, "Session revoked successfully");
    } catch (error) {
        logger.error(`[${req.method} ${req.originalUrl}] Error in revokeSessionController : ${error}`);
        return sendResponse(res, 500, "Internal Server Error");
    }
}

export {
    signupController,
    loginController,
    logoutController,
    refreshController,
    getSessionsController,
    revokeSessionController
}