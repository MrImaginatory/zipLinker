import { Redis } from "ioredis";
import config from "../config/config.js";
import logger from "../utils/logger.util.js";

const redisClient = new Redis({
    host: config.REDIS.HOST,
    port: parseInt(config.REDIS.PORT),
    password: config.REDIS.PASSWORD,
});

redisClient.on("connect", () => {
    logger.log("⚡ Redis connected");
});

redisClient.on("error", (error) => {
    logger.error(`⚡ 💥 Redis connection error: ${error}`);
});

export default redisClient;