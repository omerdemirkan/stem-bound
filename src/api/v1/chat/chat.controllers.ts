import { Request, Response } from "express";
import {
    errorService,
    chatService,
    metadataService,
    userService,
} from "../../../services";
import { Types } from "mongoose";
import {
    IChat,
    EErrorTypes,
    EChatTypes,
    IModifiedRequest,
} from "../../../types";
import {
    configureChatArrayQuery,
    configureChatResponseData,
} from "../../../helpers/chat.helpers";

const { ObjectId } = Types;

export async function createChat(req: IModifiedRequest, res: Response) {
    try {
        let chatData: Partial<IChat> = req.body,
            duplicateChat: IChat,
            chat: IChat;
        chatData.meta.users = chatData.meta.users.map((id) =>
            ObjectId(id as any)
        );

        if (chatData.type === EChatTypes.PRIVATE) {
            duplicateChat = await chatService.findPrivateChatByUserIds(
                chatData.meta.users
            );
        }

        const newChat: IChat =
            duplicateChat || (await chatService.createChat(chatData));
        await metadataService.handleNewChatMetadataUpdate(newChat);
        res.json({
            message: "Chat successfully created",
            data: configureChatResponseData(newChat, req),
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function getChat(req: IModifiedRequest, res: Response) {
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
            errorService.throwError(
                EErrorTypes.FORBIDDEN,
                "You are not a member of this chat"
            );
        }
        res.json({
            message: "Chat successfully fetched",
            data: configureChatResponseData(chat, req),
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function getChats(req: IModifiedRequest, res: Response) {
    try {
        const userId = ObjectId((req as any).payload.user._id);
        const query = configureChatArrayQuery(req.query);
        let chats = await chatService.findChatsByUserId(userId, query);

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
        const id = ObjectId(req.params.id);
        const updatedChat: IChat = await chatService.updateChatById(
            id,
            req.body
        );

        res.json({
            message: "Chat successfully updated",
            data: configureChatResponseData(updatedChat, req),
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function deleteChat(req: IModifiedRequest, res: Response) {
    try {
        const deletedChat: IChat = await chatService.deleteChat({
            _id: ObjectId(req.params.id),
            "meta.users": ObjectId((req as any).payload.user._id),
        });

        await metadataService.handleDeletedChatMetadataUpdate(deletedChat);
        res.json({
            message: "Chat successfully deleted",
            data: configureChatResponseData(deletedChat, req),
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}
