import { IChat, ITokenPayload, IMessage } from "../types";
import { Types } from "mongoose";

export function configureChatArrayResponseData(
    chats: IChat[],
    { query, payload }: { query: any; payload: ITokenPayload }
): Partial<IChat>[] {
    const configuredChats: Partial<IChat>[] = chats.map((chat) => ({
        ...chat.toObject(),
        messages: chat.messages.slice(0, 21),
    }));

    const userId = Types.ObjectId(payload.user._id);
    const { include_unread_messages } = query;

    // if (include_unread_messages) {
    //     let readMessageFound;
    //     let messageIndex;
    //     chats.forEach(function (chat, chatIndex) {
    //         readMessageFound = false;
    //         messageIndex = 0;
    //         while (!readMessageFound && messageIndex < chat.messages.length) {
    //             if (
    //                 chat.messages[messageIndex].meta.from.toString() ===
    //                     userId.toString() ||
    //                 !chat.messages[messageIndex].meta.readBy.includes(userId)
    //             ) {
    //                 configuredChats[chatIndex].messages.push(
    //                     chat.messages[messageIndex]
    //                 );
    //                 messageIndex++;
    //             } else {
    //                 readMessageFound = true;
    //             }
    //         }
    //     });
    // }
    return configuredChats;
}

export function configureChatResponseData(
    chat: IChat,
    { query, senderUserId }: { query: any; senderUserId: Types.ObjectId }
): Partial<IChat> {
    const limit = +query.limit ? Math.min(+query.limit, 20) : 20;
    const skip = +query.skip || 0;
    const messages = chat.messages
        .filter(
            (message) =>
                !message.isDeleted && !senderUserId.equals(message.meta.from)
        )
        .slice(skip, limit + 1);

    return {
        ...chat.toObject(),
        messages,
    };
}

export function configureMessageResponseData(
    message: IMessage,
    { query }: { query: any }
) {}

export function configureMessageArrayResponseData(
    messages: IMessage[],
    {
        query,
    }: {
        query: any;
    }
) {
    const limit = Math.min(+query.limit || 20, 20);
    const skip = +query.skip || 0;
    const configuredMessages = messages.slice(skip, limit + 1);

    return configuredMessages;
}
