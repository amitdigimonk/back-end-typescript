import { Router } from 'express';
import { create, list, remove, update } from './sub-category.controller';
import { validate } from '../../middlewares/validate';
import { createSubCategorySchema, deleteSubCategorySchema, updateSubCategorySchema } from './sub-category.validation';

const router = Router();


router.post('/', validate(createSubCategorySchema), create);
router.get('/list', list)
router.put('/:id', validate(updateSubCategorySchema), update);
router.delete('/:id', validate(deleteSubCategorySchema), remove)

export default router;