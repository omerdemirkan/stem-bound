import { IChat, ITokenPayload, IMessage } from "../types";
import { Types } from "mongoose";

export function configureChatArrayResponseData(
    chats: IChat[],
    { query, payload }: { query: any; payload: ITokenPayload }
): Partial<IChat>[] {
    const configuredChats: Partial<IChat>[] = chats.map((chat) => ({
        _id: chat._id,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
        meta: chat.meta,
        messages: [],
    }));

    const userId = Types.ObjectId(payload.user._id);
    const { include_unread_messages } = query;

    if (include_unread_messages) {
        let readMessageFound;
        let messageIndex;
        chats.forEach(function (chat, chatIndex) {
            readMessageFound = false;
            messageIndex = 0;
            while (!readMessageFound && messageIndex < chat.messages.length) {
                if (
                    chat.messages[messageIndex].meta.from.toHexString() ===
                        userId.toString() ||
                    !chat.messages[messageIndex].meta.readBy.includes(userId)
                ) {
                    configuredChats[chatIndex].messages.push(
                        chat.messages[messageIndex]
                    );
                    messageIndex++;
                } else {
                    readMessageFound = true;
                }
            }
        });
    }
    return configuredChats;
}

export function configureChatResponseData(
    chat: IChat,
    { query }: { query: any }
): Partial<IChat> {
    const limit = Math.min(+query.limit, 20);
    const skip = +query.skip || 0;

    return {
        _id: chat._id,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
        meta: chat.meta,
        messages: chat.messages.slice(skip, limit + 1),
    };
}

export function configureMessageArrayResponseData(
    messages: IMessage[],
    { query }: { query: any }
): Partial<IMessage[]> {
    const limit = Math.min(+query.limit, 20);
    const skip = +query.skip || 0;

    return messages.slice(skip, limit + 1);
}

export function configureMessageResponseData(
    message: IMessage,
    { query }: { query: any }
) {}
