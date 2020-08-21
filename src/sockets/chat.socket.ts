import { Socket } from "socket.io";
import { EChatEvents, ESocketEvents, ISocketOptions } from "../types";
import { EventEmitter } from "events";
import { constructClientChatEvent } from "../helpers/socket.helpers";

export default function initializeChatSocket(
    socket: Socket,
    { userId }: ISocketOptions
) {
    // socket.on(ESocketEvents.CHAT_USER_IS_TYPING, function ({
    //     userId,
    //     chatId,
    // }: {
    //     userId: string;
    //     chatId: string;
    // }) {
    //     socket.broadcast.emit();
    // });
}
