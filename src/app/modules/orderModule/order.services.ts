import Order from './order.model';
import { IOrder } from './order.interface';
import QueryBuilder from '../../builder/builder.query';
import conversationService from '../conversationModule/conversation.service';
import messageServices from '../messageModule/message.services';
import walletServices from '../walletModule/wallet.services';
import CustomError from '../../errors';

class OrderService {
  createOrder = async (data: IOrder) => {
    return await new Order(data).save();
  };

  retrieveAllOrders = async (
    query: Record<string, unknown>,
  ): Promise<{ meta: { page: number; limit: number; total: number; totalPages: number }; data: IOrder[] }> => {
    const filter: Record<string, any> = {};

    if (query?.status || query.status === '') {
      const queryStatus = query.status;
      if (queryStatus === 'rejected' || queryStatus === 'cancelled') {
        filter.status = {
          $in: ['rejected', 'cancelled'],
        };
      } else if (query?.status) {
        filter.status = queryStatus;
      }
      delete query.status;
    }

    if (query?.deliveryOption || query.deliveryOption === '') {
      if (query?.deliveryOption) {
        filter.deliveryOption = query.deliveryOption;
      }

      delete query.deliveryOption;
    }

    // Custom filter for nested field
    if (query.extentionStatus) {
      filter['extentionHistory.status'] = query.extentionStatus;
      delete query.extentionStatus; // remove it from main query
    }

  

    const result = new QueryBuilder(Order.find(filter), query).filter().search(['orderId']).sort().pagination().select();

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

  updateAllPastOrders = async () => {
    const now = new Date();

    const orders = await Order.find({
      status: { $in: ['accepted', 'revision', 'offered'] },
      deliveryDate: { $lt: now },
    });

    for (const order of orders) {
      if (order.status !== 'cancelled') {
        order.status = 'cancelled';
        await order.save();
      }

      // Optional: Send chat notification
      const conversation = await conversationService.retriveConversationByMemberIds([order.client.toString(), order.vendor.toString()]);

      if (conversation) {
        await messageServices.createMessage({
          conversationId: conversation._id,
          senderId: null,
          text: `The order (${order.orderId}) has been automatically cancelled due to overdue delivery date.`,
        });
      }
    }
  };

  autoAcceptDeliveredOrders = async () => {
    const now = new Date();

    // Find orders in delivery-requested status and where deliveryDate was 3+ days ago
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

    const orders = await Order.find({
      status: 'delivery-requested',
      deliveryDate: { $lte: threeDaysAgo },
    });

    for (const order of orders) {
      const vendorWallet = await walletServices.getSpecificWalletByUserId(order.vendor.toString());
      if (!vendorWallet) {
        throw new CustomError.NotFoundError('Vendor wallet not found!');
      }

      // calculate the vendor amount. system fee 20%
      const systemFee = (order.price * 20) / 100;
      const vendorAmount = order.price - systemFee;

      // add vendor amount to vendor wallet
      vendorWallet.balance.amount += vendorAmount;
      vendorWallet.transactionHistory.push({
        amount: vendorAmount,
        type: 'credit',
        transactionAt: new Date(),
      });
      await vendorWallet.save();

      // Optional: notify via message
      const conversation = await conversationService.retriveConversationByMemberIds([order.client.toString(), order.vendor.toString()]);

      if (conversation) {
        await messageServices.createMessage({
          conversationId: conversation._id,
          senderId: null, // system/admin sender
          text: `The delivery request has been automatically confirmed.`,
        });
      }

      order.status = 'delivery-confirmed';
      await order.save();

      // Optional: Email or push notification to vendor and client
    }
  };

  // extendOrderDeadline = async (orderId: string, data: Partial<IOrder>) => {
  //   return await Order.findByIdAndUpdate(orderId, data);
  // };
}

export default new OrderService();
