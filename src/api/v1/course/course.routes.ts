import { Router } from "express";
import * as courseControllers from "./course.controllers";
import { EUserRoles } from "../../../types";
import { authMiddlewareService } from "../../../services";
import meetingRouter from "./meeting/meeting.routes";

const courseRouter = Router();

courseRouter.get("/", courseControllers.getCourses);

courseRouter.get("/:id", courseControllers.getCourse);

courseRouter.get("/:id/instructors", courseControllers.getCourseInstructors);

courseRouter.get("/:id/students", courseControllers.getCourseStudents);

courseRouter.get("/:id/school", courseControllers.getCourseSchool);

courseRouter.post(
    "/:id/enroll",
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles([EUserRoles.STUDENT]),
    courseControllers.enrollInCourse
);

courseRouter.post(
    "/:id/drop",
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles([EUserRoles.STUDENT]),
    courseControllers.dropCourse
);

courseRouter.post(
    "/",
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles([EUserRoles.INSTRUCTOR, "ADMIN"]),
    authMiddlewareService.compareRequestBodyToPayload(({ body, payload }) =>
        body.meta.instructors?.includes(payload.user._id)
    ),
    courseControllers.createCourse
);

courseRouter.patch(
    "/:id",
    authMiddlewareService.blockRequestBodyMetadata,
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles([EUserRoles.INSTRUCTOR, "ADMIN"]),
    courseControllers.updateCourse
);

courseRouter.delete(
    "/:id",
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles([EUserRoles.INSTRUCTOR, "ADMIN"]),
    courseControllers.deleteCourse
);

courseRouter.use("/:courseId/meetings", meetingRouter);

export default courseRouter;
