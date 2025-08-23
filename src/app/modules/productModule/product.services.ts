import Product from './product.model';
import { IProduct } from './product.interface';
import QueryBuilder from '../../builder/builder.query';

class ProductServices {
  async createProduct(productData: Partial<IProduct>) {
    return await Product.create(productData);
  }

  async getAllProducts(query: Record<string, unknown>): Promise<{
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    data: IProduct[];
  }> {
    if (query['isFeatured']) {
      query['isFeatured'] = query['isFeatured'] === 'true';
    }
    const result = new QueryBuilder(Product.find({}), query).filter().search(['name']).sort().pagination().select();

    const totalCount = await result.countTotal();
    const products = await result.modelQuery;

    return {
      meta: totalCount,
      data: products,
    };
  }

  async getProductById(id: string) {
    return await Product.findById(id);
  }

  async updateProduct(id: string, productData: Partial<IProduct>) {
    return await Product.findByIdAndUpdate(id, productData);
  }

  async deleteProduct(id: string) {
    return await Product.findByIdAndDelete(id);
  }

  async retrieveProductsByCreatorId(creatorId: string, query: Record<string, unknown>): Promise<{
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    data: IProduct[];
  }> {
    const result = new QueryBuilder(Product.find({ creator: creatorId }), query).filter().search(['name']).sort().pagination().select();

    const totalCount = await result.countTotal();
    const products = await result.modelQuery;

    return {
      meta: totalCount,
      data: products,
    };
  }
}

export default new ProductServices();
