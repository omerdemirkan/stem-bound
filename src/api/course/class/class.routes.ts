import { Router } from "express";
import { authMiddlewareService } from "../../../services";
import * as classControllers from "./class.controllers";

const classRouter = Router({ mergeParams: true });

classRouter.get(
    "/",
    authMiddlewareService.extractTokenPayload,
    classControllers.getClassesByCourseId
);

export default classRouter;
