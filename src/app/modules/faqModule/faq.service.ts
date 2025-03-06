import { IFaq } from './faq.interface';
import Faq from './faq.model';

// service for create new faq
const createFaq = async (data: Partial<IFaq>) => {
  return await Faq.create(data);
};

// service for get all faq
const getAllFaq = async () => {
  return await Faq.find();
};

// service for delete specific faq
const deleteSpecificFaq = async (id: string) => {
  return await Faq.deleteOne({ _id: id });
};

// service for update specific faq
const updateSpecificFaq = async (id: string, data: Partial<IFaq>) => {
  return await Faq.findOneAndUpdate({ _id: id }, data, { runValidators: true });
};

export default {
  createFaq,
  getAllFaq,
  deleteSpecificFaq,
  updateSpecificFaq,
};
