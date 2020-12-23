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
    configureChatResponseData,
} from "../../../helpers/chat.helpers";

const { ObjectId } = Types;

export async function createChat(req: IModifiedRequest, res: Response) {
    try {
        let chatData: Partial<IChat> = req.body,
            duplicateChat: IChat;
        chatData.meta.users = chatData.meta.users.map((id) =>
            ObjectId(id as any)
        );

        if (chatData.type === EChatTypes.PRIVATE) {
            duplicateChat = await chatService.findPrivateChatByUserIds(
                chatData.meta.users
            );
        }

        let newChat: IChat =
            duplicateChat || (await chatService.createChat(chatData));

        let promises: Promise<any>[] = [];

        if (!duplicateChat)
            promises.push(metadataService.handleNewChatMetadataUpdate(newChat));

        promises.push(configureChatResponseData(newChat, req.meta));

        // memory safety accross threads shouldnt be an issue
        await Promise.all(promises);
        res.json({
            message: duplicateChat
                ? "Duplicate chat found"
                : "Chat successfully created",
            data: newChat,
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
        if (!chat) {
            errorService.throwError(
                EErrorTypes.DOCUMENT_NOT_FOUND,
                "Chat not found"
            );
        }
        await configureChatResponseData(chat, req.meta);
        res.json({
            message: "Chat successfully fetched",
            data: chat,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function getChats(req: IModifiedRequest, res: Response) {
    try {
        const userId = ObjectId(req.payload.user._id);
        const query = configureChatArrayQuery(req.meta);
        let chats = await chatService.findChatsByUserId(userId, query);
        await configureChatArrayResponseData(chats, req.meta);
        res.json({
            data: chats,
            message: "User chats successfully found",
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
        await configureChatResponseData(updatedChat, req.meta);
        res.json({
            message: "Chat successfully updated",
            data: updatedChat,
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

        // memory safety accross threads shouldnt be an issue
        await Promise.all([
            metadataService.handleDeletedChatMetadataUpdate(deletedChat),
            configureChatResponseData(deletedChat, req),
        ]);
        res.json({
            message: "Chat successfully deleted",
            data: deletedChat,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}
