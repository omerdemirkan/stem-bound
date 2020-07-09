import { Router } from "express";
import { authMiddlewareService } from "../../../services";
import * as meetingControllers from "./meeting.controllers";

const meetingRouter = Router({ mergeParams: true });

meetingRouter.get(
    "/",
    authMiddlewareService.extractTokenPayload,
    meetingControllers.getMeetingsByCourseId
);

meetingRouter.get(
    "/:meetingId",
    authMiddlewareService.extractTokenPayload,
    meetingControllers.getMeetingByIds
);

meetingRouter.post(
    "/",
    authMiddlewareService.extractTokenPayload,
    meetingControllers.createMeetingByCourseId
);

export default meetingRouter;
