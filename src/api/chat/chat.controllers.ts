import { Request, Response } from "express";
import { errorService, chatService, metadataService } from "../../services";
import { Types } from "mongoose";
import { IChat } from "../../types/chat.types";
import { EErrorTypes } from "../../types/error.types";

const { ObjectId } = Types;

export async function createChat(req: Request, res: Response) {
    try {
        const chatData = req.body;
        const newChat: IChat = await chatService.createChat(chatData);
        await metadataService.handleNewChatMetadataUpdate(newChat);
        res.json({
            message: "Chat successfully created",
            data: newChat,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function getChat(req: Request, res: Response) {
    try {
        const id = ObjectId(req.params.id);
        const chat: IChat = await chatService.findChatById(id);
        if (!chat) {
            errorService.throwError(EErrorTypes.DOCUMENT_NOT_FOUND);
        } else if (!chat.meta.users.includes((req as any).payload.user._id)) {
            res.status(403);
        }
        res.json({
            message: "Chat successfully fetched",
            data: chat,
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
            data: updatedChat,
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
            data: deletedChat,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}
