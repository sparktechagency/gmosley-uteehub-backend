import { Types } from 'mongoose';
import User from '../userModule/user.model';
import IAdmin from './admin.interface';
import Admin from './admin.model';
import Client from '../clientModule/client.model';
import Vendor from '../vendorModule/vendor.model';
import Order from '../orderModule/order.model';
import GeneralOrder from '../generalOrderModule/generalOrder.model';

// service for create new admin
const createAdmin = async (data: Partial<IAdmin>) => {
  return await Admin.create(data);
};

// service for get all admin
const getAllAdmin = async () => {
  return await Admin.find().select('-password');
};

// service for get specific admin
const getSpecificAdmin = async (id: string) => {
  return await Admin.findOne({ _id: id }).select('-password');
};

// service for get specific admin by email
const getAdminByEmail = async (email: string) => {
  return await Admin.findOne({ email });
};

// service for update specific admin
const updateSpecificAdmin = async (id: string, data: Partial<IAdmin>) => {
  console.log(data);
  return await Admin.updateOne({ _id: id }, data, {
    runValidators: true,
  });
};

// service for delete specific admin
const deleteSpecificAdmin = async (id: string) => {
  return await Admin.deleteOne({ _id: id });
};

// Block specific Admin
const blockSpecificAdmin = async (id: string) => {
  const admin = await Admin.findById(id);

  if (!admin) {
    throw new Error(`User doesn't exists!`);
  }

  if (admin?.status === 'blocked') {
    const res = await Admin.findOneAndUpdate(
      {
        _id: id,
      },
      {
        status: 'active',
      },
      {
        new: true,
      },
    ).select('status profile');
    return {
      message: `Activate admin successfully!`,
      data: res,
    };
  } else {
    const res = await Admin.findOneAndUpdate(
      {
        _id: id,
      },
      {
        status: 'blocked',
      },
      {
        new: true,
      },
    ).select('status profile');
    return {
      message: `Admin blocked successfully!!`,
      data: res,
    };
  }
};

// Get admin dashboard stats:

const getDashboardStats = async (clientYear: string = '2025') => {
  const [clients, vendors, customOrdersCount, productOrdersCount, customEarnings, generalEarnings, customFeeStats] = await Promise.all([
    await Client.aggregate([
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]),
    await Vendor.aggregate([
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]),
    await Order.countDocuments(),
    await GeneralOrder.countDocuments(),
    await Order.aggregate([{ $match: { status: 'delivery-confirmed' } }, { $group: { _id: null, total: { $sum: '$price' } } }]),
    await GeneralOrder.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$price' } } }]),
    await Order.aggregate([
      { $match: { status: 'delivery-confirmed' } },
      { $group: { _id: null, totalFees: { $sum: { $multiply: ['$price', 0.2] } } } },
    ]),
  ]);

  const newClientYear = clientYear || new Date().getFullYear();

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Get client growth based on year:
  const clientGrowth = await Client.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${newClientYear}-01-01`),
          $lte: new Date(`${newClientYear}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  // Get vendor growth based on year:
  const vendorGrowth = await Vendor.aggregate([
    {
      $group: {
        _id: { $year: '$createdAt' },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
    {
      $project: {
        year: '$_id',
        count: 1,
      },
    },
  ]);

  const stats = await Order.aggregate([
    // 1. Filter successful Custom Orders
    { $match: { status: 'delivery-confirmed' } },
    { $project: { price: 1, createdAt: 1 } },

    // 2. Combine with General Orders (Product Sales)
    {
      $unionWith: {
        coll: 'generalorders', // The actual name of the collection in MongoDB
        pipeline: [{ $match: { paymentStatus: 'paid' } }, { $project: { price: 1, createdAt: 1 } }],
      },
    },

    // 3. Sort everything chronologically
    { $sort: { createdAt: 1 } },

    // 4. Calculate Running Totals (Sales Count and Earnings)
    {
      $setWindowFields: {
        sortBy: { createdAt: 1 },
        output: {
          cumulativeEarnings: {
            $sum: '$price',
            window: { documents: ['unbounded', 'current'] },
          },
          salesCount: {
            $sum: 1,
            window: { documents: ['unbounded', 'current'] },
          },
        },
      },
    },

    // 5. Downsample the data (Milestones)
    // To match your chart (5k, 10k), we pick every 500th sale to keep the chart smooth but light
    {
      $match: {
        $or: [
          { $expr: { $eq: [{ $mod: ['$salesCount', 500] }, 0] } },
          { salesCount: 1 }, // Include the very first sale
        ],
      },
    },

    // 6. Format the final output
    {
      $project: {
        _id: 0,
        earning: '$cumulativeEarnings',
        sales: {
          $cond: {
            if: { $gte: ['$salesCount', 1000] },
            then: { $concat: [{ $toString: { $divide: ['$salesCount', 1000] } }, 'k'] },
            else: { $toString: '$salesCount' },
          },
        },
      },
    },
  ]);

  const totalCustomEarnings = customEarnings?.[0]?.total || 0;
  const totalGeneralEarnings = generalEarnings?.[0]?.total || 0;
  const totalEarnings = Number((totalCustomEarnings + totalGeneralEarnings).toFixed(2));
  const totalPlatformEarning = Number(customFeeStats?.[0]?.totalFees.toFixed(2));

  const clientYearlyGrowth = monthNames.map((month, index) => {
    const found = clientGrowth.find((s) => s._id === index + 1);
    return {
      name: month,
      count: found ? found.count : 0,
    };
  });

  return {
    totalClients: clients?.[0]?.count,
    totalVendors: vendors?.[0]?.count,
    customOrdersCount,
    productOrdersCount,
    totalOrders: customOrdersCount + productOrdersCount,
    totalEarnings,
    totalPlatformEarning,
    totalCustomEarnings,
    totalGeneralEarnings,
    clientYearlyGrowth,
    vendorGrowth,
    stats,
  };
};

export default {
  createAdmin,
  getAllAdmin,
  getSpecificAdmin,
  getAdminByEmail,
  updateSpecificAdmin,
  deleteSpecificAdmin,
  blockSpecificAdmin,
  getDashboardStats,
};
