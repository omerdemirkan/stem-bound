import {
    ESocketEvents,
    EChatEvents,
    IChat,
    IMessage,
    ISocketInitializer,
} from "../types";
import { Types } from "mongoose";
import { chatService } from "../services";

const { ObjectId } = Types;

const initializeChatSocket: ISocketInitializer = (
    socket,
    { eventEmitter, io, user }
) => {
    socket.on(ESocketEvents.CHAT_USER_STARTED_TYPING, function (data) {
        try {
            const { chatId } = data;
            io.sockets.to(chatId).emit(ESocketEvents.CHAT_USER_STARTED_TYPING, {
                chatId,
                user,
            });
        } catch (e) {}
    });
    socket.on(ESocketEvents.CHAT_USER_STOPPED_TYPING, function (data) {
        try {
            const { chatId } = data;
            io.sockets.to(chatId).emit(ESocketEvents.CHAT_USER_STOPPED_TYPING, {
                chatId,
                user,
            });
        } catch (e) {}
    });

    socket.on(ESocketEvents.CHAT_MESSAGE_CREATED, async function (data) {
        try {
            if (!user.meta.chats.includes(data.chatId)) return;
            const senderId = user._id;
            const chatId = ObjectId(data.chatId);
            const text = data.text;
            const chat = await chatService.createMessage({
                chatId,
                senderId,
                text,
            });

            let messageEmitter = io.sockets.to(data.chatId);

            // chat.meta.users.forEach(function (userId: Types.ObjectId) {
            //     messageEmitter = messageEmitter.to(userId.toString());
            // });

            messageEmitter.emit(ESocketEvents.CHAT_MESSAGE_CREATED, {
                chatId: data.chatId,
                message: chat.messages[0],
            });
        } catch (e) {}
    });

    socket.on(ESocketEvents.CHAT_MESSAGE_UPDATED, async function (data) {
        try {
            if (!user.meta.chats.includes(data.chatId)) return;
            const chatId = ObjectId(data.chatId);
            const messageId = ObjectId(data.messageId);
            const text = data.text;
            const message = await chatService.updateMessage({
                chatId,
                text,
                messageId,
            });

            let messageEmitter = io.sockets.to(data.chatId);

            // chat.meta.users.forEach(function (userId: Types.ObjectId) {
            //     messageEmitter = messageEmitter.to(userId.toString());
            // });

            messageEmitter.emit(ESocketEvents.CHAT_MESSAGE_CREATED, {
                chatId: data.chatId,
                message,
            });
        } catch (e) {}
    });
};

export default initializeChatSocket;
