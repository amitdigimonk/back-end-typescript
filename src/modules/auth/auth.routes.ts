import { Router } from 'express';
import { register, login } from './auth.controller';
import { validate } from '../../middlewares/validate';
import { registerSchema, loginSchema } from './auth.validation';

const router = Router();


/**
 * @desc Registers a new user
 * @body name, email, password
 */
router.post('/register', validate(registerSchema), register);

/**
 * @desc Logs in a user
 * @body email, password
 */

router.post('/login', validate(loginSchema), login);

export default router;