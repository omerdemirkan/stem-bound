import { Router } from "express";
import * as userControllers from "./user.controllers";
import { authMiddlewareService } from "../../services";

const userRouter = Router();

userRouter.get("/", userControllers.getUsers);

userRouter.get("/:id", userControllers.getUserById);

userRouter.patch(
    "/:id",
    authMiddlewareService.blockRequestBodyMetadata,
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.matchParamIdToPayloadUserId,
    userControllers.updateUserById
);

userRouter.delete(
    "/id",
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.matchParamIdToPayloadUserId,
    userControllers.deleteUserById
);

export default userRouter;
