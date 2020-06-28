import { Router } from "express";
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
    chatControllers.createChat
);

export default chatRouter;
