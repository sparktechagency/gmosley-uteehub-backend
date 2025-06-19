import { Server, Socket } from 'socket.io';
import User from '../modules/userModule/user.model';
import Conversation from '../modules/conversationModule/conversation.model';
import messageControllers from '../modules/messageModule/message.controllers';

interface SendMessageData {
  conversationId: string;
  senderId: string;
  text?: string;
  attachment?: string;
}

// setup	Immediately after login
// join-chat	When entering a conversation
// leave-chat	when closing a conversation
// typing	On keypress (with debounce)
// stop-typing	On stop (with delay)
// Request upload URL	(REST call /presigned-url)	On file selection
// Upload file to S3	(via PUT)	After getting URL
// Send message	send-message	After file upload (if any) and typing message
// receive-message	Real-time from server
// message-seen (not implemented)	When user views the message

const chatHandler = (io: Server, socket: Socket) => {
  let currentUserId: string | null = null;

  socket.on('setup', async (id: string) => {
    currentUserId = id;
    socket.join(id);
    console.log('user joined personal room', id);
    socket.emit('user setup', id);

    await User.findByIdAndUpdate(id, { isOnline: true });

    const conversations = await Conversation.find({
      members: { $in: [id] },
    });

    conversations.forEach(async (conversation) => {
      const sock = io.sockets.adapter.rooms.get(conversation._id.toString());
      if (sock) {
        console.log('Other user is online is sent to: ', id);
        io.to(conversation._id.toString()).emit('receiver-online', {});
      }
    });
  });

  socket.on('join-chat', async (data: { roomId: string; userId: string }) => {
    const { roomId, userId } = data;

    console.log('User joined chat room ', roomId);
    const conv = await Conversation.findById(roomId);
    socket.join(roomId);

    if (conv) {
      conv.unreadCounts.forEach((unread) => {
        if (unread.userId?.toString() === userId) {
          unread.count = 0;
        }
      });
      await conv.save({ timestamps: false });
    }

    io.to(roomId).emit('user-joined-room', userId);
  });

  socket.on('leave-chat', (room: string) => {
    socket.leave(room);
  });

  const handleSendMessage = async (data: SendMessageData) => {
    console.log('Received message');
    const { conversationId, senderId, text, attachment } = data;

    const conversation = await Conversation.findById(conversationId).populate('members');
    if (!conversation) return;

    const receiver = conversation.members.find((member: any) => member._id.toString() !== senderId);
    if (!receiver) return;

    const receiverId = receiver._id.toString();
    const receiverPersonalRoom = io.sockets.adapter.rooms.get(receiverId);
    let isReceiverInPersonalRoom = false;

    if (receiverPersonalRoom) {
      const receiverSId = Array.from(receiverPersonalRoom)[0];
      const room = io.sockets.adapter.rooms.get(conversationId);
      if (room && room?.has(receiverSId)) {
        isReceiverInPersonalRoom = true;
      }
    }

    const messagePayload = {
      conversationId,
      senderId,
      text,
      attachment,
      receiverId,
      isReceiverInPersonalRoom,
    };
    const message = await messageControllers.sendMessageHandler(messagePayload);

    io.to(conversationId).emit('receive-message', message);

    if (!isReceiverInPersonalRoom) {
      console.log('Emitting new message to: ', receiverId);
      io.to(receiverId).emit('new-message-notification', message);
    }
  };

  socket.on('send-message', handleSendMessage);

  socket.on('typing', (data: { conversationId: string; senderId: string }) => {
    io.to(data.conversationId).emit('typing', data.senderId);
  });

  socket.on('stop-typing', (data: { conversationId: string; senderId: string }) => {
    io.to(data.conversationId).emit('stop-typing', data.senderId);
  });

  socket.on('disconnect', async () => {
    console.log('A user disconnected', currentUserId, socket.id);

    try {
      if (currentUserId) {
        await User.findByIdAndUpdate(currentUserId, { isOnline: false, lastSeen: new Date() });
      }

      const conversation = await Conversation.find({ members: { $in: [currentUserId] } });

      conversation.forEach((conversation) => {
        const sock = io.sockets.adapter.rooms.get(conversation._id.toString());
        if (sock) {
          console.log('Other user is offline is sent to: ', currentUserId);
          io.to(conversation._id.toString()).emit('receiver-offline', {});
        }
      });
    } catch (error) {
      console.log('Error updating user status on disconnect:', error);
    }
  });
};

export default chatHandler;
