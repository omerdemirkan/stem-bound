import { Router } from "express";
import { authMiddlewareService } from "../../../../services";
import * as meetingControllers from "./meeting.controllers";

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
    meetingControllers.createMeeting
);

meetingRouter.patch(
    "/:meetingId",
    authMiddlewareService.extractTokenPayload,
    meetingControllers.updateMeeting
);

meetingRouter.delete(
    "/:meetingId",
    authMiddlewareService.extractTokenPayload,
    meetingControllers.deleteMeeting
);

export default meetingRouter;
