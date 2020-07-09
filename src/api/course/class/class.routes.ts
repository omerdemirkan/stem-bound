import { Router } from "express";
import { authMiddlewareService } from "../../../services";
import * as classControllers from "./class.controllers";

const classRouter = Router({ mergeParams: true });

classRouter.get(
    "/",
    authMiddlewareService.extractTokenPayload,
    classControllers.getClassesByCourseId
);

classRouter.get(
    "/:classId",
    authMiddlewareService.extractTokenPayload,
    classControllers.getClassesByCourseId
);

classRouter.post(
    "/",
    authMiddlewareService.extractTokenPayload,
    classControllers.createClassByCourseId
);

export default classRouter;
