import { Request, Response } from 'express';
import asyncHandler from '../../../shared/asyncHandler';
import conversationService from './conversation.service';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';

const createConversation = asyncHandler(async (req: Request, res: Response) => {
  const { members: memberIds } = req.body;

  if (!memberIds || !memberIds.length) {
    throw new Error('Member ids are required');
  }

  const conv = await conversationService.retriveConversationByMemberIds(memberIds);

  if (conv) {
    conv.members = conv.members.filter((memberId) => memberId._id.toString() !== req.user!.id);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      status: 'success',
      message: 'Conversation already exists',
      data: conv,
    });
    return;
  }

  const convPayload = {
    members: memberIds,
    unreadCounts: memberIds.map((memberId: string) => {
      return {
        userId: memberId,
        count: 0,
      };
    }),
  };

  const newConversation = await conversationService.createConversation(convPayload);

  newConversation.members = newConversation.members.filter((memberId) => memberId._id.toString() !== req.user!.id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Conversation created successfully',
    data: newConversation,
  });
});

const getConversationListByUserId = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const conversationList = await conversationService.retriveConversationListByUserId(userId);
  if (!conversationList) {
    throw new Error('Conversation not found');
  }

  // remove user from members and also other chatbots
  for (let i = 0; i < conversationList.length; i++) {
    conversationList[i].members = conversationList[i].members.filter((memberId) => memberId._id.toString() !== userId);
  }

  conversationList.sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Conversation fetched successfully',
    data: conversationList,
  });
});

const getConversationById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const conv = await conversationService.retriveConversationByConversationId(id);
  if (!conv) {
    throw new Error('Conversation not found');
  }
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Conversation fetched successfully',
    data: conv,
  });
});

export default {
  createConversation,
  getConversationById,
  getConversationListByUserId,
};
