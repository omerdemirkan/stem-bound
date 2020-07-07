import { Router } from "express";
import * as chatControllers from "./chat.controllers";
import { authMiddlewareService } from "../../services";

const chatRouter = Router();

chatRouter.get(
    "/:id",
    authMiddlewareService.extractTokenPayload,
    chatControllers.getChatById
);

chatRouter.get(
    "/:id/messages",
    authMiddlewareService.extractTokenPayload,
    chatControllers.getChatMessagesByChatId
);

chatRouter.get(
    "/:chatId/messages/messageId",
    authMiddlewareService.extractTokenPayload,
    chatControllers.getChatMessageByIds
);

chatRouter.post(
    "/",
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.compareRequestBodyToPayload(({ body, payload }) =>
        body.meta.users.includes(payload.user._id)
    ),
    chatControllers.createChat
);

chatRouter.post(
    "/:id/messages",
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.compareRequestBodyToPayload(
        ({ body, payload }) => body.meta.from === payload.user._id
    ),
    chatControllers.createChatMessageByChatId
);

chatRouter.patch(
    "/:id",
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.blockRequestBodyMetadata,
    chatControllers.updateChatById
);

chatRouter.patch(
    "/:chatId/messages/:messageId",
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.blockRequestBodyMetadata,
    chatControllers.updateChatMessageByIds
);

chatRouter.delete(
    "/:id",
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles(["ADMIN"]),
    chatControllers.deleteChatById
);

chatRouter.delete(
    "/:chatId/messages/:messageId",
    authMiddlewareService.extractTokenPayload,
    chatControllers.deleteChatMessageByIds
);

export default chatRouter;
