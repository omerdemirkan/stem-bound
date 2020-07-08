import { Router, Request, Response, NextFunction } from "express";
import messagesRoutes from "./messages/messages.routes";
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

chatRouter.use(
    "/:chatId/messages",
    function (req: Request, res: Response, next: NextFunction) {
        // Issue: nested routes don't have access to the chatId param.
        // This middleware is to give access to this param to nested routes.
        (req as any).chatId = req.params.chatId;
        next();
    },
    messagesRoutes
);

export default chatRouter;
