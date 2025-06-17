import { Request, Response } from 'express';
import Attachment from './attachment.model';
import sendResponse from '../../../shared/sendResponse';
import { StatusCodes } from 'http-status-codes';
import asyncHandler from '../../../shared/asyncHandler';

// controller for get all attachment of a conversation
const retriveAttachmentByConversation = asyncHandler(async (req: Request, res: Response) => {
    const { conversationId } = req.params;
    const attachments = await Attachment.find({ conversation: conversationId }).sort('-createdAt');

    sendResponse(res, {
        statusCode: StatusCodes.CREATED,
        status: 'success',
        message: `Attachments retrive successfull`,
        data: attachments,
    });
});

export default {
    retriveAttachmentByConversation,
};
