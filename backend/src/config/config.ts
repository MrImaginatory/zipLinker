import dotenv from "dotenv";

dotenv.config();

const missingKeys: string[] = [];

const getEnv = (key: string, required: boolean = true): string => {
    const value = process.env[key];
    if (required && (value === undefined || value === null || value === "")) {
        missingKeys.push(key);
    }
    return value || "";
}

const config = {
    PORT: getEnv("PORT", true),

    DB: {
        DB_NAME: getEnv("DB_NAME", true),
        DB_HOST: getEnv("DB_HOST", true),
        DB_PORT: getEnv("DB_PORT", true),
        DB_USER: getEnv("DB_USER", true),
        DB_PASSWORD: getEnv("DB_PASSWORD", true),

        FORCE_DROP_TABLE: getEnv("FORCE_DROP_TABLE", true),
        FORCE_ALTER_TABLE: getEnv("FORCE_ALTER_TABLE", true),

        POOL: {
            MIN: getEnv("POOL_MIN", true),
            MAX: getEnv("POOL_MAX", true),
            ACQUIRE: getEnv("POOL_ACQUIRE", true),
            IDLE: getEnv("POOL_IDLE", true),
        },

        RETRY: {
            MAX: getEnv("DB_CONN_MAX_RETRY", true),
        },

        DEFINE: {
            TIMESTAMPS: getEnv("TIMESTAMPS", true),
            UNDERSCORE: getEnv("UNDERSCORE", true),
            FREEZE_TABLE_NAME: getEnv("FREEZE_TABLE_NAME", true),
        },

        TIMEZONE: getEnv("TIMEZONE", true),

    },

    REDIS: {
        HOST: getEnv("REDIS_HOST", true),
        PORT: getEnv("REDIS_PORT", true),
        PASSWORD: getEnv("REDIS_PASSWORD", false),
        URL: getEnv("REDIS_URL", false)
    },

    ALLOWED_ORIGINS: getEnv("ALLOWED_ORIGINS", true).split(","),

    WEBSITE_URL: getEnv("WEBSITE_URL", true),

    BASE_URL: getEnv("BASE_URL", true),

    DIR: {
        LOG: getEnv("LOG_DIR", true),
    },

    SESSION: {
        SECRET: getEnv("SESSION_SECRET", true),
    },

    NODE_ENV: getEnv("NODE_ENV", true),

    JWT: {
        SECRET: getEnv("JWT_SECRET", true),
        EXPIRES_IN: getEnv("JWT_EXPIRES_IN", true),
        REFRESH_EXPIRES_IN: getEnv("JWT_REFRESH_EXPIRES_IN", false) || "7d"
    },
    
    REDIRECT: {
        COUNTDOWN: parseInt(getEnv("REDIRECT_COUNTDOWN", false) || "5", 10)
    }
}

if (missingKeys.length > 0) {
    console.error("❌ Missing Environment Variables in .env file:");
    missingKeys.forEach(key => {
        console.error(`  - [${key}] is required but missing or empty`);
    });
    console.log("Exiting the Process");
    process.exit(1);
}

export default config;