import mongoose, { ClientSession, ObjectId, Types } from 'mongoose';
import IUser from './user.interface';
import User from './user.model';
import QueryBuilder from '../../builder/builder.query';
import { IClient } from '../clientModule/client.interface';
import { IVendor } from '../vendorModule/vendor.interface';

// service for create new user
const createUser = async (data: IUser, session?: ClientSession) => {
  const user = new User(data);
  return await user.save({ session });
};

// service for get specific user
const getSpecificUser = async (id: string): Promise<IUser> => {
  console.log(id);
  return await User.findOne({ _id: id })
    .populate({
      path: 'profile.id',
      select: '',
    })
    .select('-password -verification');
};

// service for get specific user with population
const getSpecificUserWithPopulation = async (id: string): Promise<IUser> => {
  return await User.findOne({ _id: id })
    .populate({
      path: 'profile.id',
      select: '',
    })
    .select('-password -verification');
};

// service for get specific user
const getAllUser = async (
  query: Record<string, unknown>,
): Promise<{
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: IUser[];
}> => {
  // let userQuery: any = {};
  // if(query.role){
  //   userQuery['profile.role'] = query.role;
  // }
  // console.log(userQuery)
  const result = new QueryBuilder(User.find({}).populate({ path: 'profile.id', select: '-userId -createdAt -updatedAt -__v' }), query)
    .filter()
    .search(['email', 'phone'])
    .sort()
    .pagination()
    .select();

  const totalCount = await result.countTotal();
  const users = await result.modelQuery;

  return {
    meta: totalCount,
    data: users,
  };
};

// service for get specific user
const getSpecificUserByEmail = async (email: string): Promise<IUser> => {
  return await User.findOne({ email })
    .populate({
      path: 'profile.id',
      select: '',
    })
    .select('-password -verification');
};

// service for update specific user
const updateSpecificUser = async (id: string, data: Partial<IUser>, session?: ClientSession) => {
  // console.log(data);
  return await User.findOneAndUpdate({ _id: id }, data, { session });
};

// service for delete specific user
// const deleteSpecificUser = async (id: string, role: string) => {
//   await User.deleteOne({ _id: id });
//   if (role === 'patient') {
//     await PatientProfile.deleteOne({ user: id });
//   } else if (role === 'therapist') {
//     await TherapistProfile.deleteOne({ user: id });
//   } else {
//     return false;
//   }
//   return true;
// };

const updateUserStatus = async (id: string, status: 'active' | 'blocked' | 'pending') => {
  const user = await User.findById(id).populate<{
    profile: {
      role: 'client' | 'vendor';
      id: IClient | IVendor;
    };
  }>({
    path: 'profile.id',
    select: '',
  });

  if (!user) {
    throw new Error(`User doesn't exists!`);
  }

  const isHasDocuments = user.profile?.role === 'vendor' ? Boolean((user?.profile?.id as IVendor)?.documents?.length) : false;

  console.log({ isHasDocuments });

  // is current status matched:

  if (user.status === status) {
    throw new Error(`This account is already ${status}. You cannot apply the same status again.`);
  }

  if (user?.status !== 'active' && status === 'active' && user.profile.role === 'vendor' && !isHasDocuments) {
    throw new Error('Required documents are missing. Please upload all necessary documents to activate your vendor account.');
  }

  return await User.findOneAndUpdate(
    {
      _id: id,
    },
    {
      status,
    },
    {
      new: true,
    },
  ).select('status profile');
};

export default {
  createUser,
  getSpecificUser,
  getSpecificUserByEmail,
  updateSpecificUser,
  // deleteSpecificUser,
  getAllUser,
  getSpecificUserWithPopulation,
  updateUserStatus,
};
