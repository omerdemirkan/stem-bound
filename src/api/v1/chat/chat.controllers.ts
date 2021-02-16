import { Response } from "express";
import { errorService, chatService, metadataService } from "../../../services";
import { Types } from "mongoose";
import {
    IChat,
    EErrorTypes,
    EChatTypes,
    IModifiedRequest,
} from "../../../types";
import {
    configureChatArrayQuery,
    configureChatArrayResponseData,
    configureChatData,
    configureChatResponseData,
} from "../../../helpers";

const { ObjectId } = Types;

export async function createChat(req: IModifiedRequest, res: Response) {
    try {
        let chatData: Partial<IChat> = configureChatData(req.body, req.meta),
            duplicateChat: IChat;

        if (chatData.type === EChatTypes.PRIVATE)
            duplicateChat = await chatService.findPrivateChatByUserIds(
                chatData.meta.users
            );

        let newChat: IChat =
            duplicateChat || (await chatService.createChat(chatData));

        if (!duplicateChat)
            await metadataService.handleNewChatMetadataUpdate(newChat);
        res.json({
            message: duplicateChat
                ? "Duplicate chat found"
                : "Chat successfully created",
            data: configureChatResponseData(newChat, req.meta),
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function getChat(req: IModifiedRequest, res: Response) {
    try {
        let chat: IChat = await chatService.findChat({
            _id: ObjectId(req.params.id),
            "meta.users": ObjectId(req.payload.user._id),
        });
        if (!chat)
            errorService.throwError(
                EErrorTypes.DOCUMENT_NOT_FOUND,
                "Chat not found"
            );

        res.json({
            message: "Chat successfully fetched",
            data: configureChatResponseData(chat, req.meta),
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function getChats(req: IModifiedRequest, res: Response) {
    try {
        const userId = ObjectId(req.payload.user._id);
        const query = configureChatArrayQuery(req.meta);
        // For hasMore functionality
        query.limit += 1;
        let chats = await chatService.findChatsByUserId(userId, query);
        res.json({
            data: configureChatArrayResponseData(
                chats.slice(0, chats.length),
                req.meta
            ),
            message: "User chats successfully found",
            hasMore: chats.length === query.limit,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function updateChat(req: IModifiedRequest, res: Response) {
    try {
        const chatId = ObjectId(req.params.id),
            userId = ObjectId(req.payload.user._id);
        let updatedChat: IChat = await chatService.updateChat(
            { _id: chatId, "meta.users": userId },
            req.body
        );
        res.json({
            data: configureChatResponseData(updatedChat, req.meta),
            message: "Chat successfully updated",
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function deleteChat(req: IModifiedRequest, res: Response) {
    try {
        const deletedChat: IChat = await chatService.deleteChat({
            _id: ObjectId(req.params.id),
            "meta.users": ObjectId(req.payload.user._id),
        });

        await metadataService.handleDeletedChatMetadataUpdate(deletedChat);
        res.json({
            message: "Chat successfully deleted",
            data: configureChatResponseData(deletedChat, req.meta),
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}
