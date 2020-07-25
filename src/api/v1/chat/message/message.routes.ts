import { Router } from "express";
import * as messagesControllers from "./message.controllers";
import { authMiddlewareService } from "../../../../services";

// https://expressjs.com/en/4x/api.html#express.router
const messageRouter = Router({ mergeParams: true });

messageRouter.get(
    "/",
    authMiddlewareService.extractTokenPayload,
    messagesControllers.getChatMessages
);

messageRouter.get(
    "/:messageId",
    authMiddlewareService.extractTokenPayload,
    messagesControllers.getChatMessage
);

messageRouter.post(
    "/",
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.validateRequest(
        ({ body }) => !(body.meta || body.createdAt || body.updatedAt)
    ),
    messagesControllers.createChatMessage
);

messageRouter.patch(
    "/:messageId",
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.validateRequest(
        ({ body }) => !(body.meta || body.createdAt || body.updatedAt)
    ),
    messagesControllers.updateChatMessage
);

messageRouter.delete(
    "/:messageId",
    authMiddlewareService.extractTokenPayload,
    messagesControllers.deleteChatMessage
);

export default messageRouter;
