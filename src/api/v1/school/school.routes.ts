import { Router } from "express";
import * as schoolController from "./school.controllers";
import { authMiddlewareService } from "../../../services";

const schoolRouter = Router();

schoolRouter.get("/", schoolController.getSchools);

schoolRouter.get("/:id", schoolController.getSchool);

schoolRouter.post(
    "/refresh-database",
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles(["ADMIN"]),
    schoolController.refreshDatabase
);

export default schoolRouter;
