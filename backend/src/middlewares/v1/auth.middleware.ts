import { Request, Response, NextFunction } from "express";
import sendResponse from "../../utils/responseHandler.util.js";
import { verifyToken } from "../../utils/jwt.util.js";
import redisClient from "../../database/redis.js";

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.authToken || req.headers.authorization?.split(' ')[1];
    if (!token) {
        sendResponse(res, 401, "Unauthorized: Please login to perform this action");
        return;
    }

    const decodedToken = verifyToken(token);

    if (!decodedToken) {
        sendResponse(res, 401, "Unauthorized: Invalid token");
        return;
    }

    if ('error' in decodedToken) {
        if (decodedToken.error === 'expired') {
            sendResponse(res, 401, "Session timed out please login again");
            return;
        }
        sendResponse(res, 401, "Unauthorized: Invalid token");
        return;
    }

    // Verify token exists in Redis and IP matches
    if (decodedToken.jti && decodedToken.userId) {
        try {
            const storedToken = await redisClient.get(`auth:access:${decodedToken.userId}:${decodedToken.jti}`);
            if (!storedToken) {
                sendResponse(res, 401, "Unauthorized: Token revoked or expired");
                return;
            }

            const parsedData = JSON.parse(storedToken);
            const clientIp = req.ip || req.socket.remoteAddress || "0.0.0.0";

            if (parsedData.ip !== clientIp) {
                console.warn(`IP mismatch for user ${decodedToken.userId}. Expected ${parsedData.ip}, got ${clientIp}`);
                sendResponse(res, 403, "Forbidden: IP address mismatch");
                return;
            }
        } catch (error) {
            console.error("Redis error in auth middleware", error);
            sendResponse(res, 500, "Internal Server Error");
            return;
        }
    }

    req.userId = decodedToken.userId;
    if (decodedToken.jti) {
        req.jti = decodedToken.jti;
    }

    next();
};
