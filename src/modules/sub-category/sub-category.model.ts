import mongoose, { Schema, Document } from 'mongoose';

export interface ISubCategory extends Document {
    name: string;
    slug: string;
    description?: string;
    isActive: boolean;
}

const SubCategorySchema: Schema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true },
        description: { type: String },
        isActive: { type: Boolean, default: true }
    },
    { timestamps: true, versionKey: false }
);

export const SubCategory = mongoose.model<ISubCategory>('SubCategory', SubCategorySchema);