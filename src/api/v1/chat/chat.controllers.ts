import { Request, Response } from "express";
import { errorService, chatService, metadataService } from "../../../services";
import { Types } from "mongoose";
import { IChat, EErrorTypes } from "../../../types";
import { configureChatResponseData } from "../../../helpers/chat.helpers";

const { ObjectId } = Types;

export async function createChat(req: Request, res: Response) {
    try {
        const chatData: IChat = req.body;
        chatData.meta.users = chatData.meta.users.map((id) =>
            ObjectId(id as any)
        );
        const duplicateChat = await chatService.findChatByUserIds(
            chatData.meta.users,
            { exact: true }
        );

        if (duplicateChat && req.query.duplicate_fallback) {
            return res.json({
                message: "Duplicate chat found",
                data: configureChatResponseData(duplicateChat, {
                    query: req.query,
                }),
            });
        } else if (duplicateChat && !req.query.duplicate_fallback) {
            errorService.throwError(
                EErrorTypes.CONFLICT,
                "Invalid chat: Duplication"
            );
        }

        const newChat: IChat = await chatService.createChat(chatData);
        await metadataService.handleNewChatMetadataUpdate(newChat);
        res.json({
            message: "Chat successfully created",
            data: configureChatResponseData(newChat, { query: req.query }),
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function getChat(req: Request, res: Response) {
    try {
        const requestingUserId = ObjectId((req as any).payload.user._id);
        const id = ObjectId(req.params.id);
        const chat: IChat = await chatService.findChatById(id);
        if (!chat) {
            errorService.throwError(
                EErrorTypes.DOCUMENT_NOT_FOUND,
                "Chat not found"
            );
        } else if (!chat.meta.users.some((id) => requestingUserId.equals(id))) {
            res.status(403);
        }
        res.json({
            message: "Chat successfully fetched",
            data: configureChatResponseData(chat, { query: req.query }),
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function updateChat(req: Request, res: Response) {
    try {
        const id = ObjectId(req.params.id);
        const updatedChat: IChat = await chatService.updateChatById(
            id,
            req.body
        );

        res.json({
            message: "Chat successfully updated",
            data: configureChatResponseData(updatedChat, { query: req.query }),
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function deleteChat(req: Request, res: Response) {
    try {
        const deletedChat: IChat = await chatService.deleteChatById(
            ObjectId(req.params.id)
        );

        await metadataService.handleDeletedChatMetadataUpdate(deletedChat);
        res.json({
            message: "Chat successfully deleted",
            data: configureChatResponseData(deletedChat, { query: req.query }),
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}
