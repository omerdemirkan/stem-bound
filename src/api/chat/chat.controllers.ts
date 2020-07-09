import { Request, Response } from "express";
import { errorService, chatService, metadataService } from "../../services";
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
        res.status(errorService.status(e)).json(errorService.json(e));
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
        res.status(errorService.status(e)).json(errorService.json(e));
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
        res.status(errorService.status(e)).json(errorService.json(e));
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
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}
