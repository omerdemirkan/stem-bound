import { Model, Document, Types } from "mongoose";

export default class ChatService {
    constructor(private Chats: Model<Document>) {}

    async createChat(chatData: any) {
        const chatUsers: any = chatData.meta.users;
        console.log(chatUsers);
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
        return await this.Chats.findOneAndUpdate(where, chatData);
    }

    async updateChatById(id: Types.ObjectId, chatData: any) {
        return await this.Chats.findByIdAndUpdate(id, chatData);
    }

    async deleteChat(where: object) {
        return await this.Chats.findOneAndDelete(where);
    }

    async deleteChatById(id: Types.ObjectId) {
        return await this.Chats.findByIdAndDelete(id);
    }

    async createMessagesByChatId(id: Types.ObjectId, messages: any[]) {
        return await this.Chats.findByIdAndUpdate(id, {
            $push: {
                messages: {
                    $each: messages,
                    $sort: { createdAt: -1 },
                },
            },
        });
    }

    async updateMessage({
        chatId,
        messageId,
        updatedMessage,
    }: {
        chatId: Types.ObjectId;
        messageId: Types.ObjectId;
        updatedMessage: any;
    }) {
        return await this.Chats.findOneAndUpdate(
            { _id: chatId, "messages._id": messageId },
            { "messages.$": updatedMessage },
            { new: true }
        );
    }

    async deleteMessages({
        chatId,
        messageIds,
    }: {
        chatId: Types.ObjectId;
        messageIds: Types.ObjectId[];
    }) {
        return await this.Chats.findByIdAndUpdate(chatId, {
            $pullAll: { messages: messageIds },
        });
    }
}
