import { Router } from "express";
import * as userControllers from "./user.controllers";
import { authMiddlewareService } from "../../services";
import { EUserRoles } from "../../types";

const userRouter = Router();

userRouter.get("/", userControllers.getUsers);

userRouter.get("/:id", userControllers.getUserById);

userRouter.get(
    "/:id/courses",
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles([
        EUserRoles.INSTRUCTOR,
        EUserRoles.STUDENT,
    ]),
    authMiddlewareService.matchParamIdToPayloadUserId,
    userControllers.getUserCoursesById
);

userRouter.get(
    "/:id/school",
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles([
        EUserRoles.SCHOOL_OFFICIAL,
        EUserRoles.STUDENT,
    ]),
    authMiddlewareService.matchParamIdToPayloadUserId,
    userControllers.getUserSchoolById
);

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
