import { Socket } from "socket.io";
import { ISocketOptions, ESocketEvents } from "../types";

export default function initializeChatSocket(
    socket: Socket,
    { eventEmitter, io }: ISocketOptions
) {
    socket.on(ESocketEvents.CHAT_USER_STARTED_TYPING, function (data) {
        try {
            const { chatId, user } = data;
            io.sockets.to(chatId).emit(ESocketEvents.CHAT_USER_STARTED_TYPING, {
                chatId,
                user,
            });
        } catch (e) {}
    });
    socket.on(ESocketEvents.CHAT_USER_STOPPED_TYPING, function (data) {
        try {
            const { chatId, user } = data;
            io.sockets.to(chatId).emit(ESocketEvents.CHAT_USER_STOPPED_TYPING, {
                chatId,
                user,
            });
        } catch (e) {}
    });
}
