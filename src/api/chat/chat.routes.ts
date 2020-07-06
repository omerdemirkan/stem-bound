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
    chatControllers.getChatMessagesById
);

chatRouter.post(
    "/",
    authMiddlewareService.extractTokenPayload,
    chatControllers.createChat
);

export default chatRouter;
