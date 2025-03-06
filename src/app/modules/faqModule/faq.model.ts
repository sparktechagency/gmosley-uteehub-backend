import mongoose from 'mongoose';
import { IFaq } from './faq.interface';

const faqSchema = new mongoose.Schema<IFaq>(
  {
    question: String,
    answer: String,
  },
  {
    timestamps: true,
  },
);

const Faq = mongoose.model<IFaq>('faq', faqSchema);
export default Faq;
