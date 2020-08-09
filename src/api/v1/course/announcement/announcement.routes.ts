import { Router } from "express";
import * as announcementControllers from "./announcement.controllers";
import { authMiddlewareService } from "../../../../services";
import { EUserRoles } from "../../../../types";

const announcementsRouter = Router();

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

announcementsRouter.put(
    "/:announcementId",
    authMiddlewareService.extractTokenPayload,
    announcementControllers.updateAnnouncement
);

export default announcementsRouter;
