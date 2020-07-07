import { Model, Document, Types } from "mongoose";

export default class ChatService {
    constructor(private Chats: Model<Document>) {}

    async createChat(chatData: any) {
        const chatUsers: any = chatData.meta.users;
        const duplicateChat: any = await this.Chats.findOne()
            .all("meta.users", chatUsers)
            .size("meta.users", chatUsers.length);
        if (duplicateChat) {
            throw new Error("This chat is a duplicate of another chat.");
        }
        return await this.Chats.create(chatData);
    }

    async findChats(where: object) {
        return this.Chats.find(where);
    }

    async findChatsByIds(ids: Types.ObjectId[]) {
        return this.Chats.find({ _id: { $in: ids } });
    }

    async findChat(where: object) {
        return await this.Chats.find(where);
    }

    async findChatById(id: Types.ObjectId) {
        return await this.Chats.findById(id);
    }

    async updateChat(where: object, chatData: any) {
        return await this.Chats.findOneAndUpdate(where, chatData, {
            new: true,
        });
    }

    async updateChatById(id: Types.ObjectId, chatData: any) {
        return await this.Chats.findByIdAndUpdate(id, chatData, { new: true });
    }

    async deleteChat(where: object) {
        return await this.Chats.findOneAndDelete(where);
    }

    async deleteChatById(id: Types.ObjectId) {
        return await this.Chats.findByIdAndDelete(id);
    }

    async createMessage(id: Types.ObjectId, message: any) {
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
    }) {
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
    }) {
        return await this.Chats.findByIdAndUpdate(
            chatId,
            {
                $pull: { messages: { _id: messageId } },
            },
            { new: true }
        );
    }
}
