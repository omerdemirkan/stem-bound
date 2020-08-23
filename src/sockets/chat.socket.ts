import {
    ESocketEvents,
    EChatEvents,
    IChat,
    IMessage,
    ISocketInitializer,
} from "../types";
import { Types } from "mongoose";

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

    // socket.on(ESocketEvents.CHAT_MESSAGE_CREATED, function (data) {
    //     try {
    //         const { chatId } = data;
    //         const
    //     } catch (e) {}
    // });

    function newChatMessageListener({
        chat,
        message,
    }: {
        chat: IChat;
        message: IMessage;
    }) {
        let messageEmitter = io.sockets.to(chat._id);

        chat.meta.users.forEach(function (userId: Types.ObjectId) {
            messageEmitter = messageEmitter.to(userId.toString());
        });

        messageEmitter.emit(ESocketEvents.CHAT_MESSAGE_CREATED, {
            chatId: chat._id,
            message,
        });
    }

    function updatedChatMessageListener({
        chat,
        message,
    }: {
        chat: IChat;
        message: IMessage;
    }) {
        let messageEmitter = io.sockets.to(chat._id);

        chat.meta.users.forEach(function (userId: Types.ObjectId) {
            if (userId.equals(message.meta.from)) return;
            messageEmitter = messageEmitter.to(userId.toString());
        });

        messageEmitter.emit(ESocketEvents.CHAT_MESSAGE_UPDATED, {
            chatId: chat._id,
            message,
        });
    }

    eventEmitter.on(EChatEvents.CHAT_MESSAGE_CREATED, newChatMessageListener);
    eventEmitter.on(
        EChatEvents.CHAT_MESSAGE_UPDATED,
        updatedChatMessageListener
    );

    socket.on("disconnect", function () {
        eventEmitter.removeListener(
            EChatEvents.CHAT_MESSAGE_CREATED,
            newChatMessageListener
        );
        eventEmitter.removeListener(
            EChatEvents.CHAT_MESSAGE_UPDATED,
            updatedChatMessageListener
        );
    });
};

export default initializeChatSocket;
