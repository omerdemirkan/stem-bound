import { Model, Types } from "mongoose";
import {
    IChat,
    IMessage,
    EModels,
    IQuery,
    EChatTypes,
    IFilterQuery,
    IUpdateQuery,
    IUser,
} from "../types";
import { EventEmitter } from "events";
import { model, emitter } from "../decorators";
import { ErrorService } from ".";
import UserService from "./user.services";
import { configurePrivateChatKey } from "../helpers";

export default class ChatService {
    @model(EModels.CHAT)
    private Chat: Model<IChat>;
    @model(EModels.MESSAGE)
    private Message: Model<IMessage>;

    @emitter()
    private eventEmitter: EventEmitter;

    constructor(
        private userService: UserService,
        private errorService: ErrorService
    ) {}

    async createChat(chatData: Partial<IChat>): Promise<IChat> {
        if (chatData.type === EChatTypes.PRIVATE)
            chatData.privateChatKey = configurePrivateChatKey(
                chatData.meta.users
            );
        // @ts-ignore
        return await this.Chat.create(chatData);
    }

    async findPrivateChatByUserIds(userIds: Types.ObjectId[]) {
        return await this.findChat({
            privateChatKey: configurePrivateChatKey(userIds),
        });
    }

    async findChatsByUserIds(
        userIds: Types.ObjectId[],
        options?: { exact?: boolean }
    ) {
        let query = this.Chat.find({
            "meta.users": { $all: userIds },
        });

        if (options?.exact) query = query.size("meta.users", userIds.length);

        return await query;
    }

    async findChatsByUserId(
        userId: Types.ObjectId,
        query: IQuery<IChat> = { filter: {} }
    ) {
        query.filter["meta.users"] = userId;
        return await this.findChats(query);
    }

    async findChats(query: IQuery<IChat>): Promise<IChat[]> {
        const chats = await this.Chat.find(query.filter)
            .sort(query.sort || { lastMessageSentAt: -1 })
            .skip(query.skip || 0)
            .limit(Math.min(query.limit, 20));
        return chats;
    }

    async findChatsByIds(
        ids: Types.ObjectId[],
        query: IQuery<IChat> = { filter: {} }
    ): Promise<IChat[]> {
        query.filter = { ...query.filter, _id: { $in: ids } };
        return await this.findChats(query);
    }

    async findChat(filter: IFilterQuery<IChat>): Promise<IChat> {
        return await this.Chat.findOne(filter);
    }

    async findChatById(chatId: Types.ObjectId): Promise<IChat> {
        return await this.findChatById(chatId);
    }

    async updateChat(
        filter: IFilterQuery<IChat>,
        chatData: IUpdateQuery<IChat>
    ): Promise<IChat> {
        return await this.Chat.findOneAndUpdate(filter, chatData, {
            new: true,
            runValidators: true,
        });
    }

    async updateChatById(
        id: Types.ObjectId,
        chatData: Partial<IChat>
    ): Promise<IChat> {
        return await this.updateChat({ _id: id }, chatData);
    }

    async deleteChat(filter: IFilterQuery<IChat>): Promise<IChat> {
        return await this.Chat.findOneAndDelete(filter);
    }

    async deleteChatById(id: Types.ObjectId): Promise<IChat> {
        return await this.Chat.findByIdAndDelete(id);
    }

    async findMessages(query: IQuery<IMessage>) {
        return await this.Message.find(query.filter)
            .sort(query.sort || { createdAt: -1 })
            .skip(query.skip || 0)
            .limit(Math.min(query.limit, 20));
    }

    async findMessage(filter: IFilterQuery<IMessage>) {
        return await this.Message.findOne(filter);
    }

    async findMessageById(messageId: Types.ObjectId) {
        return await this.findMessage({ _id: messageId });
    }

    async findMessagesByChatId(
        chatId: Types.ObjectId,
        query: IQuery<IMessage> = { filter: {} }
    ): Promise<IMessage[]> {
        query.filter = { ...query.filter, "meta.chat": chatId };
        return await this.findMessages(query);
    }

    async createMessage(
        chatId: Types.ObjectId,
        messageData: Partial<IMessage>
    ): Promise<{ message: IMessage; chat: IChat }> {
        messageData.meta.chat = chatId;
        const [message, chat] = await Promise.all([
            // @ts-ignore
            this.Message.create(messageData),
            this.updateChatById(chatId, { lastMessageSentAt: new Date() }),
        ]);
        return { message, chat };
    }

    async updateMessage(
        filter: IFilterQuery<IMessage>,
        messageData: IUpdateQuery<IMessage>
    ): Promise<IMessage> {
        // @ts-ignore
        if (messageData.text) messageData.isEdited = true;
        return await this.Message.findOneAndUpdate(filter, messageData, {
            new: true,
            runValidators: true,
        });
    }

    async updateMessageById(
        messageId: Types.ObjectId,
        messageData: IUpdateQuery<IMessage>
    ): Promise<IMessage> {
        return await this.updateMessage({ _id: messageId }, messageData);
    }

    async setMessageDeletion(
        filter: IFilterQuery<IMessage>,
        isDeleted: boolean
    ): Promise<IMessage> {
        return await this.updateMessage(filter, { isDeleted });
    }

    async setMessageDeletionById(
        messageId: Types.ObjectId,
        isDeleted: boolean
    ): Promise<IMessage> {
        return await this.setMessageDeletion({ _id: messageId }, isDeleted);
    }

    async removeUserMetadata({
        userIds,
        chatIds,
    }: {
        userIds: Types.ObjectId[];
        chatIds: Types.ObjectId[];
    }) {
        await this.Chat.updateMany(
            { _id: { $in: chatIds } },
            {
                $pullAll: { "meta.users": userIds },
            }
        );
    }

    async addUserMetadata({
        userIds,
        chatIds,
    }: {
        userIds: Types.ObjectId[];
        chatIds: Types.ObjectId[];
    }) {
        await this.Chat.updateMany(
            { _id: { $in: chatIds } },
            {
                $addToSet: { "meta.users": { $each: userIds } },
            }
        );
    }
}
