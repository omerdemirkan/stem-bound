import { Subscriber } from "../helpers";
import { IEventEmitterOnFunction, EChatEvents, IMessage } from "../types";
import { Types } from "mongoose";
import { logger } from "../config";

function initializeChatSubscribers(on: IEventEmitterOnFunction) {
    on(EChatEvents.CHAT_MESSAGE_CREATED, function ({
        chatId,
        message,
    }: {
        chatId: Types.ObjectId;
        message: IMessage;
    }) {
        logger.info(
            `User ${message.meta.from} sent a message to chat ${chatId}. \nMessage: ${message.text}`
        );
    });

    on(EChatEvents.CHAT_MESSAGE_UPDATED, function ({
        chatId,
        message,
    }: {
        chatId: Types.ObjectId;
        message: IMessage;
    }) {
        logger.info(
            `User ${message.meta.from} updated a message in chat ${chatId}. \nMessage: ${message.text}`
        );
    });

    on(EChatEvents.CHAT_MESSAGE_DELETED, function ({
        chatId,
        message,
    }: {
        chatId: Types.ObjectId;
        message: IMessage;
    }) {
        logger.info(
            `User ${message.meta.from} deleted a message in chat ${chatId}. \nMessage: ${message.text}`
        );
    });
}

export default new Subscriber(initializeChatSubscribers);
