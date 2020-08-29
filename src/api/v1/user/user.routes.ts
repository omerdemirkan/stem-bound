import { Router } from "express";
import * as userControllers from "./user.controllers";
import { authMiddlewareService } from "../../../services";
import { EUserRoles } from "../../../types";

const userRouter = Router();

userRouter.get("/", userControllers.getUsers);

userRouter.get("/:id", userControllers.getUser);

userRouter.get(
    "/:id/courses",
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles([
        EUserRoles.INSTRUCTOR,
        EUserRoles.STUDENT,
    ]),
    authMiddlewareService.matchParamIdToPayloadUserId,
    userControllers.getUserCourses
);

userRouter.get(
    "/:id/school",
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles([
        EUserRoles.SCHOOL_OFFICIAL,
        EUserRoles.STUDENT,
    ]),
    authMiddlewareService.matchParamIdToPayloadUserId,
    userControllers.getUserSchool
);

userRouter.get(
    "/:id/chats",
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.matchParamIdToPayloadUserId,
    userControllers.getUserChats
);

userRouter.patch(
    "/:id",
    authMiddlewareService.blockRequestBodyMetadata,
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.matchParamIdToPayloadUserId,
    userControllers.updateUser
);

userRouter.delete(
    "/:id",
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.matchParamIdToPayloadUserId,
    userControllers.deleteUser
);

userRouter.post(
    "/:id/profile-picture",
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.matchParamIdToPayloadUserId,
    userControllers.saveUserProfilePicture
);

export default userRouter;
