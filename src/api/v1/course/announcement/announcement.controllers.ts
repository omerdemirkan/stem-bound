import { Request, Response } from "express";
import { errorService } from "../../../../services";
import { IAnnouncement } from "../../../../types";

export async function createAnnouncement(req: Request, res: Response) {
    try {
        const announcementData: Partial<IAnnouncement> = req.body;
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}
