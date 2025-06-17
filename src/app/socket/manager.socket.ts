import { Server as SocketIOServer, Socket } from 'socket.io';
import { ObjectId } from 'mongoose';
import { IConversation } from '../modules/conversationModule/conversation.interface';
import { IMessage } from '../modules/messageModule/message.interface';
import callLogServices from '../modules/callLogModule/callLog.services';
// import { getUserRooms } from '../modules/roomMembershipModule/roomMembership.utils';

interface ConnectedUsers {
    [userId: string]: string; // Maps userId to socketId
}

interface ConnectedAdmins {
    [userId: string]: string; // Maps userId to socketId
}

interface UserRooms {
    [userId: string]: Set<string>; // Maps userId to a set of room IDs
}

class SocketManager {
    private static instance: SocketManager;
    private io!: SocketIOServer;
    private connectedUsers: ConnectedUsers = {};
    private userRooms: UserRooms = {};
    private activeAppUsers: string[] = [];
    //   private connectedAdmins: ConnectedAdmins = {};
    //   private activeAdmins: string[] = [];

    private constructor() {}

    // Singleton instance getter
    static getInstance(): SocketManager {
        if (!SocketManager.instance) {
            SocketManager.instance = new SocketManager();
        }
        return SocketManager.instance;
    }

    // Initialize the Socket.IO server
    init(io: SocketIOServer): void {
        this.io = io;

        io.on('connection', async (socket: Socket) => {
            console.log(`User connected: ${socket.id}`);

            const userId = socket.handshake.query.userId as string | undefined;
            //   const adminId = socket.handshake.query.adminId as string | undefined;

            if (userId) {
                this.connectedUsers[userId] = socket.id;

                if (!this.activeAppUsers.includes(userId)) {
                    this.activeAppUsers.push(userId);
                }

                // Rejoin user to their rooms
                // const rooms = await getUserRooms(userId);
                // for (const roomId of rooms) {
                //   socket.join(roomId);
                //   console.log(`User ${userId} rejoined room ${roomId}`);
                // }
            }
            //   if (adminId) {
            //     this.connectedAdmins[adminId] = socket.id;

            //     if (!this.activeAdmins.includes(adminId)) {
            //       this.activeAdmins.push(adminId);
            //     }
            //   }

            console.log('connected users: ', this.connectedUsers);
            console.log('active users: ', this.activeAppUsers);
            //   console.log("connected Admins: ", this.connectedAdmins);
            //   console.log("active Admins: ", this.activeAdmins);

            socket.on('disconnect', () => {
                console.log(`User disconnected: ${socket.id}`);

                // Remove the user from connectedUsers and activeAppUsers
                for (const id in this.connectedUsers) {
                    if (this.connectedUsers[id] === socket.id) {
                        delete this.connectedUsers[id];
                        const index = this.activeAppUsers.indexOf(id);
                        if (index !== -1) {
                            this.activeAppUsers.splice(index, 1);
                        }
                        break;
                    }
                }
                console.log(this.connectedUsers);
                console.log(this.activeAppUsers);
            });
            // socket.on('startCall', (data) => this.handleStartCall(socket, data));
            socket.on('acceptCall', (data) => this.handleAcceptCall(socket, data));
            socket.on('declineCall', (data) => this.handleDeclineCall(socket, data));
            socket.on('endCall', (data) => this.handleEndCall(socket, data));
        });
    }

    // Join both sender and receiver to a conversation room
    joinUserToRoom(conversation: Partial<IConversation>): void {
        // console.log('conversation...........', conversation);
        if (!conversation._id || !conversation.patient?.patientUserId || !conversation.therapist?.therapistUserId) {
            console.warn('Invalid conversation data provided to joinUser in socket!');
            throw new Error('Invalid conversation data provided to joinUser in socket!');
        }

        const room = conversation._id.toString();

        // Add patient to the room
        const patientId = conversation.patient.patientUserId;
        if (patientId && this.connectedUsers[patientId]) {
            const socketId = this.connectedUsers[patientId];
            const socket = this.io.sockets.sockets.get(socketId);
            if (socket) {
                socket.join(room);
                console.log(`Patient ${conversation.patient.name} joined conversation ${room}`);
            }
        } else {
            console.warn(`Patient ${conversation.patient?.name || ''} is not connected`);
        }

        // Add therapist to the room (if connected)
        const therapistId = conversation.therapist.therapistUserId;
        if (therapistId && this.connectedUsers[therapistId]) {
            const socketId = this.connectedUsers[therapistId];
            const socket = this.io.sockets.sockets.get(socketId);
            if (socket) {
                socket.join(room);
                console.log(`Therapist ${conversation.therapist.name} joined conversation ${room}`);
            }
        } else {
            console.warn(`Therapist ${conversation.therapist?.name || ''} is not connected. They will join the room when they connect.`);
        }

        const existingroom = this.io.sockets.adapter.rooms.get(room);
        console.log('existingRoom...............', existingroom);
    }

    // send and broadcast messages to all users in specific conversation
    sendMessage(conversationId: string | ObjectId, message: Partial<IMessage>): void {
        if (!conversationId || !message) {
            console.warn('Invalid message data provided to sendMessage function!');
            throw new Error('Invalid message data provided to sendMessage function!');
        }

        const roomId = conversationId.toString(); // Ensure roomId is a string
        const room = this.io.sockets.adapter.rooms.get(roomId);
        console.log(roomId, room);
        if (room && room.size > 0) {
            // Check if the room exists and has members
            this.io.to(roomId).emit('newMessage', message);
            console.log(`Message sent in conversation ${roomId}`);
            // Notify all admins globally
            // this.io.emit('newMessageForAdmins', message);
        } else {
            console.warn(`Room ${roomId} does not exist or has no participants`);
        }
    }

    public handleStartCall(data: { conversationId: string; callerId: string; calleeId: string; callLogId: string }): void {
        const { conversationId, callerId, calleeId, callLogId } = data;
        const roomId = conversationId.toString();
        // console.log(calleeId, roomId)
        if (this.connectedUsers[calleeId]) {
            this.io.to(this.connectedUsers[calleeId]).emit('incomingCall', { roomId, callerId, callLogId });
            console.log(`Call started by ${callerId} for ${calleeId}`);
        } else {
            this.io.to(this.connectedUsers[callerId]).emit('userOffline', { calleeId });
            console.log(`Callee ${calleeId} is offline`);
        }
    }

    private handleAcceptCall(socket: Socket, data: { roomId: string; userId: string; callLogId: string }): void {
        const { roomId, userId, callLogId } = data;
        socket.join(roomId);
        this.io.to(roomId).emit('callAccepted', { userId });
        console.log(`Call accepted by user ${userId} in room ${roomId}`);

        // update call log.............
        callLogServices.updateCallLog(callLogId, { status: 'received' });
    }

    private handleDeclineCall(socket: Socket, data: { roomId: string; userId: string; callLogId: string }): void {
        const { roomId, userId, callLogId } = data;
        this.io.to(roomId).emit('callDeclined', { userId });
        console.log(`Call declined by user ${userId} in room ${roomId}`);

        // update call log.............
        callLogServices.updateCallLog(callLogId, { status: 'declined' });
    }

    private handleEndCall(socket: Socket, data: { roomId: string; userId: string; callLogId: string }): void {
        const { roomId, userId, callLogId } = data;
        socket.leave(roomId);
        this.io.to(roomId).emit('callEnded', { userId });
        console.log(`Call ended by user ${userId} in room ${roomId}`);
    }
}

export default SocketManager;
