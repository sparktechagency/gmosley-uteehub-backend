import QueryBuilder from '../../builder/builder.query';
import { IGeneralOrder } from './generalOrder.interface';
import GeneralOrder from './generalOrder.model';

class GeneralOrderService {
  async createGeneralOrder(orderData: IGeneralOrder) {
    const generalOrder = await GeneralOrder.create(orderData);
    return generalOrder;
  }

  async retrieveAllGeneralOrders(query: Record<string, any>): Promise<{
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    data: IGeneralOrder[];
  }> {
    const result = new QueryBuilder(
      GeneralOrder.find({})
        .populate({ path: 'client', select: '-userId -createdAt -updatedAt -__v' })
        .populate({ path: 'products.productId', select: '-category -createdAt -updatedAt -__v' }),
      query,
    )
      .filter()
      .search(['name'])
      .sort()
      .pagination()
      .select();

    const totalCount = await result.countTotal();
    const generalOrders = await result.modelQuery;

    return {
      meta: totalCount,
      data: generalOrders,
    };
  }

  async retrieveSpecificGeneralOrder(orderId: string) {
    const generalOrder = await GeneralOrder.findById(orderId);
    return generalOrder;
  }

  async deleteGeneralOrder(orderId: string) {
    const generalOrder = await GeneralOrder.findByIdAndDelete(orderId);
    return generalOrder;
  }
}

export default new GeneralOrderService();
