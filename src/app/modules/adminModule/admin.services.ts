import IAdmin from './admin.interface';
import Admin from './admin.model';

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
    console.log(data)
  return await Admin.updateOne({ _id: id }, data, {
    runValidators: true,
  });
};

// service for delete specific admin
const deleteSpecificAdmin = async (id: string) => {
  return await Admin.deleteOne({ _id: id });
};


export default {
    createAdmin,
    getAllAdmin,
    getSpecificAdmin,
    getAdminByEmail,
    updateSpecificAdmin,
    deleteSpecificAdmin
}