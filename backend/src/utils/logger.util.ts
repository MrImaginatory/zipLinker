import winston from "winston"
import fs from "fs"
import config from "../config/config.js"

if (!fs.existsSync(config.DIR.LOG)) {
    fs.mkdirSync(config.DIR.LOG, { recursive: true });
}

const { combine, timestamp, printf, colorize } = winston.format;

const logFormat = printf(({ level, message, timestamp }) => {
    return `[${timestamp}] ${level} ${message}`
})

const loggerInstance = winston.createLogger({
    level: "info",

    format: combine(
        timestamp({
            format: "YYYY-MM-DD HH:mm:ss"
        }),
        logFormat,
    ),

    transports: [
        new winston.transports.File({
            filename: `${config.DIR.LOG}/combined.log`
        }),
        new winston.transports.File({
            filename: `${config.DIR.LOG}/error.log`,
            level: "error"
        })
    ]
})

if (config.NODE_ENV !== "production") {
    loggerInstance.add(
        new winston.transports.Console({
            format: combine(
                colorize(),
                timestamp({
                    format: "YYYY-MM-DD HH:mm:ss",
                }),
                logFormat
            ),
        })
    );
}

const logger = {
    log: (message: string) => {
        loggerInstance.info(message);
    },

    success: (message: string) => {
        loggerInstance.info(`✅ ${message}`);
    },

    warn: (message: string) => {
        loggerInstance.warn(`⚠️ ${message}`);
    },

    error: (message: string) => {
        loggerInstance.error(`❌ ${message}`);
    },
};

export const requestLogger = (req: import("express").Request, _res: import("express").Response, next: import("express").NextFunction) => {
    logger.log(`${req.method} ${req.originalUrl}`);
    next();
};

export default logger;
