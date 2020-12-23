import {
    IChat,
    ITokenPayload,
    IMessage,
    IUser,
    EChatTypes,
    IQuery,
    IRequestMetadata,
} from "../types";
import { Types } from "mongoose";
import { Request } from "express";
import { userService } from "../services";

const { ObjectId } = Types;

export function configureMessageArrayQuery(
    requestMetadata: IRequestMetadata
): IQuery<IMessage> {
    let { skip, limit, before, after } = requestMetadata.query;
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

export function configureChatArrayQuery(
    requestMetadata: IRequestMetadata
): IQuery<IChat> {
    let {
        user_ids,
        exact_match,
        private_chat,
        skip,
        limit,
        before,
        after,
    } = requestMetadata.query;
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

export async function configureChatArrayResponseData(
    chats: IChat[],
    requestMetadata: IRequestMetadata
): Promise<IChat[]> {
    await configureChatArrayPictureUrls(
        chats,
        ObjectId(requestMetadata.payload.user._id)
    );
    return chats;
}

export async function configureChatResponseData(
    chat: IChat,
    requestMetadata: IRequestMetadata
): Promise<IChat> {
    await configureChatArrayPictureUrls(
        [chat],
        ObjectId(requestMetadata.payload.user._id)
    );
    return chat;
}

export function configureMessageArrayResponseData(
    messages: IMessage[],
    requestMetadata: IRequestMetadata
): IMessage[] {
    return messages;
}

export function configureMessageResponseData(
    message: IMessage,
    requestMetadata: IRequestMetadata
): IMessage {
    return message;
}

export async function configureChatArrayPictureUrls(
    chats: IChat[],
    requestingUserId: Types.ObjectId
): Promise<IChat[]> {
    let userHashTable: { [key: string]: IUser } = {};

    chats.forEach(function (chat) {
        if (chat.type !== EChatTypes.PRIVATE) return;
        chat.meta.users.forEach(function (userId) {
            // @ts-ignore
            userHashTable[userId.toHexString()] = userId;
        });
    });

    delete userHashTable[requestingUserId.toHexString()];

    const users = await userService.findUsersByIds(
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
