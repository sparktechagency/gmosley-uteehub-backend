import sendMail from '../../src/utils/sendEMail';
import nodemailer from 'nodemailer';

// Mock transporter object with sendMail function
const sendMailMock = jest.fn().mockResolvedValue({ messageId: 'mock-message-id' });

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: sendMailMock,
  })),
}));

describe('sendMail utility', () => {
  it('should send an email with correct options', async () => {
    const result = await sendMail({
      from: 'test@example.com',
      to: 'recipient@example.com',
      subject: 'Test Subject',
      text: 'Hello world',
    });

    expect(result).toBe(true);
    expect(nodemailer.createTransport).toHaveBeenCalled();
    expect(sendMailMock).toHaveBeenCalledWith({
      from: 'test@example.com',
      to: 'recipient@example.com',
      subject: 'Test Subject',
      text: 'Hello world',
    });
  });

  it('should throw an error if sending fails', async () => {
    sendMailMock.mockRejectedValueOnce(new Error('SMTP failed'));

    await expect(
      sendMail({
        from: 'fail@example.com',
        to: 'someone@example.com',
        subject: 'Fail Test',
        text: 'This should fail',
      }),
    ).rejects.toThrow('Failed to send mail!');
  });
});
