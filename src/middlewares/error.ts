import { env } from '../env';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { HttpStatusCode } from '../constants/httpStatus';

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {

    logger.error(err.message, {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        stack: err.stack
    });

    const statusCode = err.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message: env.NODE_ENV === 'development' ? message : req.t('errors.server_error')
    });
};