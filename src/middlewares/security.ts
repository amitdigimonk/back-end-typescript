import { Request, Response, NextFunction } from 'express';

const clean = (obj: any): any => {
    if (Array.isArray(obj)) {
        return obj.map(clean);
    }
    if (obj !== null && typeof obj === 'object') {
        return Object.keys(obj).reduce((acc, key) => {
            if (key.startsWith('$') || key.includes('.')) {
                return acc;
            }
            acc[key] = clean(obj[key]);
            return acc;
        }, {} as any);
    }
    return obj;
};

export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
    if (req.body) {
        req.body = clean(req.body);
    }

    if (req.query) {
        const cleanedQuery = clean(req.query);

        // Remove all original keys
        for (const key of Object.keys(req.query)) {
            delete req.query[key];
        }


        Object.assign(req.query, cleanedQuery);
    }

    next();
};