import mongoose, { ClientSession } from 'mongoose';
import { IClient } from './client.interface';
import Client from './client.model';

// service for create new client profile
const createClientProfile = async (data: IClient, session?: ClientSession) => {
  return await new Client(data).save({ session });
};

// retrieve all client
const retrieveAllClientProfile = async (
  query: Record<string, any>,
): Promise<{
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: any[];
}> => {
  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 10;
  const skip = (page - 1) * limit;
  const searchTerm = (query.searchTerm as string)?.trim() || '';

  const matchStage: any = {};

  if (searchTerm) {
    matchStage.$or = [
      { firstName: { $regex: searchTerm, $options: 'i' } },
      { lastName: { $regex: searchTerm, $options: 'i' } },
      { 'user.email': { $regex: searchTerm, $options: 'i' } },
      { 'user.phone': { $regex: searchTerm, $options: 'i' } },
    ];
  }

  const aggregatePipeline = [
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },

    {
      $lookup: {
        from: 'vehicles',
        localField: '_id',
        foreignField: 'creator.id',
        as: 'vehicles',
      },
    },

    {
      $addFields: {
        totalCars: { $size: '$vehicles' },
      },
    },
    { $match: matchStage },
    {
      $project: {
        _id: 1,
        name: { $concat: ['$firstName', ' ', '$lastName'] },
        email: '$user.email',
        phone: '$user.phone',
        subscription: '$user.activeSubscription.title',
        image: 1,
        totalCars: 1,
      },
    },

    {
      $facet: {
        data: [{ $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: 'count' }],
      },
    },
  ];

  const result = await Client.aggregate(aggregatePipeline);

  const data = result[0]?.data || [];
  const total = result[0]?.totalCount[0]?.count || 0;

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data,
  };
};

const getSpecificClientProfile = async (id: string) => {
 
  const result = await Client.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(id) }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'user'
      }
    },
    { $unwind: '$user' },

    {
      $lookup: {
        from: 'vehicles',
        localField: '_id',
        foreignField: 'creator.id', // adjust if needed
        as: 'vehicles'
      }
    },
    {
      $addFields: {
        totalVehicles: { $size: '$vehicles' }
      }
    },
    {
      $project: {
        _id: 1,
        name: { $concat: ['$firstName', ' ', '$lastName'] },
        email: '$user.email',
        phone: '$user.phone',
        role: '$user.profile.role',
        dateOfBirth: 1,
        image: 1,
        subscription: '$user.activeSubscription.title',
        totalVehicles: 1
      }
    }
  ]);

  return result[0]; 
};



const updateSpecificClientProfile = async (id: string, data: Partial<IClient>, session?: ClientSession) => {
  return await Client.findOneAndUpdate({ _id: id }, data, { session });
};

// service for delete specific car owner profile
const deleteSpecificClientProfile = async (id: string, session?: ClientSession) => {
  return await Client.deleteOne({ _id: id }, { session });
};

export default {
  createClientProfile,
  getSpecificClientProfile,
  updateSpecificClientProfile,
  deleteSpecificClientProfile,
  retrieveAllClientProfile,
};
