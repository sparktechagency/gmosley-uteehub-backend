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
        .populate({ path: 'client', select: 'profile email phone', populate: { path: 'profile.id', select: 'name gender image -_id' } })
        .populate({ path: 'products.productId', select: '-category -createdAt -updatedAt -__v' })
        .populate({ path: 'vendor', select: 'profile email phone', populate: { path: 'profile.id', select: 'name gender image -_id' } }),
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
    const generalOrder = await GeneralOrder.findById(orderId)
      .populate({ path: 'client', select: 'profile email phone', populate: { path: 'profile.id', select: 'name gender image -_id' } })
      .populate({ path: 'products.productId', select: '-category -createdAt -updatedAt -__v' })
      .populate({ path: 'vendor', select: 'profile email phone', populate: { path: 'profile.id', select: 'name gender image -_id' } });
    return generalOrder;
  }

  async deleteGeneralOrder(orderId: string) {
    const generalOrder = await GeneralOrder.findByIdAndDelete(orderId);
    return generalOrder;
  }

  async updateGeneralOrder(orderId: string, updateData: IGeneralOrder) {
    const generalOrder = await GeneralOrder.findByIdAndUpdate(orderId, updateData, { new: true });
    return generalOrder;
  }
}

export default new GeneralOrderService();
