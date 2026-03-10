import { z } from 'zod';

export const createSubCategorySchema = z.object({
    body: z.object({
        name: z.string({
            error: 'Name is required'
        }).min(3, 'Name must be at least 3 characters long'),
        description: z.string().optional(),
    })
});

export const updateSubCategorySchema = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format')
    }),
    body: z.object({
        name: z.string().min(3).optional(),
        description: z.string().optional(),
        isActive: z.boolean().optional()
    })
});

export const deleteSubCategorySchema = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format')
    })
});