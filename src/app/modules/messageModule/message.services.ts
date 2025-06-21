import { IMessage } from './message.interface';
import Message from './message.model';

// service for create new message
const createMessage = async (data: Partial<IMessage>) => {
  return await Message.create(data);
};

// service for retrive all message by conversation Id
const retriveMessagesByConversationId = async (id: string) => {
  return await Message.find({ conversationId: id })
    .sort('-createdAt')
    .populate([
      {
        path: 'senderId',
        select: 'profile -_id',
        populate: {
          path: 'profile.id',
          select: 'name image -_id',
        },
      },
      {
        path: 'seenBy.user',
        select: 'profile -_id',
        populate: {
          path: 'profile.id',
          select: 'name image -_id',
        },
      }
    ]);
};

export default {
  createMessage,
  retriveMessagesByConversationId,
};
