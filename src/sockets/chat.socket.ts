import { Socket } from "socket.io";
import { ESocketEvents } from "../types/socket.types";
import { IMessage, EChatEvents } from "../types";
import { EventEmitter } from "events";
import { constructClientChatEvent } from "../helpers/socket.helpers";

export default function initializeChatSocket(
    socket: Socket,
    eventEmitter: EventEmitter
) {
    socket.on(ESocketEvents.CHAT_USER_IS_TYPING, function ({
        chatId,
        userId,
    }: {
        chatId: string;
        userId: string;
    }) {
        socket.emit(
            constructClientChatEvent({
                chatId,
                event: ESocketEvents.CHAT_USER_IS_TYPING,
            }),
            {
                chatId,
                userId,
            }
        );
    });

    socket.on(ESocketEvents.CHAT_USER_STOPPED_TYPING, function ({
        chatId,
        userId,
    }: {
        chatId: string;
        userId: string;
    }) {
        socket.emit(
            `chats/${chatId}/${ESocketEvents.CHAT_USER_STOPPED_TYPING}`,
            { chatId, userId }
        );
    });

    function newChatMessageEventListener({
        chatId,
        message,
    }: {
        chatId: string;
        message: IMessage;
    }) {
        socket.emit(
            constructClientChatEvent({
                chatId: chatId,
                event: ESocketEvents.CHAT_USER_IS_TYPING,
            })
        );
    }
    eventEmitter.addListener(
        EChatEvents.CHAT_MESSAGE_CREATED,
        newChatMessageEventListener
    );

    socket.on("disconnect", () => {
        console.log("user disconnected");
        eventEmitter.removeListener(
            EChatEvents.CHAT_MESSAGE_CREATED,
            newChatMessageEventListener
        );
    });
}
