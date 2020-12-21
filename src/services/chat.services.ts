import { Model, Types } from "mongoose";
import {
    IChat,
    IMessage,
    EModels,
    EErrorTypes,
    IUser,
    IQuery,
    EChatTypes,
    IFilterQuery,
    IUpdateQuery,
} from "../types";
import { EventEmitter } from "events";
import { model, emitter } from "../decorators";
import { ErrorService, errorService } from ".";
import UserService from "./user.services";

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

    private configurePrivateChatKey(userIds: Types.ObjectId[]): string {
        const stringUserIds = userIds.map((u) => u.toString());
        stringUserIds.sort();
        return stringUserIds.join("-");
    }

    async createChat(chatData: IChat): Promise<IChat> {
        if (chatData.type === EChatTypes.PRIVATE)
            chatData.privateChatKey = this.configurePrivateChatKey(
                chatData.meta.users
            );
        return await this.Chat.create(chatData);
    }

    async findPrivateChatByUserIds(userIds: Types.ObjectId[]) {
        return await this.Chat.findOne({
            privateChatKey: this.configurePrivateChatKey(userIds),
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

    async findChat(query: IQuery<IChat>): Promise<IChat> {
        return await this.Chat.findOne(query.filter).sort(query.sort);
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
        });
    }

    async updateChatById(
        id: Types.ObjectId,
        chatData: Partial<IChat>
    ): Promise<IChat> {
        return await this.updateChat({ _id: id }, chatData);
    }

    async deleteChat(where: object): Promise<IChat> {
        return await this.Chat.findOneAndDelete(where);
    }

    async deleteChatById(id: Types.ObjectId): Promise<IChat> {
        return await this.Chat.findByIdAndDelete(id);
    }

    async findMessages(query: IQuery<IMessage>) {
        return await this.Message.find(query.filter)
            .sort(query.sort || { lastMessageSentAt: -1 })
            .skip(query.skip || 0)
            .limit(Math.min(query.limit, 20));
    }

    async findMessagesByChatId(
        chatId: Types.ObjectId,
        query: IQuery<IMessage> = { filter: {} }
    ): Promise<IMessage[]> {
        query.filter = { ...query.filter, _id: chatId };
        return await this.findMessages(query);
    }

    async createMessage(
        messageData: Partial<IMessage>,
        chatId: Types.ObjectId
    ): Promise<{ message: IMessage; chat: IChat }> {
        const [message, chat] = await Promise.all([
            // @ts-ignore
            this.Message.create(messageData),
            this.updateChatById(chatId, { lastMessageSentAt: new Date() }),
        ]);
        return { message, chat };
    }

    async updateMessage(
        messageData: IUpdateQuery<IMessage>,
        filter: IFilterQuery<IMessage>
    ): Promise<IMessage> {
        return await this.Message.findOneAndUpdate(filter, messageData);
    }

    async updateMessageById(
        messageData: IUpdateQuery<IMessage>,
        messageId: Types.ObjectId
    ): Promise<IMessage> {
        return await this.updateMessage(messageData, { _id: messageId });
    }

    async setMessageDeletion(
        isDeleted: boolean,
        filter: IFilterQuery<IMessage>
    ): Promise<IMessage> {
        return await this.updateMessage({ isDeleted }, filter);
    }

    async setMessageDeletionById(
        isDeleted: boolean,
        messageId: Types.ObjectId
    ): Promise<IMessage> {
        return await this.setMessageDeletion(isDeleted, { _id: messageId });
    }
}
