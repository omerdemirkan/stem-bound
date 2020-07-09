import { Model, Document, Types } from "mongoose";
import { IChat } from "../types/chat.types";

export default class ChatService {
    constructor(private Chats: Model<IChat>) {}

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

    async createMessage(id: Types.ObjectId, message: any): Promise<IChat> {
        return await this.Chats.findByIdAndUpdate(
            id,
            {
                $push: {
                    messages: message,
                },
            },
            { new: true }
        );
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
        return await this.Chats.findOneAndUpdate(
            { _id: chatId, "messages._id": messageId },
            { $set: { "messages.$.text": text } },
            { new: true }
        );
    }

    async deleteMessage({
        chatId,
        messageId,
    }: {
        chatId: Types.ObjectId;
        messageId: Types.ObjectId;
    }): Promise<IChat> {
        return await this.Chats.findByIdAndUpdate(
            chatId,
            {
                $pull: { messages: { _id: messageId } },
            },
            { new: true }
        );
    }
}
