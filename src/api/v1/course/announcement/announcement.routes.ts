import { Router } from "express";
import * as announcementControllers from "./announcement.controllers";
import { authMiddlewareService } from "../../../../services";
import { EUserRoles } from "../../../../types";

const announcementRouter = Router({ mergeParams: true });

announcementRouter.post(
    "/",
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles([EUserRoles.INSTRUCTOR]),
    announcementControllers.createAnnouncement
);

announcementRouter.get(
    "/",
    authMiddlewareService.extractTokenPayload,
    announcementControllers.getAnnouncements
);

announcementRouter.get(
    "/:announcementId",
    authMiddlewareService.extractTokenPayload,
    announcementControllers.getAnnouncement
);

announcementRouter.patch(
    "/:announcementId",
    authMiddlewareService.extractTokenPayload,
    announcementControllers.updateAnnouncement
);

announcementRouter.delete(
    "/:announcementId",
    authMiddlewareService.extractTokenPayload,
    announcementControllers.deleteAnnouncement
);

export default announcementRouter;
