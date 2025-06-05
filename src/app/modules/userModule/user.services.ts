import mongoose, { ClientSession, ObjectId, Types } from 'mongoose';
import IUser from './user.interface';
import User from './user.model';
import QueryBuilder from '../../builder/builder.query';

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
      path: 'survey',
      select: '',
    })
    .select('-password');
};

// service for update specific user
const updateSpecificUser = async (id: string, data: Partial<IUser>, session?: ClientSession) => {
  console.log(data);
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

export default {
  createUser,
  getSpecificUser,
  getSpecificUserByEmail,
  updateSpecificUser,
  // deleteSpecificUser,
  getAllUser,
};
