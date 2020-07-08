import { Router } from "express";
import messagesRoutes from "./message/message.routes";
import * as chatControllers from "./chat.controllers";
import { authMiddlewareService } from "../../services";

const chatRouter = Router();

chatRouter.get(
    "/:id",
    authMiddlewareService.extractTokenPayload,
    chatControllers.getChatById
);

chatRouter.post(
    "/",
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.compareRequestBodyToPayload(({ body, payload }) =>
        body.meta.users.includes(payload.user._id)
    ),
    chatControllers.createChat
);

chatRouter.patch(
    "/:id",
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.blockRequestBodyMetadata,
    chatControllers.updateChatById
);

chatRouter.delete(
    "/:id",
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles(["ADMIN"]),
    chatControllers.deleteChatById
);

chatRouter.use("/:chatId/messages", messagesRoutes);

export default chatRouter;
