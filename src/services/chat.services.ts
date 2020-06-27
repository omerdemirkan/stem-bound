import { Model, Document, Types } from "mongoose";

export default class ChatService {
    constructor(private Chats: Model<Document>) {}

    async createChat(chatData: any) {
        return await this.Chats.create(chatData);
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
}
