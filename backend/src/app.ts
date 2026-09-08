import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import config from "./config/config.js";
import session from "express-session"
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import type { Request, Response, NextFunction } from "express";
import redisClient from "./database/redis.js";

import { sequelize } from "./database/database.js";
import connectDB from "./database/database.js";

import "./models/index.model.js"

import logger, { requestLogger } from "./utils/logger.util.js"

import userRouter from "./routes/v1/users/user.route.js"
import shortLinkRouter from "./routes/v1/shortLinks/shortLink.route.js"
import dashboardRouter from "./routes/v1/dashboard/dashboard.route.js"

import { getOriginalUrl } from "./controllers/v1/shortlinks/shortlink.controller.js";

import sendResponse from "./utils/responseHandler.util.js";
import { errorHandler } from "./middlewares/v1/error.middleware.js";
import { sendErrorPage } from "./utils/errorPage.util.js";

import { RedisStore } from "connect-redis";
import { RedisStore as RateLimitRedisStore } from "rate-limit-redis";

const app = express();

app.set('trust proxy', 1)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files (HTML, CSS, JS) from the public directory
app.use("/public", express.static(path.join(__dirname, "../public")));

app.use(requestLogger);
app.use(cookieParser());

// Create a wrapper for ioredis to be compatible with connect-redis v9 (which expects node-redis v4 semantics)
const connectRedisClient = {
    get: (key: string) => redisClient.get(key),
    set: (key: string, value: string, opts?: any) => {
        if (opts && typeof opts === "object") {
            if (opts.PX) return redisClient.set(key, value, "PX", opts.PX);
            if (opts.EX) return redisClient.set(key, value, "EX", opts.EX);
        }
        return redisClient.set(key, value);
    },
    del: (key: string) => redisClient.del(key),
    expire: (key: string, seconds: number) => redisClient.expire(key, seconds),
    pexpire: (key: string, ms: number) => redisClient.pexpire(key, ms)
} as any;

// Initialize Redis session store
app.use(session({
    store: new RedisStore({
        client: connectRedisClient,
        prefix: "auth:session:"
    }),
    secret: config.SESSION.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: config.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days (aligning with refresh token duration)
    }
}));

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    store: new RateLimitRedisStore({
        // ioredis call signature compatibility
        sendCommand: (...args: string[]) => redisClient.call(args[0], ...args.slice(1)) as any,
    }),
    handler: async (_req: Request, res: Response, _next: NextFunction, options) => {
        await sendErrorPage(res, options.statusCode, "429.html");
    }
});

app.use(cors(
    {
        origin: config.ALLOWED_ORIGINS,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        exposedHeaders: ["Authorization"],
        credentials: true
    }
));

app.use(limiter)


app.use(express.json({
    limit: "10mb",
    strict: true,
    type: 'application/json'
}));

app.use(express.urlencoded({
    extended: true,
    limit: "10mb",
    type: 'application/x-www-form-urlencoded'
}));

app.use("/api/v1/health", async (_req: Request, res: Response) => {
    sendResponse(res, 200, "Health is OK", null);
    return;
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/shortlinks", shortLinkRouter);
app.use("/api/v1/dashboard", dashboardRouter);

app.get("/api/v1/redirect/:shortCode", getOriginalUrl);

// Catch-all route for undefined endpoints (404)
app.use(async (_req: Request, res: Response) => {
    await sendErrorPage(res, 404, "404.html");
});

app.use(errorHandler);

const connectDataBase = async () => {
    try {
        await connectDB();
        await sequelize.sync({
            force: Boolean(config.DB.FORCE_DROP_TABLE === "true"),
            alter: Boolean(config.DB.FORCE_ALTER_TABLE === "true")
        });
        logger.log("🛢️ ♻️  Database synced successfully");
    } catch (error) {
        logger.error(`♻️ 💥Error in connecting to database: ${error}`);
        process.exit(1);
    }
}

const startServer = async () => {
    try {
        app.listen(config.PORT, () => {
            logger.log(`🖧 ✅ Server is running on port ${config.PORT}`);
        })
    } catch (error) {
        logger.error(`🖧 ❌ Error in starting server: ${error}`);
        process.exit(1);
    }
}

export { startServer, connectDataBase };