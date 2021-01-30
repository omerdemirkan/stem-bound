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

    socket.on(
        ESocketEvents.CHAT_MESSAGE_CREATED,
        async function (data: { chatId: string; text: string }) {
            try {
                let { text, chatId } = data;
                if (!user.meta.chats.find((chatId) => chatId.equals(chatId)))
                    throw new Error("chatId not found in user metadata");
                const { chat, message } = await chatService.createMessage(
                    ObjectId(data.chatId),
                    {
                        text,
                        meta: {
                            from: user._id,
                            chat: ObjectId(chatId),
                            readBy: [],
                        },
                    }
                );

                let messageEmitter = io.sockets.to(data.chatId);

                chat.meta.users.forEach(function (userId: Types.ObjectId) {
                    if (user._id.toString() === userId.toString()) return;
                    messageEmitter = messageEmitter.to(userId.toString());
                });

                messageEmitter.emit(ESocketEvents.CHAT_MESSAGE_CREATED, {
                    chatId: data.chatId,
                    message,
                    user,
                });
            } catch (e) {
                logger.error(e);
            }
        }
    );

    socket.on(
        ESocketEvents.CHAT_MESSAGE_UPDATED,
        async function (data: {
            chatId: string;
            messageId: string;
            text: string;
        }) {
            try {
                if (!user.meta.chats.find((chatId) => chatId.equals(chatId)))
                    throw new Error("chatId not found in user metadata");
                const message = await chatService.updateMessageById(
                    ObjectId(data.messageId),
                    { text: data.text }
                );

                io.sockets
                    .to(data.chatId)
                    .emit(ESocketEvents.CHAT_MESSAGE_UPDATED, {
                        chatId: data.chatId,
                        message,
                    });
            } catch (e) {
                logger.error(e);
            }
        }
    );

    socket.on(
        ESocketEvents.CHAT_MESSAGE_DELETED,
        async function (data: { chatId: string; messageId: string }) {
            console.log(data);
            try {
                if (!user.meta.chats.find((chatId) => chatId.equals(chatId)))
                    throw new Error("chatId not found in user metadata");
                const message = await chatService.setMessageDeletionById(
                    ObjectId(data.messageId),
                    true
                );

                io.sockets
                    .to(data.chatId)
                    .emit(ESocketEvents.CHAT_MESSAGE_DELETED, {
                        message,
                        chatId: data.chatId,
                    });
            } catch (e) {
                logger.error(e);
            }
        }
    );

    socket.on(
        ESocketEvents.CHAT_MESSAGE_RESTORED,
        async function (data: { chatId: string; messageId: string }) {
            try {
                if (!user.meta.chats.find((chatId) => chatId.equals(chatId)))
                    throw new Error("chatId not found in user metadata");
                const message = await chatService.setMessageDeletionById(
                    ObjectId(data.messageId),
                    false
                );

                io.sockets
                    .to(data.chatId)
                    .emit(ESocketEvents.CHAT_MESSAGE_RESTORED, {
                        message,
                        chatId: data.chatId,
                    });
            } catch (e) {
                logger.error(e);
            }
        }
    );
};

export default initializeChatSocket;
