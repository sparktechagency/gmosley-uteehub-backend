// controller for create new messages inside a conversation

import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../../shared/sendResponse';
import CustomError from '../../errors';
import messageServices from './message.services';
import { Request, Response } from 'express';
import fileUploader from '../../../utils/fileUploader';
import { FileArray } from 'express-fileupload';
import conversationService from '../conversationModule/conversation.service';
import asyncHandler from '../../../shared/asyncHandler';

const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  const messageData = req.body;
  const files = req.files;

  const conversation = await conversationService.retriveConversationByConversationId(messageData.conversationId);
  if (!conversation) {
    throw new CustomError.BadRequestError('Conversation not found');
  }

  if (files && files.attachment) {
    const attachmentPath = await fileUploader(files as FileArray, `attachment`, 'attachment');
    messageData.attachment = attachmentPath as string;
  }

  messageData.seenBy = [{ user: messageData.senderId, seenAt: new Date() }];
  const newMessage = await messageServices.createMessage(messageData);

  if (!newMessage) {
    throw new CustomError.BadRequestError('Failed to save message');
  }

  conversation.updatedAt = new Date();
  await conversation.save();

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    status: 'success',
    message: `Message saved successfull`,
    data: newMessage,
  });
});

const retrieveAllMessageByConversationId = asyncHandler(async (req: Request, res: Response) => {
  const { conversationId } = req.params;
  const messages = await messageServices.retriveMessagesByConversationId(conversationId);

  messages.forEach(async (message) => {
    let isUserAddedToSeenBy = false;
    message.seenBy.forEach((seenBy) => {
      if (seenBy.user?.toString() === req.user!.id) {
        isUserAddedToSeenBy = true;
      }
    });

    if (!isUserAddedToSeenBy) {
      message.seenBy.push({ user: req.user!.id, seenAt: new Date() });
    }
    await message.save();
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Messages retrieved successfully',
    data: messages,
  });
});

const sendMessageHandler = async (data: any) => {
  const { text, attachment, senderId, conversationId, receiverId, isReceiverInsideChatRoom } = data;
  const conversation = await conversationService.retriveConversationByConversationId(conversationId);
  if (!conversation) {
    throw new CustomError.BadRequestError('Conversation not found');
  }

  if (!isReceiverInsideChatRoom) {
    const message = await messageServices.createMessage({
      conversationId,
      senderId,
      text,
      attachment,
      seenBy: [],
    });

    conversation.latestmessage = text;
    conversation.unreadCounts.map((unread) => {
      if (unread.userId?.toString() == receiverId.toString()) {
        unread.count++;
      }
    });
    await conversation.save();
    return message;
  } else {
    const message = await messageServices.createMessage({
      conversationId,
      senderId,
      text,
      attachment,
      seenBy: [{ user: receiverId, seenAt: new Date() }],
    });
    conversation.latestmessage = text;
    await conversation.save();
    return message;
  }
};

export default {
  sendMessage,
  retrieveAllMessageByConversationId,
};
