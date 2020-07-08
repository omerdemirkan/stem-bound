import { Router } from "express";
import * as messagesControllers from "./message.controllers";
import { authMiddlewareService } from "../../../services";

// https://expressjs.com/en/4x/api.html#express.router
const messageRouter = Router({ mergeParams: true });

messageRouter.get(
    "/",
    authMiddlewareService.extractTokenPayload,
    messagesControllers.getChatMessagesByChatId
);

messageRouter.get(
    "/:messageId",
    authMiddlewareService.extractTokenPayload,
    messagesControllers.getChatMessageByIds
);

messageRouter.post(
    "/",
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.compareRequestBodyToPayload(
        ({ body, payload }) => body.meta.from === payload.user._id
    ),
    messagesControllers.createChatMessageById
);

messageRouter.patch(
    "/:messageId",
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.blockRequestBodyMetadata,
    messagesControllers.updateChatMessageByIds
);

messageRouter.delete(
    "/:messageId",
    authMiddlewareService.extractTokenPayload,
    messagesControllers.deleteChatMessageByIds
);

export default messageRouter;
