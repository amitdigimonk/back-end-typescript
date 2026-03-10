import rateLimit from 'express-rate-limit';
import { HttpStatusCode } from '../constants/httpStatus';
import { Request, Response } from 'express';


export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    handler: (req: Request, res: Response) => {
        res.status(HttpStatusCode.TOO_MANY_REQUESTS).json({
            status: 'error',
            statusCode: HttpStatusCode.TOO_MANY_REQUESTS,
            message: req.t('errors.too_many_requests')
        });
    }
});

export const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 15,
    handler: (req: Request, res: Response) => {
        res.status(HttpStatusCode.TOO_MANY_REQUESTS).json({
            status: 'error',
            statusCode: HttpStatusCode.TOO_MANY_REQUESTS,
            message: req.t('auth.too_many_attempts')
        });
    }
});