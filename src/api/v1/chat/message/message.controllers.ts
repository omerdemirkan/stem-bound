import { Types } from "mongoose";
import { Request, Response } from "express";
import { chatService, errorService } from "../../../../services";
import { IChat, IMessage, EErrorTypes } from "../../../../types";
import { configureMessageArrayResponseData } from "../../../../helpers/chat.helpers";

const { ObjectId } = Types;

export async function getChatMessages(req: Request, res: Response) {
    try {
        const requestUserId = ObjectId((req as any).payload.user._id);
        const chatId = ObjectId(req.params.chatId);
        const messages: IMessage[] = await chatService.findMessages(chatId, {
            requestUserId,
        });
        res.json({
            message: "Chat successfully fetched",
            data: configureMessageArrayResponseData(messages, {
                query: req.query,
            }),
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function createChatMessage(req: Request, res: Response) {
    try {
        const senderId = ObjectId((req as any).payload.user._id);
        const chatId = ObjectId(req.params.chatId);
        const chat = await chatService.createMessage({
            chatId,
            senderId,
            text: req.body.text,
        });
        res.json({
            message: "Chat message successfully created",
            data: chat.messages[0],
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function getChatMessage(req: Request, res: Response) {
    try {
        const requestUserId = ObjectId((req as any).payload.user._id);
        const chatId = ObjectId(req.params.chatId);
        const messageId = ObjectId(req.params.messageId);
        const chat: IChat = await chatService.findChatById(chatId, {
            requestUserId,
        });

        if (!chat) {
            errorService.throwError(
                EErrorTypes.DOCUMENT_NOT_FOUND,
                "Chat not found"
            );
        }

        const message = chat.messages.find(
            (message) => message._id.toString() === messageId.toString()
        );

        if (!message) {
            errorService.throwError(
                EErrorTypes.DOCUMENT_NOT_FOUND,
                "Message not found"
            );
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
        const chat = await chatService.updateMessage({
            chatId: ObjectId(req.params.chatId),
            messageId: ObjectId(req.params.messageId),
            text: req.body.text,
        });
        res.json({
            message: "Message successfully updated",
            data: chat.messages.find((message) =>
                message._id.equals(req.params.messageId)
            ),
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function deleteChatMessage(req: Request, res: Response) {
    try {
        const chat = await chatService.setMessageDeletion({
            chatId: ObjectId(req.params.chatId),
            messageId: ObjectId(req.params.messageId),
            isDeleted: req.query.restore ? false : true,
        });

        res.json({
            message: "Message successfully deleted",
            data: chat.messages.find((message) =>
                message._id.equals(req.params.messageId)
            ),
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}
