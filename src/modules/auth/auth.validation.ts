import { z } from 'zod';

export const registerSchema = z.object({
    body: z.object({
        name: z.string()
            .min(2, { message: "Name must be at least 2 characters long" })
            .max(50, { message: "Name cannot exceed 50 characters" }),

        email: z.string()
            .email({ message: "Invalid email address" }),

        password: z.string()
            .min(6, { message: "Password must be at least 6 characters long" })
    })
});

export const loginSchema = z.object({
    body: z.object({
        email: z.email({ message: "Invalid email address" }),

        password: z.string()
            .min(1, { message: "Password is required" })
    })
});


export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];