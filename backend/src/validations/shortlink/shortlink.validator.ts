import { z } from "zod";

const createShortLinkValidator = z.object({
    body: z.object({
        longUrl: z.string().min(6, "Url Length Needs to be minimum of 6 chars").max(2000, "Url Length Needs to be Maximum of 2000 chars").url("Please enter a valid url").trim(),
        isActive: z.boolean().optional().default(true)
    })
});

const updateShortLinkValidator = z.object({
    params: z.object({
        urlId: z.string()
            .trim()
    }),
    body: z.object({
        longUrl: z.string().min(6, "Url Length Needs to be minimum of 6 chars").max(2000, "Url Length Needs to be Maximum of 2000 chars").url("Please enter a valid url").trim(),
        isActive: z.boolean().optional().default(true)
    })
});

export { createShortLinkValidator, updateShortLinkValidator };