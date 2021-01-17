import { Router } from "express";
import * as courseControllers from "./course.controllers";
import { EUserRoles } from "../../../types";
import { authMiddlewareService } from "../../../services";
import meetingRouter from "./meeting/meeting.routes";
import announcementsRouter from "./announcement/announcement.routes";

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
    authMiddlewareService.allowedRoles([EUserRoles.INSTRUCTOR]),
    authMiddlewareService.validateRequest(({ body, payload }) =>
        body.meta.instructors?.includes(payload.user._id)
    ),
    courseControllers.createCourse
);

courseRouter.patch(
    "/:id",
    authMiddlewareService.blockRequestBodyMetadata,
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles([EUserRoles.INSTRUCTOR]),
    courseControllers.updateCourse
);

courseRouter.delete(
    "/:id",
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles([EUserRoles.INSTRUCTOR]),
    courseControllers.deleteCourse
);

courseRouter.patch(
    "/:id/verification-status",
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles([
        EUserRoles.SCHOOL_OFFICIAL,
        EUserRoles.INSTRUCTOR,
    ]),
    courseControllers.updateCourseVerification
);

courseRouter.use("/:courseId/meetings", meetingRouter);
courseRouter.use("/:courseId/announcements", announcementsRouter);

export default courseRouter;
