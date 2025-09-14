import mongoose, { ObjectId } from 'mongoose';
import { IConversation } from './conversation.interface';
import Conversation from './conversation.model';

// service for create new conversation
const createConversation = async (data: Partial<IConversation>) => {
  const conv = await Conversation.create(data);
  return conv.populate({
    path: 'members',
    select: 'profile',
    populate: {
      path: 'profile.id',
      select: 'name image',
    },
  });
};

// service for retrive specific conversation by memberIds
const retriveConversationByMemberIds = async (memberIds: string[]) => {
  return await Conversation.findOne({ members: { $all: memberIds } }).populate({
    path: 'members',
    select: 'profile',
    populate: {
      path: 'profile.id',
      select: 'name image',
    },
  });
};

// service for retrive specific conversation by conversationId
const retriveConversationByConversationId = async (conversationId: string) => {
  return await Conversation.findOne({ _id: conversationId }).populate({
    path: 'members',
    select: 'profile',
    populate: {
      path: 'profile.id',
      select: 'name image',
    },
  });
};

// retrieve conversation list for a user
const retriveConversationListByUserId = async (userId: string) => {
  return await Conversation.find({ members: { $in: userId } }).populate({
    path: 'members',
    select: 'profile',
    populate: {
      path: 'profile.id',
      select: 'name image',
    },
  });
};

export default {
  createConversation,
  retriveConversationByMemberIds,
  retriveConversationByConversationId,
  retriveConversationListByUserId,
};
