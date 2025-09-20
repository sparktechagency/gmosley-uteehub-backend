import nodemailer, { SendMailOptions, SentMessageInfo } from 'nodemailer';
import config from '../config';
import CustomError from '../app/errors';

// Define a type for the mail options
interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
}

// Define the sendMail function
const sendMail = async ({ from, to, subject, text }: MailOptions): Promise<boolean> => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.gmail_app_user,
        pass: config.gmail_app_password,
      },
    });

    const mailOptions: SendMailOptions = {
      from,
      to,
      subject,
      text,
    };

    // Wait for the sendMail operation to complete
    const info: SentMessageInfo = await transporter.sendMail(mailOptions);
    // console.log('Message sent: %s', info.messageId);
    return true;
  } catch (error) {
    // throw new CustomError.BadRequestError('Failed to send mail!');
    // console.error('Error sending mail: ', error);
    return false;
  }
};

export default sendMail;
