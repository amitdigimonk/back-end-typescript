import { Router } from 'express';

import authRoutes from '../modules/auth/auth.routes'
import healthRoutes from '../modules/server-health/server-health.routes';
import subCategoryRoutes from '../modules/sub-category/sub-category.routes'
import { authLimiter } from '../config/security';
import wallpaperRoutes from '../modules/wallpaper/wallpaper.routes';


const rootRouter = Router();

rootRouter.use('/health', healthRoutes);
rootRouter.use('/auth', authLimiter, authRoutes);
rootRouter.use('/sub-category', subCategoryRoutes)
rootRouter.use('/wallpaper', wallpaperRoutes)


export default rootRouter;