import { Router } from "express";
import { authMiddlewareService } from "../../../../services";
import { EUserRoles } from "../../../../types";
import * as invitationControllers from "./invitation.controllers";

const invitationRouter = Router({
    mergeParams: true,
});

invitationRouter.post(
    "/send-instructor-invitation",
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles([EUserRoles.INSTRUCTOR]),
    invitationControllers.setInstructorInvitation
);

export default invitationRouter;
