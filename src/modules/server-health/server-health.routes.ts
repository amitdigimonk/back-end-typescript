import { Router } from 'express';
import { getHealth } from './server-health.controller';

const router = Router();

router.get('/', getHealth);

export default router;