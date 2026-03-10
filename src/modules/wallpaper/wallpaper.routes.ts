import { Router } from 'express';
import { create, list, remove, update } from './wallpaper.controller';
import { validate } from '../../middlewares/validate';
import { updateWallpaperSchema } from './wallpaper.validation';
import { upload } from '../../middlewares/upload';

const router = Router();

// router.post('/', upload.array('assets', 5), validate(createWallpaperSchema), create);
router.post('/', upload.array('assets', 5), create);
router.get('/list', list);
router.put('/:id', validate(updateWallpaperSchema), update);
router.delete('/:id', remove);

export default router;