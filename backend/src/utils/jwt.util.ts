import jwt from "jsonwebtoken";
import config from "../config/config.js";


export interface TokenPayload {
    userId: string;
}

export const signToken = (userId: string) => {
    return jwt.sign({ userId }, config.JWT.SECRET, {
        expiresIn: config.JWT.EXPIRES_IN as any
    })
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