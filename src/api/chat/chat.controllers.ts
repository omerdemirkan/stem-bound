import { Request, Response } from "express";
import { errorParser, chatService, metadataService } from "../../services";
import { Types } from "mongoose";

const { ObjectId } = Types;

export async function createChat(req: Request, res: Response) {
    try {
        const chatData = req.body;
        const newChat: any = await chatService.createChat(chatData);
        await metadataService.handleNewChatMetadataUpdate(newChat);
        res.json({
            message: "Chat successfully created",
            data: newChat,
        });
    } catch (e) {
        res.status(errorParser.status(e)).json(errorParser.json(e));
    }
}

export async function getChatById(req: Request, res: Response) {
    try {
        const id = ObjectId(req.params.id);
        const chat: any = await chatService.findChatById(id);
        if (!chat.meta.users.includes((req as any).payload.user._id)) {
            res.status(403);
        }
        res.json({
            message: "Chat successfully fetched",
            data: chat,
        });
    } catch (e) {
        res.status(errorParser.status(e)).json(errorParser.json(e));
    }
}

export async function getChatMessagesByChatId(req: Request, res: Response) {
    try {
        const id = ObjectId(req.params.id);
        const chat: any = await chatService.findChatById(id);
        res.json({
            message: "Chat successfully fetched",
            data: chat.messages,
        });
    } catch (e) {
        res.status(errorParser.status(e)).json(errorParser.json(e));
    }
}

export async function getChatMessageByIds(req: Request, res: Response) {
    try {
        const chatId = ObjectId(req.params.chatId);
        const messageId = ObjectId(req.params.messageId);
        const chat: any = await chatService.findChatById(chatId);
        const message = chat.messages.find(
            (message) => message._id.toString() === messageId.toString()
        );

        if (!message) {
            throw new Error("Message not found");
        }

        res.json({
            message: "Message successfully fetched",
            data: message,
        });
    } catch (e) {
        res.status(errorParser.status(e)).json(errorParser.json(e));
    }
}

export async function createChatMessageById(req: Request, res: Response) {
    try {
        const id = ObjectId(req.params.id);

        const newChat: any = await chatService.createMessage(id, req.body);
        res.json({
            message: "Chat message successfully created",
            data: newChat.messages,
        });
    } catch (e) {
        res.status(errorParser.status(e)).json(errorParser.json(e));
    }
}

export async function updateChatById(req: Request, res: Response) {
    try {
        const id = ObjectId(req.params.id);
        const newChat = await chatService.updateChatById(id, req.body);

        res.json({
            message: "Chat successfully updated",
            data: newChat,
        });
    } catch (e) {
        res.status(errorParser.status(e)).json(errorParser.json(e));
    }
}

export async function updateChatMessageByIds(req: Request, res: Response) {
    try {
        const result = await chatService.updateMessage({
            chatId: ObjectId(req.params.chatId),
            messageId: ObjectId(req.params.messageId),
            text: req.body.text,
        });
        res.json({
            message: "Message successfully updated",
            data: result,
        });
    } catch (e) {
        res.status(errorParser.status(e)).json(errorParser.json(e));
    }
}

export async function deleteChatById(req: Request, res: Response) {
    try {
        const deletedChat = await chatService.deleteChatById(
            ObjectId(req.params.id)
        );

        await metadataService.handleDeletedChatMetadataUpdate(deletedChat);
        res.json({
            message: "Chat successfully deleted",
            data: deletedChat,
        });
    } catch (e) {
        res.status(errorParser.status(e)).json(errorParser.json(e));
    }
}

export async function deleteChatMessageByIds(req: Request, res: Response) {
    try {
        const updatedChat: any = await chatService.deleteMessage({
            chatId: ObjectId(req.params.chatId),
            messageId: ObjectId(req.params.messageId),
        });

        res.json({
            message: "Message successfully deleted",
            data: updatedChat,
        });
    } catch (e) {
        res.status(errorParser.status(e)).json(errorParser.json(e));
    }
}
