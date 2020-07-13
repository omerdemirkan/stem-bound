import { Types } from "mongoose";
import { Request, Response } from "express";
import { chatService, errorService } from "../../../../services";
import { EErrorTypes } from "../../../../types/error.types";
import { IChat, IMessage } from "../../../../types/chat.types";

const { ObjectId } = Types;

export async function getChatMessages(req: Request, res: Response) {
    try {
        const chatId = ObjectId(req.params.chatId);
        const chat: IChat = await chatService.findChatById(chatId);
        res.json({
            message: "Chat successfully fetched",
            data: chat.messages,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function createChatMessage(req: Request, res: Response) {
    try {
        const chatId = ObjectId(req.params.chatId);
        const updatedMessage: IMessage = await chatService.createMessage(
            chatId,
            req.body
        );
        res.json({
            message: "Chat message successfully created",
            data: updatedMessage,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function getChatMessage(req: Request, res: Response) {
    try {
        const chatId = ObjectId(req.params.chatId);
        const messageId = ObjectId(req.params.messageId);
        const chat: IChat = await chatService.findChatById(chatId);

        if (!chat) {
            errorService.throwError(EErrorTypes.DOCUMENT_NOT_FOUND);
        }

        const message = chat.messages.find(
            (message) => message._id.toString() === messageId.toString()
        );

        if (!message) {
            errorService.throwError(EErrorTypes.DOCUMENT_NOT_FOUND);
        }

        res.json({
            message: "Message successfully fetched",
            data: message,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function updateChatMessage(req: Request, res: Response) {
    try {
        const updatedMessage: IMessage = await chatService.updateMessage({
            chatId: ObjectId(req.params.chatId),
            messageId: ObjectId(req.params.messageId),
            text: req.body.text,
        });
        res.json({
            message: "Message successfully updated",
            data: updatedMessage,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function deleteChatMessage(req: Request, res: Response) {
    try {
        const deletedMessage: IMessage = await chatService.deleteMessage({
            chatId: ObjectId(req.params.chatId),
            messageId: ObjectId(req.params.messageId),
        });

        res.json({
            message: "Message successfully deleted",
            data: deletedMessage,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}
