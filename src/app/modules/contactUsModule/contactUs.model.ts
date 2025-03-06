import mongoose from "mongoose";
import { IContactUs } from "./contactUs.interface";

const contactUsSchema = new mongoose.Schema<IContactUs>({
    email: { type: String, required: true },
}, {
    timestamps: true,
})

const ContactUs = mongoose.model<IContactUs>('contactUs', contactUsSchema);
export default ContactUs;