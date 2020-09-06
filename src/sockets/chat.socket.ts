import { ESocketEvents, ISocketInitializer } from "../types";
import { Types } from "mongoose";
import { chatService } from "../services";
import { logger } from "../config";

const { ObjectId } = Types;

const initializeChatSocket: ISocketInitializer = (socket, { io, user }) => {
    socket.on(ESocketEvents.CHAT_USER_STARTED_TYPING, function (data) {
        try {
            const { chatId } = data;
            io.sockets.to(chatId).emit(ESocketEvents.CHAT_USER_STARTED_TYPING, {
                chatId,
                user,
            });
        } catch (e) {
            logger.error(e);
        }
    });
    socket.on(ESocketEvents.CHAT_USER_STOPPED_TYPING, function (data) {
        try {
            const { chatId } = data;
            io.sockets.to(chatId).emit(ESocketEvents.CHAT_USER_STOPPED_TYPING, {
                chatId,
                user,
            });
        } catch (e) {
            logger.error(e);
        }
    });

    socket.on(ESocketEvents.CHAT_MESSAGE_CREATED, async function (data: {
        chatId: string;
        text: string;
    }) {
        try {
            if (!user.meta.chats.find((chatId) => chatId.equals(chatId)))
                throw new Error("chatId not found in user metadata");
            const chat = await chatService.createMessage({
                chatId: ObjectId(data.chatId),
                requestUserId: user._id,
                text: data.text,
            });

            let messageEmitter = io.sockets.to(data.chatId);

            chat.meta.users.forEach(function (userId: Types.ObjectId) {
                if (user._id.toString() === userId.toString()) return;
                messageEmitter = messageEmitter.to(userId.toString());
            });

            messageEmitter.emit(ESocketEvents.CHAT_MESSAGE_CREATED, {
                chatId: data.chatId,
                message: chat.messages[0],
                user,
            });
        } catch (e) {
            logger.error(e);
        }
    });

    socket.on(ESocketEvents.CHAT_MESSAGE_UPDATED, async function (data: {
        chatId: string;
        messageId: string;
        text: string;
    }) {
        try {
            if (!user.meta.chats.find((chatId) => chatId.equals(chatId)))
                throw new Error("chatId not found in user metadata");
            const chat = await chatService.updateMessage({
                chatId: ObjectId(data.chatId),
                messageId: ObjectId(data.messageId),
                text: data.text,
            });

            let messageEmitter = io.sockets.to(data.chatId);

            chat.meta.users.forEach(function (userId: Types.ObjectId) {
                if (user._id.toString() === userId.toString()) return;
                messageEmitter = messageEmitter.to(userId.toString());
            });

            const message = chat.messages.find(
                (message) => message._id.toString() === data.messageId
            );

            console.log(message);

            messageEmitter.emit(ESocketEvents.CHAT_MESSAGE_UPDATED, {
                chatId: data.chatId,
                message,
            });
        } catch (e) {
            logger.error(e);
        }
    });

    socket.on(ESocketEvents.CHAT_MESSAGE_DELETED, async function (data: {
        chatId: string;
        messageId: string;
    }) {
        try {
            if (!user.meta.chats.find((chatId) => chatId.equals(chatId)))
                throw new Error("chatId not found in user metadata");
            const chat = await chatService.setMessageDeletion({
                chatId: ObjectId(data.chatId),
                messageId: ObjectId(data.messageId),
                isDeleted: true,
                requestUserId: user._id,
            });

            let messageEmitter = io.sockets.to(data.chatId);

            chat.meta.users.forEach(function (userId: Types.ObjectId) {
                if (user._id.toString() === userId.toString()) return;
                messageEmitter = messageEmitter.to(userId.toString());
            });

            const message = chat.messages.find(
                (message) => message._id.toString() === data.messageId
            );
            messageEmitter.emit(ESocketEvents.CHAT_MESSAGE_DELETED, {
                message,
                chatId: chat._id,
            });
        } catch (e) {
            logger.error(e);
        }
    });

    socket.on(ESocketEvents.CHAT_MESSAGE_RESTORED, async function (data: {
        chatId: string;
        messageId: string;
    }) {
        try {
            if (!user.meta.chats.find((chatId) => chatId.equals(chatId)))
                throw new Error("chatId not found in user metadata");
            const chat = await chatService.setMessageDeletion({
                chatId: ObjectId(data.chatId),
                messageId: ObjectId(data.messageId),
                isDeleted: false,
                requestUserId: user._id,
            });

            let messageEmitter = io.sockets.to(data.chatId);

            chat.meta.users.forEach(function (userId: Types.ObjectId) {
                if (user._id.toString() === userId.toString()) return;
                messageEmitter = messageEmitter.to(userId.toString());
            });

            const message = chat.messages.find(
                (message) => message._id.toString() === data.messageId
            );
            messageEmitter.emit(ESocketEvents.CHAT_MESSAGE_RESTORED, {
                message,
                chatId: chat._id,
            });
        } catch (e) {
            logger.error(e);
        }
    });
};

export default initializeChatSocket;
