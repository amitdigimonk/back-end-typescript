import { env } from '../../env';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from './user.model';
import { RegisterInput, LoginInput } from './auth.validation';
import { HttpStatusCode } from '../../constants/httpStatus';
import { logger } from '../../config/logger';


const generateToken = (id: string) => {
    return jwt.sign({ id }, env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

export const register = async (req: Request, res: Response) => {
    const { name, email, password } = req.body as RegisterInput;

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(HttpStatusCode.CONFLICT).json({
            status: 'fail',
            message: req.t('auth.email_exists')
        });
    }

    const user = await User.create({
        name,
        email,
        password
    });

    const token = generateToken(user.id);

    logger.info(`New user registered: ${email}`);

    return res.status(HttpStatusCode.CREATED).json({
        status: 'success',
        token,
        data: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
};


export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body as LoginInput;

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
        return res.status(HttpStatusCode.UNAUTHORIZED).json({
            status: 'fail',
            message: req.t('auth.invalid_credentials')
        });
    }

    const token = generateToken(user.id);

    user.lastLogin = new Date();

    await user.save();

    return res.status(HttpStatusCode.OK).json({
        status: 'success',
        token,
        data: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
};