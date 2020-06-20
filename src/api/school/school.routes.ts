import { Router } from "express";
import * as schoolController from "./school.controllers";
import { EUserRoles } from "../../types";
import { authMiddlewareService } from "../../services";

const schoolRouter = Router();

schoolRouter.get("/", schoolController.getSchools);

schoolRouter.get("/:id", schoolController.getSchoolById);

schoolRouter.get("/:id/students", schoolController.getSchoolStudentsById);

schoolRouter.get(
    "/:id/school-officials",
    schoolController.getSchoolOfficialsById
);

schoolRouter.get("/:id/courses", schoolController.getSchoolCoursesById);

schoolRouter.post(
    "/refresh-database",
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles([EUserRoles.ADMIN]),
    schoolController.refreshDatabase
);

export default schoolRouter;
