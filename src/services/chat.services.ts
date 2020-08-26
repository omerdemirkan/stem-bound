import { Model, Types } from "mongoose";
import { IChat, IMessage, EModels, EErrorTypes } from "../types";
import { EventEmitter } from "events";
import { model, emitter } from "../decorators";
import { ErrorService, errorService } from ".";

export default class ChatService {
    @model(EModels.CHAT)
    private Chat: Model<IChat>;

    @emitter()
    private eventEmitter: EventEmitter;

    constructor(private errorService: ErrorService) {}

    async createChat(
        chatData: IChat,
        options?: {
            preventDuplicationByUserIds?: boolean;
            preventEmptyMessages?: boolean;
        }
    ): Promise<IChat> {
        if (options?.preventEmptyMessages && !chatData.messages.length) {
            errorService.throwError(
                EErrorTypes.BAD_REQUEST,
                "Initial messages Required"
            );
        }

        if (options?.preventDuplicationByUserIds) {
            const chatUsers: any = chatData.meta.users;
            const duplicateChat: any = await this.findChatByUserIds(chatUsers, {
                exact: true,
            });
            if (duplicateChat) {
                errorService.throwError(
                    EErrorTypes.CONFLICT,
                    "This chat is a duplicate of another chat"
                );
            }
        }

        return await this.Chat.create(chatData);
    }

    findChatByUserIds(userIds, options?: { exact?: boolean }) {
        let query = this.Chat.findOne().all("meta.users", userIds);

        if (options?.exact) {
            query = query.size("meta.users", userIds.length);
        }
        return query;
    }

    async findChats(
        where: any,
        options?: {
            limit?: number;
            skip?: number;
            sort?: object;
            overrideRequestUserIdValidation?: boolean;
        }
    ): Promise<IChat[]> {
        return await this.Chat.find(where)
            .sort(options.sort)
            .skip(options.skip || 0)
            .limit(Math.min(options.limit, 20));
    }

    async findChatsByIds(
        ids: Types.ObjectId[],
        options?: {
            where?: object;
            limit?: number;
            skip?: number;
            sort?: object;
            overrideRequestUserIdValidation?: boolean;
        }
    ): Promise<IChat[]> {
        const where = { _id: { $in: ids }, ...options?.where };
        return await this.findChats(where, {
            ...options,
        });
    }

    async findChat(where: object): Promise<IChat> {
        return await this.Chat.findOneAndUpdate(where, {
            $sort: {
                $each: { messages: { createdAt: -1 } },
            },
        });
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
            requestUserId,
        }: {
            chatId: Types.ObjectId;
            requestUserId: Types.ObjectId;
        },
        options?: {
            skip?: number;
            limit?: number;
        }
    ): Promise<IMessage[]> {
        const chat = await this.Chat.findById(chatId);

        if (!chat) {
            errorService.throwError(
                EErrorTypes.DOCUMENT_NOT_FOUND,
                "Chat not found"
            );
        } else if (!chat.meta.users.some((id) => requestUserId.equals(id))) {
            errorService.throwError(
                EErrorTypes.UNAUTHORIZED,
                "Unauthorized request user id"
            );
        }

        chat.messages.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );

        const skip = +options?.skip || 0;
        const limit = Math.min(
            +options?.limit ? Math.min(+options?.limit, 20) : 20,
            chat.messages.length
        );
        const limitIndex = limit + skip;

        for (let i = skip; i < limitIndex; i++) {
            if (
                !requestUserId.equals(chat.messages[i].meta.from) &&
                !chat.messages[i].meta.readBy.some((id) =>
                    requestUserId.equals(id)
                )
            ) {
                chat.messages[i].meta.readBy.push(requestUserId);
            }
        }

        await chat.save();

        const messages = chat.messages.slice(skip, limit + 1);

        // const messages = await this.Chat.aggregate([
        //     { $match: { _id: chatId } },
        //     {
        //         $unwind: "$messages",
        //     },
        //     { $sort: { "messages.createdAt": -1 } },
        //     { $skip: skip },
        //     { $limit: limit },
        // ])

        messages.forEach(function (message) {
            if (message.isDeleted) {
                message.text = "This message was deleted";
            }
        });

        return messages;
    }

    async createMessage({
        text,
        chatId,
        requestUserId,
    }: {
        text: string;
        chatId: Types.ObjectId;
        requestUserId: Types.ObjectId;
    }): Promise<IChat> {
        let chat = await this.Chat.findById(chatId);
        chat.messages.unshift({
            text,
            meta: { from: requestUserId, readBy: [] },
            isDeleted: false,
        });

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
            { $set: { "messages.$.text": text } },
            { new: true }
        );

        return chat;
    }

    async setMessageDeletion({
        chatId,
        messageId,
        requestUserId,
        isDeleted,
    }: {
        chatId: Types.ObjectId;
        messageId: Types.ObjectId;
        requestUserId: Types.ObjectId;
        isDeleted: boolean;
    }): Promise<IChat> {
        console.log(requestUserId);
        const chat = await this.findChatById(chatId);
        const messageIndex = chat.messages.findIndex((message) =>
            messageId.equals(message._id)
        );
        const message = chat.messages[messageIndex];
        if (!requestUserId.equals(message.meta.from))
            errorService.throwError(
                EErrorTypes.FORBIDDEN,
                "You cannot delete/restore others' messages"
            );
        message.isDeleted = isDeleted;
        return await chat.save();
    }
}
