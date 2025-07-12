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
}

export default new CategoryService();
