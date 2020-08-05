import { Types } from "mongoose";
import { Request, Response } from "express";
import { chatService, errorService } from "../../../../services";
import { IChat, IMessage, EErrorTypes } from "../../../../types";
import { configureMessageArrayResponseData } from "../../../../helpers/chat.helpers";

const { ObjectId } = Types;

export async function getChatMessages(req: Request, res: Response) {
    try {
        const chatId = ObjectId(req.params.chatId);
        const chat: IChat = await chatService.findChatById(chatId);
        if (!chat) {
            errorService.throwError(EErrorTypes.DOCUMENT_NOT_FOUND);
        }
        res.json({
            message: "Chat successfully fetched",
            data: configureMessageArrayResponseData(chat.messages, {
                query: req.query,
            }),
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function createChatMessage(req: Request, res: Response) {
    try {
        const chatId = ObjectId(req.params.chatId);
        const newMessage: IMessage = await chatService.createMessage({
            chatId,
            text: req.body.text,
            senderId: (req as any).payload.user._id,
        });
        res.json({
            message: "Chat message successfully created",
            data: newMessage,
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
        const updatedMessage: IMessage = await chatService.setMessageDeletion({
            chatId: ObjectId(req.params.chatId),
            messageId: ObjectId(req.params.messageId),
            isDeleted: req.query.restore ? false : true,
        });

        res.json({
            message: "Message successfully deleted",
            data: updatedMessage,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}
