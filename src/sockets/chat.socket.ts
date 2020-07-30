import { Socket } from "socket.io";
import { ISocketEvents } from "../types/socket.types";

export default function initializeChatSocket(socket: Socket) {
    socket.on(ISocketEvents.CHAT_USER_IS_TYPING, function ({
        chatId,
        userId,
    }: {
        chatId: string;
        userId: string;
    }) {
        socket.emit(`chats/${chatId}/${ISocketEvents.CHAT_USER_IS_TYPING}`, {
            chatId,
            userId,
        });
    });

    socket.on(ISocketEvents.CHAT_USER_STOPPED_TYPING, function ({
        chatId,
        userId,
    }: {
        chatId: string;
        userId: string;
    }) {
        socket.emit(
            `chats/${chatId}/${ISocketEvents.CHAT_USER_STOPPED_TYPING}`,
            { chatId, userId }
        );
    });
}
