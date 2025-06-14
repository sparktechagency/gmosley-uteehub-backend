import Order from './order.model';
import { IOrder } from './order.interface';
import QueryBuilder from '../../builder/builder.query';

class OrderService {
  createOrder = async (data: IOrder) => {
    return await new Order(data).save();
  };

  retrieveAllOrders = async (
    query: Record<string, unknown>,
  ): Promise<{ meta: { page: number; limit: number; total: number; totalPages: number }; data: IOrder[] }> => {
    const result = new QueryBuilder(Order.find({}), query).filter().search(['orderId']).sort().pagination().select();

    const totalCount = await result.countTotal();
    const orders = await result.modelQuery;

    return {
      meta: totalCount,
      data: orders,
    };
  };

  retrieveSpecificOrder = async (id: string) => {
    return await Order.findById(id);
  };

  updateSpecificOrder = async (id: string, data: Partial<IOrder>) => {
    return await Order.findByIdAndUpdate(id, data);
  };

  getLastOrder = async () => {
    return await Order.findOne().sort({ createdAt: -1 });
  };
}

export default new OrderService();
