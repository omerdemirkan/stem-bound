import {
    IChat,
    ITokenPayload,
    IMessage,
    IUser,
    EChatTypes,
    IQuery,
} from "../types";
import { Types } from "mongoose";

const { ObjectId } = Types;

export function configureMessageArrayQuery(
    requestQuery: any
): IQuery<IMessage> {
    let { skip, limit, before, after } = requestQuery;
    skip = +skip;
    limit = +limit;
    before = before ? new Date(before) : null;
    after = after ? new Date(after) : null;

    let query: IQuery<IMessage> = { filter: {} };

    if (skip) query.skip = skip;
    if (limit) query.limit = limit;
    if (before || after) query.filter.createdAt = {};
    // @ts-ignore
    if (before) query.filter.createdAt.$lt = before;
    // @ts-ignore
    if (after) query.filter.createdAt.$gt = after;
    return query;
}

export function configureChatArrayQuery(requestQuery: any): IQuery<IChat> {
    let {
        user_ids,
        exact_match,
        private_chat,
        skip,
        limit,
        before,
        after,
    } = requestQuery;
    user_ids = user_ids?.join(",").map((id) => ObjectId(id)) as
        | Types.ObjectId[]
        | null;
    skip = +skip;
    limit = +limit;
    before = before ? new Date(before) : null;
    after = after ? new Date(before) : null;
    let query: IQuery<IChat> = { filter: {} };
    if (user_ids && !private_chat)
        query.filter["meta.users"] = {
            $all: user_ids,
        };
    if (user_ids && !private_chat && exact_match)
        query.filter["meta.users"].$size = user_ids.length;

    if (user_ids && private_chat)
        query.filter.privateChatKey = configurePrivateChatKey(user_ids);

    if (skip) query.skip = skip;
    if (limit) query.limit = limit;
    return query;
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

export function configurePrivateChatKey(userIds: Types.ObjectId[]): string {
    const stringUserIds = userIds.map((u) => u.toString());
    stringUserIds.sort();
    return stringUserIds.join("-");
}
