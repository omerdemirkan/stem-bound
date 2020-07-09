import { Model, Types } from "mongoose";
import { IChat, IMessage } from "../types/chat.types";

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

    async createMessage(id: Types.ObjectId, message: any): Promise<IMessage> {
        let updatedChat = await this.Chats.findById(id);
        updatedChat.messages.push(message);
        await updatedChat.save();
        return updatedChat.messages[updatedChat.messages.length - 1];
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
        return updatedChat.messages.find(
            (message: IMessage) =>
                message._id.toHexString() === messageId.toHexString()
        );
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
        return updatedChat.messages.find(
            (message: IMessage) =>
                message._id.toHexString() === messageId.toHexString()
        );
    }
}
