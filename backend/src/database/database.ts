import { Sequelize } from "@sequelize/core";
import { PostgresDialect } from '@sequelize/postgres';
import config from "../config/config.js";
import logger from "../utils/logger.util.js";


const sequelize = new Sequelize({
    dialect: PostgresDialect,
    database: config.DB.DB_NAME,
    host: config.DB.DB_HOST,
    port: Number(config.DB.DB_PORT),
    user: config.DB.DB_USER,
    password: config.DB.DB_PASSWORD,

    // logging: config.NODE_ENV === "development" ? console.log : false,

    pool: {
        min: Number(config.DB.POOL.MIN),
        max: Number(config.DB.POOL.MAX),
        acquire: Number(config.DB.POOL.ACQUIRE),
        idle: Number(config.DB.POOL.IDLE),
    },

    retry: {
        max: Number(config.DB.RETRY.MAX),
    },

    define: {
        timestamps: Boolean(config.DB.DEFINE.TIMESTAMPS),
        underscored: Boolean(config.DB.DEFINE.UNDERSCORE),
        freezeTableName: Boolean(config.DB.DEFINE.FREEZE_TABLE_NAME),
    },

    timezone: config.DB.TIMEZONE,
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        logger.log("🛢️ Database connection established successfully");
    }
    catch (error) {
        logger.error(`🛢️ 💥 Database connection failed: ${error}`);
    }
}

export default connectDB;
export { sequelize }