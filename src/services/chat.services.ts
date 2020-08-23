import { Model, Types } from "mongoose";
import { IChat, IMessage, EChatEvents, EModels } from "../types";
import { EventEmitter } from "events";
import { model, emitter } from "../decorators";

export default class ChatService {
    @model(EModels.CHAT)
    private Chat: Model<IChat>;

    @emitter()
    private eventEmitter: EventEmitter;

    async createChat(
        chatData: IChat,
        options?: {
            preventDuplicationByUserIds?: boolean;
            preventEmptyMessages?: boolean;
        }
    ): Promise<IChat> {
        if (options?.preventEmptyMessages && !chatData.messages.length) {
            throw new Error("Initial messages Required");
        }

        if (options?.preventDuplicationByUserIds) {
            const chatUsers: any = chatData.meta.users;
            const duplicateChat: any = await this.findChatByUserIds(chatUsers, {
                exact: true,
            });
            if (duplicateChat) {
                throw new Error("This chat is a duplicate of another chat.");
            }
        }

        return await this.Chat.create(chatData);
    }

    findChatByUserIds(userIds, options?: { exact: boolean }) {
        let query = this.Chat.findOne().all("meta.users", userIds);

        if (options?.exact) {
            query = query.size("meta.users", userIds.length);
        }
        return query;
    }

    async findChats(
        where: any,
        options: {
            limit?: number;
            skip?: number;
            sort?: object;
            requestUserId: Types.ObjectId;
            overrideRequestUserIdValidation?: boolean;
        }
    ): Promise<IChat[]> {
        if (!options.overrideRequestUserIdValidation) {
            where["meta.users"] = options.requestUserId;
        }
        return await this.Chat.find(where)
            .sort(options.sort)
            .skip(options.skip || 0)
            .limit(Math.min(options.limit, 20));
    }

    async findChatsByIds(
        ids: Types.ObjectId[],
        {
            where,
            ...options
        }: {
            where?: object;
            limit?: number;
            skip?: number;
            sort?: object;
            requestUserId: Types.ObjectId;
            overrideRequestUserIdValidation?: boolean;
        }
    ): Promise<IChat[]> {
        return await this.findChats(
            { _id: { $in: ids }, ...where },
            {
                ...options,
            }
        );
    }

    async findChat(
        where: object,
        { requestUserId }: { requestUserId: Types.ObjectId }
    ): Promise<IChat> {
        return await this.Chat.findOne({
            ...where,
            "meta.users": requestUserId,
        });
    }

    async findChatById(
        id: Types.ObjectId,
        { requestUserId }: { requestUserId: Types.ObjectId }
    ): Promise<IChat> {
        return await this.findChat(id, {
            requestUserId: requestUserId,
        });
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
        chatId: Types.ObjectId,
        options: {
            skip?: number;
            limit?: number;
            requestUserId: Types.ObjectId;
        }
    ): Promise<IMessage[]> {
        const limit = +options?.limit ? Math.min(+options?.limit, 20) : 20;
        const skip = +options?.skip || 0;

        const chat = await this.findChatById(chatId, {
            requestUserId: options.requestUserId,
        });

        if (!chat) {
            throw new Error("Chat not found");
        } else if (
            !chat.meta.users.find(
                (id) => id.toString() === options.requestUserId.toString()
            )
        ) {
            throw new Error("Unauthorized request user id");
        }

        const messages = chat.messages.slice(skip, limit + 1);

        messages.forEach(function (message) {
            if (message.isDeleted) {
                message.text = "This message was deleted";
            }
        });
        return messages;
    }

    async createMessage({
        chatId,
        text,
        senderId,
    }: {
        chatId: Types.ObjectId;
        text: string;
        senderId: Types.ObjectId;
    }): Promise<IChat> {
        let chat = await this.Chat.findById(chatId);
        chat.messages.unshift({
            text,
            meta: { from: senderId, readBy: [] },
            isDeleted: false,
        });

        return await chat.save();
    }

    async updateMessage({
        chatId,
        messageId,
        text,
    }: {
        chatId: Types.ObjectId;
        messageId: Types.ObjectId;
        text;
    }): Promise<IChat> {
        const chat = await this.Chat.findOneAndUpdate(
            { _id: chatId, "messages._id": messageId },
            { $set: { "messages.$.text": text } },
            { new: true }
        );

        return chat;
    }

    async setMessageDeletion({
        chatId,
        messageId,
        isDeleted,
    }: {
        chatId: Types.ObjectId;
        messageId: Types.ObjectId;
        isDeleted: boolean;
    }): Promise<IChat> {
        const chat = await this.Chat.findOneAndUpdate(
            { _id: chatId, "messages._id": messageId },
            { $set: { "messages.$.isDeleted": isDeleted } },
            { new: true }
        );

        return chat;
    }
}
