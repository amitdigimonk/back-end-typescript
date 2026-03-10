import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { HttpStatusCode } from '../../constants/httpStatus';

export const getHealth = async (_req: Request, res: Response, next: NextFunction) => {
    try {

        const dbStatus = mongoose.connection.readyState === 1 ? 'UP' : 'DOWN';

        const httpStatus = dbStatus === 'UP' ? HttpStatusCode.OK : HttpStatusCode.INTERNAL_SERVER_ERROR;

        res.status(httpStatus).json({
            status: dbStatus === 'UP' ? 'success' : 'error',
            message: 'Server Health Check',
            data: {
                server: 'UP',
                database: dbStatus,
                timestamp: new Date().toISOString(),
                uptime: process.uptime()
            }
        });
    } catch (err) {
        next(err);
    }
};