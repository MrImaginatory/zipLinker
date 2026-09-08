import { z } from "zod";

const validateUserData = z.object({
    body: z.object({
        userName: z.string("userName is required").min(2, " userName must be at least 2 characters long").max(20, "userName must be at most 20 characters long"),
        email: z.string("Email is required").email("Invalid email address"),
        password: z.string("Password is required").min(6, "Password must be at least 6 characters long").max(20, "Password must be at most 20 characters long"),
    })
})

const validateLoginData = z.object({
    body: z.object({
        email: z.string("Email is required").email("Invalid email address"),
        password: z.string("Password is required").min(6, "Password must be at least 6 characters long").max(20, "Password must be at most 20 characters long"),
    })
})

export { validateUserData, validateLoginData }