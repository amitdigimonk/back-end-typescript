import { env } from '../env';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { HttpStatusCode } from '../constants/httpStatus';
import User from '../modules/auth/user.model';

interface JwtPayload {
    id: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            res.status(HttpStatusCode.UNAUTHORIZED).json({
                status: 'fail',
                message: req.t('auth.token_failed')
            });
        }
    }

    if (!token) {
        res.status(HttpStatusCode.UNAUTHORIZED).json({
            status: 'fail',
            message: req.t('auth.no_token')
        });
    }
};