import { Response } from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import config from "../config/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sendErrorPage = async (res: Response, statusCode: number, fileName: string) => {
    try {
        const filePath = path.join(__dirname, "../../public/errors", fileName);
        let html = await fs.readFile(filePath, "utf-8");
        
        // Replace placeholder URL with dynamic website URL from config
        html = html.replace(/{{WEBSITE_URL}}/g, config.WEBSITE_URL);
        
        res.status(statusCode).send(html);
    } catch (error) {
        // Fallback if file read fails
        res.status(statusCode).send(`Error ${statusCode}`);
    }
};
