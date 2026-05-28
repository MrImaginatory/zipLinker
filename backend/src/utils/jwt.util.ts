import jwt from "jsonwebtoken";
import config from "../config/config.js";
import redisClient from "../database/redis.js";
import { v4 as uuidv4 } from "uuid";

export interface TokenPayload {
    userId: string;
    jti?: string;
    type?: "access" | "refresh";
}

export const generateAndStoreTokens = async (userId: string, ip: string) => {
    const jti = uuidv4();
    
    const accessToken = jwt.sign({ userId, jti, type: "access" }, config.JWT.SECRET, {
        expiresIn: config.JWT.EXPIRES_IN as any
    });
    
    const refreshToken = jwt.sign({ userId, jti, type: "refresh" }, config.JWT.SECRET, {
        expiresIn: config.JWT.REFRESH_EXPIRES_IN as any
    });

    const accessDecoded = jwt.decode(accessToken) as jwt.JwtPayload;
    const refreshDecoded = jwt.decode(refreshToken) as jwt.JwtPayload;

    const currentSeconds = Math.floor(Date.now() / 1000);
    const accessTTL = accessDecoded.exp! - currentSeconds;
    const refreshTTL = refreshDecoded.exp! - currentSeconds;

    await redisClient.set(
        `auth:access:${userId}:${jti}`, 
        JSON.stringify({ ip }), 
        "EX", 
        accessTTL
    );
    
    await redisClient.set(
        `auth:refresh:${userId}:${jti}`, 
        JSON.stringify({ ip }), 
        "EX", 
        refreshTTL
    );

    return { accessToken, refreshToken };
}

export const verifyToken = (token: string): TokenPayload | { error: string } | null => {
    try {
        return jwt.verify(token, config.JWT.SECRET) as TokenPayload;
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            return { error: 'expired' };
        }
        return null;
    }
}