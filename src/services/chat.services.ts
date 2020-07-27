import { Model, Types } from "mongoose";
import { IChat, IMessage } from "../types/chat.types";
import { EventEmitter } from "events";
import { EChatEvents } from "../types";

export default class ChatService {
    constructor(
        private Chats: Model<IChat>,
        private eventEmitter: EventEmitter
    ) {}

    async createChat(chatData: IChat): Promise<IChat> {
        const chatUsers: any = chatData.meta.users;
        const duplicateChat: any = await this.Chats.findOne()
            .all("meta.users", chatUsers)
            .size("meta.users", chatUsers.length);
        if (duplicateChat) {
            throw new Error("This chat is a duplicate of another chat.");
        }
        return await this.Chats.create(chatData);
    }

    async findChats(where: object): Promise<IChat[]> {
        return this.Chats.find(where);
    }

    async findChatsByIds(ids: Types.ObjectId[]): Promise<IChat[]> {
        return this.Chats.find({ _id: { $in: ids } });
    }

    async findChat(where: object): Promise<IChat> {
        return await this.Chats.findOne(where);
    }

    async findChatById(id: Types.ObjectId): Promise<IChat> {
        return await this.Chats.findById(id);
    }

    async updateChat(where: object, chatData: Partial<IChat>): Promise<IChat> {
        return await this.Chats.findOneAndUpdate(where, chatData, {
            new: true,
        });
    }

    async updateChatById(
        id: Types.ObjectId,
        chatData: Partial<IChat>
    ): Promise<IChat> {
        return await this.Chats.findByIdAndUpdate(id, chatData, { new: true });
    }

    async deleteChat(where: object): Promise<IChat> {
        return await this.Chats.findOneAndDelete(where);
    }

    async deleteChatById(id: Types.ObjectId): Promise<IChat> {
        return await this.Chats.findByIdAndDelete(id);
    }

    async createMessage({
        chatId,
        text,
        senderId,
    }: {
        chatId: Types.ObjectId;
        text: string;
        senderId: Types.ObjectId;
    }): Promise<IMessage> {
        let updatedChat = await this.Chats.findById(chatId);
        updatedChat.messages.unshift({
            text,
            meta: { from: senderId, readBy: [] },
        });
        await updatedChat.save();
        const message = updatedChat.messages[0];

        this.eventEmitter.emit(EChatEvents.CHAT_MESSAGE_CREATED, {
            chatId,
            message,
        });

        return message;
    }

    async updateMessage({
        chatId,
        messageId,
        text,
    }: {
        chatId: Types.ObjectId;
        messageId: Types.ObjectId;
        text;
    }): Promise<IMessage> {
        const updatedChat = await this.Chats.findOneAndUpdate(
            { _id: chatId, "messages._id": messageId },
            { $set: { "messages.$.text": text } },
            { new: true }
        );
        const message = updatedChat.messages.find(
            (message: IMessage) =>
                message._id.toHexString() === messageId.toHexString()
        );

        this.eventEmitter.emit(EChatEvents.CHAT_MESSAGE_UPDATED, {
            chatId,
            message,
        });

        return message;
    }

    async deleteMessage({
        chatId,
        messageId,
    }: {
        chatId: Types.ObjectId;
        messageId: Types.ObjectId;
    }): Promise<IMessage> {
        const updatedChat = await this.Chats.findByIdAndUpdate(
            chatId,
            {
                $pull: { messages: { _id: messageId } },
            },
            { new: false }
        );
        const message = updatedChat.messages.find(
            (message: IMessage) =>
                message._id.toHexString() === messageId.toHexString()
        );

        this.eventEmitter.emit(EChatEvents.CHAT_MESSAGE_DELETED, {
            chatId,
            message,
        });

        return message;
    }
}
