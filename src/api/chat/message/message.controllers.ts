import { Types } from "mongoose";
import { Request, Response } from "express";
import { chatService, errorService } from "../../../services";

const { ObjectId } = Types;

export async function getChatMessagesByChatId(req: Request, res: Response) {
    try {
        const chatId = ObjectId(req.params.chatId);
        const chat: any = await chatService.findChatById(chatId);
        res.json({
            message: "Chat successfully fetched",
            data: chat.messages,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function createChatMessageById(req: Request, res: Response) {
    try {
        const chatId = ObjectId(req.params.chatId);

        const newChat: any = await chatService.createMessage(chatId, req.body);
        res.json({
            message: "Chat message successfully created",
            data: newChat.messages,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function getChatMessageByIds(req: Request, res: Response) {
    try {
        const chatId = ObjectId(req.params.chatId);
        const messageId = ObjectId(req.params.messageId);
        const chat: any = await chatService.findChatById(chatId);

        if (!chat) {
            throw new Error("Chat not found");
        }

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
        res.status(errorService.status(e)).json(errorService.json(e));
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
        res.status(errorService.status(e)).json(errorService.json(e));
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
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}
