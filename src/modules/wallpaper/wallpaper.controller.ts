import { Request, Response, NextFunction } from 'express';
import { Wallpaper } from './wallpaper.model';
import { HttpStatusCode } from '../../constants/httpStatus';

export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, category, sub_category, logic_script, config, asset_keys } = req.body;


        if (typeof req.body.logic_script === 'string') {
            req.body.logic_script = JSON.parse(req.body.logic_script);
        }
        if (typeof req.body.config === 'string') {
            req.body.config = JSON.parse(req.body.config);
        }
        if (typeof req.body.asset_keys === 'string') {
            req.body.asset_keys = JSON.parse(req.body.asset_keys);
        }

        const files = req.files as Express.Multer.File[];
        const assetsMap = new Map<string, string>();

        if (files && asset_keys) {
            const keys = JSON.parse(asset_keys); // Expecting ["BG", "PLAYER"]
            files.forEach((file, index) => {
                const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
                assetsMap.set(keys[index], fileUrl);
            });
        }

        const wallpaper = await Wallpaper.create({
            title,
            category,
            sub_category,
            logic_script: logic_script ? JSON.parse(logic_script) : undefined,
            assets: assetsMap,
            config: config ? JSON.parse(config) : {}
        });

        res.status(HttpStatusCode.CREATED).json({
            status: 'success',
            message: req.t('wallpaper.created'),
            data: wallpaper
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

        const [wallpapers, total] = await Promise.all([
            Wallpaper.find()
                .populate('sub_category', 'name')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Wallpaper.countDocuments()
        ]);

        res.status(HttpStatusCode.OK).json({
            status: 'success',
            message: req.t('wallpaper.fetched'),
            data: wallpapers,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) }
        });
    } catch (error) { next(error); }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updated = await Wallpaper.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(HttpStatusCode.NOT_FOUND).json({ status: 'error', message: req.t('errors.not_found') });

        res.status(HttpStatusCode.OK).json({
            status: 'success',
            message: req.t('wallpaper.updated'),
            data: updated
        });
    } catch (error) { next(error); }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deleted = await Wallpaper.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(HttpStatusCode.NOT_FOUND).json({ status: 'error', message: req.t('errors.not_found') });
        res.status(HttpStatusCode.OK).json({ status: 'success', message: req.t('wallpaper.deleted') });
    } catch (error) { next(error); }
};

export const sync = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const wallpapers = await Wallpaper.find({ isActive: true })
            .populate('sub_category', 'name slug')
            .sort({ version: -1 });

        res.status(HttpStatusCode.OK).json({
            status: 'success',
            message: req.t('wallpaper.sync_complete'),
            data: wallpapers
        });
    } catch (error) { next(error); }
};