import { Router } from "express";
import * as messagesControllers from "./messages.controllers";
import { authMiddlewareService } from "../../../services";

const messagesRouter = Router();

messagesRouter.get(
    "/",
    authMiddlewareService.extractTokenPayload,
    messagesControllers.getChatMessagesByChatId
);

messagesRouter.get(
    "/:messageId",
    authMiddlewareService.extractTokenPayload,
    messagesControllers.getChatMessageByIds
);

messagesRouter.post(
    "/",
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.compareRequestBodyToPayload(
        ({ body, payload }) => body.meta.from === payload.user._id
    ),
    messagesControllers.createChatMessageById
);

messagesRouter.patch(
    "/:messageId",
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.blockRequestBodyMetadata,
    messagesControllers.updateChatMessageByIds
);

messagesRouter.delete(
    "/:messageId",
    authMiddlewareService.extractTokenPayload,
    messagesControllers.deleteChatMessageByIds
);

export default messagesRouter;
