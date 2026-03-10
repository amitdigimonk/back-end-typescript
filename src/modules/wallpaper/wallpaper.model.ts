
import mongoose, { Schema, Document } from 'mongoose';

export interface IWallpaper extends Document {
    title: string;
    version: number;
    category: 'static' | 'interactive' | 'game';
    sub_category: mongoose.Types.ObjectId;
    thumbnail_url?: string;
    logic_script?: {
        code: string;
        entry_point: string;
    };
    assets: Map<string, string>;
    config: any;
    isActive: boolean;
}

const WallpaperSchema: Schema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        version: { type: Number, default: 1 },
        category: {
            type: String,
            enum: ['static', 'interactive', 'game'],
            required: true
        },
        sub_category: {
            type: Schema.Types.ObjectId,
            ref: 'SubCategory',
            required: true
        },
        thumbnail_url: { type: String },
        logic_script: {
            code: { type: String },
            entry_point: { type: String, default: 'update' }
        },
        assets: {
            type: Map,
            of: String,
            default: {}
        },
        config: { type: Schema.Types.Mixed, default: {} },
        isActive: { type: Boolean, default: true }
    },
    { timestamps: true, versionKey: false }
);

WallpaperSchema.pre('findOneAndUpdate', async function (this: mongoose.Query<any, IWallpaper>) {
    const update = this.getUpdate() as any;

    if (update.logic_script || update.assets) {
        this.setUpdate({
            ...update,
            $inc: { version: 1 }
        });
    }
});

export const Wallpaper = mongoose.model<IWallpaper>('Wallpaper', WallpaperSchema);