import mongoose from "mongoose";
import { ICategory } from "./category.interface";

const categorySchema = new mongoose.Schema<ICategory>(
    {
        name: { type: String, required: true },
        image: { type: String, required: true },
    },
    {
        timestamps: true,
    },
);

const Category = mongoose.model<ICategory>('category', categorySchema);
export default Category;
