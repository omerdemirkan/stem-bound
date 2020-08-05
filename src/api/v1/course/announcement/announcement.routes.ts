import { Router } from "express";
import * as announcementControllers from "./announcement.controllers";

const announcementsRouter = Router();

announcementsRouter.post("/", announcementControllers.createAnnouncement);

announcementsRouter.get("/", announcementControllers.getAnnouncements);

announcementsRouter.get(
    "/:announcementId",
    announcementControllers.getAnnouncement
);

export default announcementsRouter;
