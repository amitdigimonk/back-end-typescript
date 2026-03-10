import { Request, Response, NextFunction } from 'express';
import { SubCategory } from './sub-category.model';
import { HttpStatusCode } from '../../constants/httpStatus';


export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, description } = req.body;
        const slug = name.toLowerCase().replace(/ /g, '-');

        const existing = await SubCategory.findOne({ slug });
        if (existing) {
            return res.status(HttpStatusCode.CONFLICT).json({
                status: 'error',
                message: req.t('sub_category.exists')
            });
        }

        const subCategory = await SubCategory.create({
            name,
            slug,
            description
        });

        res.status(HttpStatusCode.CREATED).json({
            status: 'success',
            message: req.t('sub_category.created'),
            data: subCategory
        });
    } catch (error) {
        next(error);
    }
};

export const list = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const [subCategories, total] = await Promise.all([
            SubCategory.find()
                .sort({ name: 1 })
                .skip(skip)
                .limit(limit),
            SubCategory.countDocuments()
        ]);

        res.status(HttpStatusCode.OK).json({
            status: 'success',
            message: req.t('sub_category.fetched'),
            data: subCategories,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name, description, isActive } = req.body;

        let updateData: any = { description, isActive };

        if (name) {
            updateData.name = name;
            updateData.slug = name.toLowerCase().replace(/ /g, '-');

            const existing = await SubCategory.findOne({
                slug: updateData.slug,
                _id: { $ne: id as string }
            });

            if (existing) {
                return res.status(HttpStatusCode.CONFLICT).json({
                    status: 'error',
                    message: req.t('sub_category.exists')
                });
            }
        }

        const updatedSubCategory = await SubCategory.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedSubCategory) {
            return res.status(HttpStatusCode.NOT_FOUND).json({
                status: 'error',
                message: req.t('category.not_found')
            });
        }

        res.status(HttpStatusCode.OK).json({
            status: 'success',
            message: req.t('sub_category.updated'),
            data: updatedSubCategory
        });

    } catch (error) {
        next(error);
    }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const deletedSubCategory = await SubCategory.findByIdAndDelete(id);

        if (!deletedSubCategory) {
            return res.status(HttpStatusCode.NOT_FOUND).json({
                status: 'error',
                message: req.t('errors.not_found')
            });
        }

        res.status(HttpStatusCode.OK).json({
            status: 'success',
            message: req.t('sub_category.deleted')
        });
    } catch (error) {
        next(error);
    }
};