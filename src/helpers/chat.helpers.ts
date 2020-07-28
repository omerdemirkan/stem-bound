import { IChat } from "../types";
import { Types } from "mongoose";

export function configureChatResponseData({
    chats,
    userId,
    requestQuery,
}: {
    chats: IChat[];
    userId: Types.ObjectId;
    requestQuery: any;
}): Partial<IChat>[] {
    const configuredChats: Partial<IChat>[] = chats.map((chat) => ({
        _id: chat._id,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
        meta: chat.meta,
        messages: [],
    }));

    const { include_unread_messages } = requestQuery;

    if (include_unread_messages) {
        let readMessageFound;
        let messageIndex;
        chats.forEach(function (chat, chatIndex) {
            readMessageFound = false;
            messageIndex = 0;
            while (!readMessageFound && messageIndex < chat.messages.length) {
                if (
                    chat.messages[messageIndex].meta.from.toHexString() ===
                        userId.toHexString() ||
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
