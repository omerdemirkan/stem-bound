import {
    IChat,
    ITokenPayload,
    IMessage,
    IUser,
    EChatTypes,
    IQuery,
} from "../types";
import { Types } from "mongoose";

export function configureMessageArrayQuery(
    requestQuery: any
): IQuery<IMessage> {
    return {};
}

export function configureMessageQuery(requestQuery: any): IQuery<IMessage> {
    return {};
}

export function configureChatArrayResponseData(
    chats: IChat[],
    { query, payload }: { query: any; payload: ITokenPayload }
): Partial<IChat>[] {
    const configuredChats: Partial<IChat>[] = chats.map((chat) => ({
        ...chat.toObject(),
        messages: chat.messages.slice(0, 21),
    }));
    return configuredChats;
}

export function configureChatResponseData(
    chat: IChat,
    {
        query,
        requestingUserId,
    }: { query: any; requestingUserId: Types.ObjectId }
): Partial<IChat> {
    const limit = +query.limit ? Math.min(+query.limit, 20) : 20;
    const skip = +query.skip || 0;
    const messages = chat.messages
        .filter(
            (message) =>
                !message.isDeleted &&
                !requestingUserId.equals(message.meta.from)
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

export async function configureChatPictureUrls(
    chats: IChat[],
    requestingUserId: Types.ObjectId
) {
    let userHashTable: { [key: string]: IUser } = {};

    chats.forEach(function (chat) {
        if (chat.type !== EChatTypes.PRIVATE) return;
        chat.meta.users.forEach(function (userId) {
            // @ts-ignore
            userHashTable[userId.toHexString()] = userId;
        });
    });

    delete userHashTable[requestingUserId.toHexString()];

    const users = await this.userService.findUsersByIds(
        Object.values(userHashTable) as any
    );

    users.forEach(function (user) {
        userHashTable[user._id.toHexString()] = user;
    });

    let i = chats.length;
    while (i--) {
        if (chats[i].type === EChatTypes.PRIVATE) {
            const user =
                userHashTable[
                    chats[i].meta.users
                        .find((u) => !requestingUserId.equals(u))
                        .toHexString()
                ];

            chats[i].pictureUrl = user.profilePictureUrl;
            chats[i].name = `${user.firstName} ${user.lastName}`;
        }
    }

    return chats;
}
