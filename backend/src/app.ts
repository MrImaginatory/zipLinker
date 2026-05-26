import express from "express";
import cors from "cors";
import config from "./config/config.js";
import session from "express-session"
import cookieParser from "cookie-parser";

import { sequelize } from "./database/database.js";
import connectDB from "./database/database.js";

import "./models/index.model.js"

import logger, { requestLogger } from "./utils/logger.util.js"

import userRouter from "./routes/v1/users/user.route.js"
import shortLinkRouter from "./routes/v1/shortLinks/shortLink.route.js"
import dashboardRouter from "./routes/v1/dashboard/dashboard.route.js"

import { getRedirectLink } from "./controllers/v1/shortlinks/shortlink.controller.js";

const app = express();

app.use(requestLogger);
app.use(cookieParser());

app.use(cors(
    {
        origin: config.ALLOWED_ORIGINS,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
    }
));

app.use(session({
    secret: config.SESSION.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: config.NODE_ENV === "production"
    }
}));

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


app.use("/api/v1/users", userRouter);
app.use("/api/v1/shortlinks", shortLinkRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/:shortCode", getRedirectLink);

const connectDataBase = async () => {
    try {
        await connectDB();
        await sequelize.sync({
            force: Boolean(config.DB.FORCE_DROP_TABLE === "true"),
            alter: Boolean(config.DB.FORCE_ALTER_TABLE === "true")
        });
        logger.log("✅ Database synced successfully");
    } catch (error) {
        logger.error(`❌ Error in connecting to database: ${error}`);
        process.exit(1);
    }
}

const startServer = async () => {
    try {
        app.listen(config.PORT, () => {
            logger.log(`✅ Server is running on port ${config.PORT}`);
        })
    } catch (error) {
        logger.error(`❌ Error in starting server: ${error}`);
        process.exit(1);
    }
}

export { startServer, connectDataBase };