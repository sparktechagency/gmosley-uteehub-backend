import { IContactUs } from "./contactUs.interface";
import ContactUs from "./contactUs.model";

// service for create new contactUs
const createContactUs = async (data: Partial<IContactUs>) => {
  return await ContactUs.create(data);
}

// service for get contactUs
const getContactUs = async () => {
  return await ContactUs.findOne({});
}

// service for update specific contactus
const updateSpecificContactUs = async (id: string, data: Partial<IContactUs>) => {
  return await ContactUs.findOneAndUpdate({ _id: id }, data, { runValidators: true });
}

export default {
  createContactUs,
  getContactUs,
  updateSpecificContactUs
}