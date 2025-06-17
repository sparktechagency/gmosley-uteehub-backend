import { Server as SocketIOServer, Socket } from 'socket.io';

import SocketManager from './manager.socket';
import { IConversation } from '../modules/conversationModule/conversation.interface';

interface ConnectedUsers {
    [userId: string]: string; // Maps userId to socketId
}

const connectedUsers: ConnectedUsers = {};
const activeAppUsers: string[] = [];
let joinUser: (conversation: Partial<IConversation>) => void;

const configSocket = (io: SocketIOServer): void => {
    const socketManager = SocketManager.getInstance();
    socketManager.init(io);
};

export default configSocket;
