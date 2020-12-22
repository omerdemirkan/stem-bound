import { Types } from "mongoose";
import { Request, Response } from "express";
import { chatService, errorService } from "../../../../services";
import { IChat, IMessage, EErrorTypes } from "../../../../types";
import {
    configureMessageArrayQuery,
    configureMessageArrayResponseData,
} from "../../../../helpers/chat.helpers";

const { ObjectId } = Types;

export async function getChatMessages(req: Request, res: Response) {
    try {
        const chatId = ObjectId(req.params.chatId);
        const query = configureMessageArrayQuery(req.query);
        const messages: IMessage[] = await chatService.findMessagesByChatId(
            chatId,
            query
        );
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
        const requestingUserId = ObjectId((req as any).payload.user._id);
        const chatId = ObjectId(req.params.chatId);
        let messageData: Partial<IMessage> = req.body;
        const message = await chatService.createMessage(messageData, chatId);
        res.json({
            message: "Chat message successfully created",
            data: message,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function getChatMessage(req: Request, res: Response) {
    try {
        const requestingUserId = ObjectId((req as any).payload.user._id);
        const chatId = ObjectId(req.params.chatId);
        const messageId = ObjectId(req.params.messageId);
        const message = await chatService.findMessageById(messageId);

        if (message.meta.chat !== chatId) {
            errorService.throwError(
                EErrorTypes.DOCUMENT_NOT_FOUND,
                "Chat not found"
            );
        } else if (
            !(
                await chatService.findChatById(message.meta.chat)
            ).meta.users.includes(requestingUserId)
        ) {
            errorService.throwError(EErrorTypes.FORBIDDEN, "Not Authorized");
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
        const messageData: Partial<IMessage> = req.body;
        const message = await chatService.updateMessageById(
            messageData,
            ObjectId(req.params.messageId)
        );
        res.json({
            message: "Message successfully updated",
            data: message,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function deleteChatMessage(req: Request, res: Response) {
    try {
        const message = await chatService.setMessageDeletionById(
            true,
            ObjectId(req.params.messageId)
        );

        res.json({
            message: "Message successfully deleted",
            data: message,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}
