import { Router } from "express";
import * as announcementControllers from "./announcement.controllers";
import { authMiddlewareService } from "../../../../services";
import { EUserRoles } from "../../../../types";

const announcementsRouter = Router({ mergeParams: true });

announcementsRouter.post(
    "/",
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles([EUserRoles.INSTRUCTOR]),
    announcementControllers.createAnnouncement
);

announcementsRouter.get(
    "/",
    authMiddlewareService.extractTokenPayload,
    announcementControllers.getAnnouncements
);

announcementsRouter.get(
    "/:announcementId",
    authMiddlewareService.extractTokenPayload,
    announcementControllers.getAnnouncement
);

announcementsRouter.patch(
    "/:announcementId",
    authMiddlewareService.extractTokenPayload,
    announcementControllers.updateAnnouncement
);

announcementsRouter.delete(
    "/:announcementId",
    authMiddlewareService.extractTokenPayload,
    announcementControllers.deleteAnnouncement
);

export default announcementsRouter;
