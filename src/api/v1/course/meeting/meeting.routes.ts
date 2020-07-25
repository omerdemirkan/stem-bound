import { Router } from "express";
import { authMiddlewareService } from "../../../../services";
import * as meetingControllers from "./meeting.controllers";
import { EUserRoles } from "../../../../types";

const meetingRouter = Router({ mergeParams: true });

meetingRouter.get(
    "/",
    authMiddlewareService.extractTokenPayload,
    meetingControllers.getMeetings
);

meetingRouter.get(
    "/:meetingId",
    authMiddlewareService.extractTokenPayload,
    meetingControllers.getMeeting
);

meetingRouter.post(
    "/",
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles([EUserRoles.INSTRUCTOR]),
    meetingControllers.createMeeting
);

meetingRouter.patch(
    "/:meetingId",
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles([EUserRoles.INSTRUCTOR]),
    meetingControllers.updateMeeting
);

meetingRouter.delete(
    "/:meetingId",
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles([EUserRoles.INSTRUCTOR]),
    meetingControllers.deleteMeeting
);

export default meetingRouter;
