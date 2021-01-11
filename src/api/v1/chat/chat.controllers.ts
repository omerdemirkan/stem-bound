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

        const userId = ObjectId(req.payload.user._id);

        chatData.meta.users = chatData.meta.users.map((id) =>
            ObjectId(id as any)
        );

        if (chatData.meta.users.findIndex((id) => id.equals(userId)) === -1)
            chatData.meta.users.push(userId);

        chatData.meta.createdBy = userId;

        if (chatData.type === EChatTypes.PRIVATE) {
            duplicateChat = await chatService.findPrivateChatByUserIds(
                chatData.meta.users
            );
        }

        let newChat: IChat =
            duplicateChat || (await chatService.createChat(chatData));

        let promises: Promise<any>[] = [];

        promises.push(configureChatResponseData(newChat, req.meta));

        if (!duplicateChat)
            promises.push(metadataService.handleNewChatMetadataUpdate(newChat));

        // memory safety accross threads shouldnt be an issue
        // since we call the toObject function in configuration

        const [chat] = await Promise.all(promises);
        res.json({
            message: duplicateChat
                ? "Duplicate chat found"
                : "Chat successfully created",
            data: chat,
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
        res.json({
            message: "Chat successfully fetched",
            data: await configureChatResponseData(chat, req.meta),
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
        res.json({
            data: await configureChatArrayResponseData(chats, req.meta),
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
        res.json({
            data: await configureChatResponseData(updatedChat, req.meta),
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

        // memory safety accross threads shouldnt be an issue
        const [chat] = await Promise.all([
            configureChatResponseData(deletedChat, req),
            metadataService.handleDeletedChatMetadataUpdate(deletedChat),
        ]);
        res.json({
            message: "Chat successfully deleted",
            data: chat,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}
