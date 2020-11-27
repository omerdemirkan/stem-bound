import { Model, Types } from "mongoose";
import { IChat, IMessage, EModels, EErrorTypes, IUser } from "../types";
import { EventEmitter } from "events";
import { model, emitter } from "../decorators";
import { ErrorService, errorService } from ".";
import UserService from "./user.services";

export default class ChatService {
    @model(EModels.CHAT)
    private Chat: Model<IChat>;

    @emitter()
    private eventEmitter: EventEmitter;

    constructor(
        private userService: UserService,
        private errorService: ErrorService
    ) {}

    async createChat(
        chatData: IChat,
        options?: {
            preventEmptyMessages?: boolean;
        }
    ): Promise<IChat> {
        if (options?.preventEmptyMessages && !chatData.messages.length) {
            errorService.throwError(
                EErrorTypes.BAD_REQUEST,
                "Initial messages Required"
            );
        }

        return await this.Chat.create(chatData);
    }

    async findChatsByUserIds(
        userIds: Types.ObjectId[],
        requestingUser: IUser,
        options?: { exact?: boolean }
    ) {
        userIds = userIds.find((id) => id.equals(requestingUser._id))
            ? userIds
            : [...userIds, requestingUser._id];
        let query = this.Chat.find({
            _id: { $in: requestingUser.meta.chats },
            "meta.users": { $all: userIds },
        });

        if (options?.exact) {
            query = query.size("meta.users", userIds.length);
        }
        return await query;
    }

    async findChats(
        where: any,
        requestingUserId: Types.ObjectId,
        options?: {
            limit?: number;
            skip?: number;
            sort?: object;
            overriderequestingUserIdValidation?: boolean;
        }
    ): Promise<IChat[]> {
        const chats = await this.Chat.find(where)
            .sort(options.sort || { lastMessageSentAt: -1 })
            .skip(options.skip || 0)
            .limit(Math.min(options.limit, 20));

        let userHashTable: { [key: string]: IUser } = {};

        chats.forEach(function (chat) {
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
            if (!chats[i].isGroupChat) {
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

    async findChatsByIds(
        ids: Types.ObjectId[],
        requestingUserId: Types.ObjectId,
        options?: {
            where?: object;
            limit?: number;
            skip?: number;
            sort?: object;
            overriderequestingUserIdValidation?: boolean;
        }
    ): Promise<IChat[]> {
        const where = { _id: { $in: ids }, ...options?.where };
        return await this.findChats(where, requestingUserId, {
            ...options,
        });
    }

    async findChat(where: object): Promise<IChat> {
        return await this.Chat.findOneAndUpdate(
            where,
            {
                $sort: {
                    $each: { messages: { createdAt: -1 } },
                },
            },
            { new: true }
        );
    }

    async findChatById(chatId: Types.ObjectId): Promise<IChat> {
        return await this.findChat({ _id: chatId });
    }

    async updateChat(where: object, chatData: Partial<IChat>): Promise<IChat> {
        return await this.Chat.findOneAndUpdate(where, chatData, {
            new: true,
        });
    }

    async updateChatById(
        id: Types.ObjectId,
        chatData: Partial<IChat>
    ): Promise<IChat> {
        return await this.Chat.findByIdAndUpdate(id, chatData, { new: true });
    }

    async deleteChat(where: object): Promise<IChat> {
        return await this.Chat.findOneAndDelete(where);
    }

    async deleteChatById(id: Types.ObjectId): Promise<IChat> {
        return await this.Chat.findByIdAndDelete(id);
    }

    async findMessages(
        {
            chatId,
            requestingUserId,
        }: {
            chatId: Types.ObjectId;
            requestingUserId: Types.ObjectId;
        },
        options?: {
            skip?: number;
            limit?: number;
        }
    ): Promise<IMessage[]> {
        const chat = await this.findChatById(chatId);

        if (!chat) {
            errorService.throwError(
                EErrorTypes.DOCUMENT_NOT_FOUND,
                "Chat not found"
            );
        }

        const skip = +options?.skip || 0;
        const limit = Math.min(
            +options?.limit ? Math.min(+options?.limit, 20) : 20,
            chat.messages.length
        );
        const limitIndex = limit + skip;

        for (let i = skip; i < limitIndex; i++) {
            if (
                !requestingUserId.equals(chat.messages[i].meta.from) &&
                !chat.messages[i].meta.readBy.some((id) =>
                    requestingUserId.equals(id)
                )
            ) {
                chat.messages[i].meta.readBy.push(requestingUserId);
            }
        }

        await chat.save();

        const messages = chat.messages.slice(skip, limit + 1);

        // const skip = +options?.skip || 0;
        // const limit = +options?.limit ? Math.min(+options?.limit, 20) : 20;

        // const messages = await this.Chat.aggregate([
        //     { $match: { _id: chatId } },
        //     {
        //         $unwind: "$messages",
        //     },
        //     { $sort: { "messages.createdAt": -1 } },
        //     { $skip: skip },
        //     { $limit: limit },
        // ])

        return messages;
    }

    async createMessage({
        text,
        chatId,
        requestingUserId,
    }: {
        text: string;
        chatId: Types.ObjectId;
        requestingUserId: Types.ObjectId;
    }): Promise<IChat> {
        let chat = await this.Chat.findById(chatId);
        chat.messages.unshift({
            text,
            meta: { from: requestingUserId, readBy: [] },
            isDeleted: false,
            isEdited: false,
        });

        chat.lastMessageSentAt = new Date();

        return await chat.save();
    }

    async updateMessage({
        text,
        chatId,
        messageId,
    }: {
        text: string;
        chatId: Types.ObjectId;
        messageId: Types.ObjectId;
    }): Promise<IChat> {
        const chat = await this.Chat.findOneAndUpdate(
            { _id: chatId, "messages._id": messageId },
            { $set: { "messages.$.text": text, "messages.$.isEdited": true } },
            { new: true }
        );

        return chat;
    }

    async setMessageDeletion({
        chatId,
        messageId,
        requestingUserId,
        isDeleted,
    }: {
        chatId: Types.ObjectId;
        messageId: Types.ObjectId;
        requestingUserId: Types.ObjectId;
        isDeleted: boolean;
    }): Promise<IChat> {
        const chat = await this.findChatById(chatId);
        const messageIndex = chat.messages.findIndex((message) =>
            messageId.equals(message._id)
        );
        const message = chat.messages[messageIndex];
        if (!requestingUserId.equals(message.meta.from))
            errorService.throwError(
                EErrorTypes.FORBIDDEN,
                "You cannot delete/restore others' messages"
            );
        message.isDeleted = isDeleted;
        await chat.save();

        return chat;
    }
}
