import { Request, Response } from "express";
import { errorService, courseService } from "../../../../services";
import { IAnnouncement, EErrorTypes } from "../../../../types";
import { Types } from "mongoose";

const { ObjectId } = Types;

export async function createAnnouncement(req: Request, res: Response) {
    try {
        const announcementData: Partial<IAnnouncement> = req.body;
        const courseId = ObjectId(req.params.courseId);
        const newAnouncement = await courseService.createAnnouncement(
            announcementData,
            { courseId }
        );
        res.json({
            data: newAnouncement,
            message: "Announcement successfully created",
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function getAnnouncements(req: Request, res: Response) {
    try {
        const { skip, limit } = req.query;
        const courseId = ObjectId(req.params.courseId);
        const announcements = await courseService.findAnnouncementsByCourseId(
            courseId,
            {
                skip,
                limit,
            } as any
        );
        res.json({
            data: announcements,
            message: "Course announcement successfully fetched",
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function getAnnouncement(req: Request, res: Response) {
    try {
        const courseId = ObjectId(req.params.courseId);
        const announcementId = ObjectId(req.params.announcementId);
        const announcement = await courseService.findAnnouncementById({
            courseId,
            announcementId,
        });
        if (!announcement) {
            errorService.throwError(
                EErrorTypes.DOCUMENT_NOT_FOUND,
                "Announcement not found"
            );
        }
        res.json({
            data: announcement,
            message: "Announcement successfully fetched",
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function updateAnnouncement(req: Request, res: Response) {
    try {
        const announcementId = ObjectId(req.params.announcementId);
        const courseId = ObjectId(req.params.courseId);
        const updatedAnnouncement = await courseService.updateAnnouncement(
            req.body,
            { announcementId, courseId }
        );
        res.json({
            data: updatedAnnouncement,
            message: "Announcement successfully fetched",
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function deleteAnnouncement(req: Request, res: Response) {
    try {
        const announcementId = ObjectId(req.params.announcementId);
        const courseId = ObjectId(req.params.courseId);

        const deletedAnnouncement = await courseService.deleteAnnouncementById({
            courseId,
            announcementId,
        });

        res.json({
            data: deletedAnnouncement,
            message: "Announcement successfully deleted",
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}
