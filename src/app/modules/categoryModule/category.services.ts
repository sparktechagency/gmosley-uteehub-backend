import { query } from 'express';
import QueryBuilder from '../../builder/builder.query';
import { ICategory } from './category.interface';
import Category from './category.model';

class CategoryService {
  async createCategory(categoryData: Partial<ICategory>) {
    return await Category.create(categoryData);
  }

  async getAllCategories() {
    return await Category.find();
  }

  async getCategoryById(id: string) {
    return await Category.findById(id);
  }

  async updateCategory(id: string, categoryData: Partial<ICategory>) {
    return await Category.findByIdAndUpdate(id, categoryData);
  }

  async deleteCategory(id: string) {
    return await Category.findByIdAndDelete(id);
  }

  async retrieveCategoriesByCreatorId(creatorId: string, query: Record<string, unknown>) {
    // use querybuilder
    const result = new QueryBuilder(Category.find({ creator: creatorId }), query).filter().search(['name']).sort().pagination().select();
    const totalCount = await result.countTotal();
    const categories = await result.modelQuery;
    return { meta: totalCount, data: categories };
  }
}

export default new CategoryService();
