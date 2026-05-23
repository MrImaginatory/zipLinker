import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import type { ZodSchema } from "zod";
import sendResponse from "../../utils/responseHandler.util.js";

export const validate = (schema: ZodSchema) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            return next();
        } catch (error) {
            if (error instanceof ZodError) {
                // Combine all validation errors into a single message
                const message = error.issues
                    .map((issue) => issue.message)
                    .join(", ");

                sendResponse(_res, 400, message);
                return;
            }
            return next(error);
        }
    };
};

export default validate;