import { z } from 'zod';

const idRegex = /^[0-9a-fA-F]{24}$/;

export const createWallpaperSchema = z.object({
    body: z.object({
        title: z.string().min(3),
        category: z.enum(['static', 'interactive', 'game']),
        sub_category: z.string().regex(idRegex, 'Invalid SubCategory ID'),
        thumbnail_url: z.string().url().optional(),
        logic_script: z.object({
            code: z.string(),
            entry_point: z.string().optional()
        }).optional(),
        assets: z.record(z.string(), z.string()).optional(),
        config: z.any().optional()
    })
});

export const updateWallpaperSchema = z.object({
    params: z.object({ id: z.string().regex(idRegex) }),
    body: z.object({
        title: z.string().optional(),
        category: z.enum(['static', 'interactive', 'game']).optional(),
        sub_category: z.string().regex(idRegex).optional(),
        isActive: z.boolean().optional(),
        logic_script: z.object({
            code: z.string(),
            entry_point: z.string().optional()
        }).optional(),
        assets: z.record(z.string(), z.string()).optional(),
        config: z.any().optional()
    })
});