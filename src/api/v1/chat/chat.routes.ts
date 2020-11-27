import { Router } from "express";
import messagesRoutes from "./message/message.routes";
import * as chatControllers from "./chat.controllers";
import { authMiddlewareService } from "../../../services";

const chatRouter = Router();

chatRouter.get(
    "/",
    authMiddlewareService.extractTokenPayload,
    chatControllers.getChats
);

chatRouter.get(
    "/:id",
    authMiddlewareService.extractTokenPayload,
    chatControllers.getChat
);

chatRouter.post(
    "/",
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.validateRequest(({ body, payload }) =>
        body.meta.users.includes(payload.user._id)
    ),
    chatControllers.createChat
);

chatRouter.patch(
    "/:id",
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.blockRequestBodyMetadata,
    authMiddlewareService.validateRequest(({ body }) => !body.messages),
    chatControllers.updateChat
);

chatRouter.delete(
    "/:id",
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles(["ADMIN"]),
    chatControllers.deleteChat
);

chatRouter.use("/:chatId/messages", messagesRoutes);

export default chatRouter;
