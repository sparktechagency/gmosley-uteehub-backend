import mongoose, { ClientSession } from 'mongoose';
import { IVendor } from './vendor.interface';
import Vendor from './vendor.model';

// service for create new business
const createVendorProfile = async (data: IVendor, session?: ClientSession) => {
  return await new Vendor(data).save({ session });
};

const retrieveSpecificVendor = async (id: string, session?: ClientSession) => {
  return await Vendor.findById(id, { session });
};

const retrieveAllVendor = async (query: Record<string, unknown>, session?: ClientSession) => {
  return await Vendor.find(query, { session });
};


// service for update specific business
const updateSpecificVendor = async (id: string, data: Partial<IVendor>, session?: ClientSession) => {
  return await Vendor.findByIdAndUpdate(id, data, { session });
};

// service for delete specific business
const deleteSpecificVendor = async (id: string, session?: ClientSession) => {
  return await Vendor.deleteOne({ _id: id }, { session });
};

// service for retrieve nearest vendor
const retrieveNearestVendor = async (clientLocation: string) => {
  const [lat, lon] = clientLocation.split(',').map(Number);
  return await Vendor.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lon, lat], // MongoDB expects [lng, lat]
        },
        $maxDistance: 1000, // in meters
      },
    },
  });
};


export default {
  createVendorProfile,
  updateSpecificVendor,
  deleteSpecificVendor,
  retrieveSpecificVendor,
  retrieveAllVendor,
  retrieveNearestVendor,
};
