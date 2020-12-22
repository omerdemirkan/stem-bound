import { Request, Response } from "express";
import { errorService, courseService } from "../../../../services";
import {
    IAnnouncement,
    EErrorTypes,
    IModifiedRequest,
} from "../../../../types";
import { Types } from "mongoose";
import {
    configureAnnouncementArrayQuery,
    configureAnnouncementArrayResponseData,
    configureAnnouncementResponseData,
} from "../../../../helpers";

const { ObjectId } = Types;

export async function createAnnouncement(req: IModifiedRequest, res: Response) {
    try {
        const announcementData: Partial<IAnnouncement> = req.body;
        const courseId = ObjectId(req.params.courseId);
        announcementData.meta.from = ObjectId(req.payload.user._id);
        const newAnouncement = await courseService.createAnnouncement(
            announcementData,
            courseId
        );
        res.json({
            data: configureAnnouncementResponseData(newAnouncement, req.meta),
            message: "Announcement successfully created",
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function getAnnouncements(req: IModifiedRequest, res: Response) {
    try {
        const courseId = ObjectId(req.params.courseId);
        const query = configureAnnouncementArrayQuery(req.meta);
        const announcements = await courseService.findAnnouncementsByCourseId(
            courseId,
            query
        );
        res.json({
            data: configureAnnouncementArrayResponseData(
                announcements,
                req.meta
            ),
            message: "Course announcement successfully fetched",
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function getAnnouncement(req: IModifiedRequest, res: Response) {
    try {
        const announcement = await courseService.findAnnouncementById({
            courseId: ObjectId(req.params.courseId),
            announcementId: ObjectId(req.params.announcementId),
        });
        if (!announcement) {
            errorService.throwError(
                EErrorTypes.DOCUMENT_NOT_FOUND,
                "Announcement not found"
            );
        }
        res.json({
            data: configureAnnouncementResponseData(announcement, req.meta),
            message: "Announcement successfully fetched",
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function updateAnnouncement(req: IModifiedRequest, res: Response) {
    try {
        const updatedAnnouncement = await courseService.updateAnnouncementByCourseId(
            {
                announcementId: ObjectId(req.params.announcementId),
                courseId: ObjectId(req.params.courseId),
            },
            req.body
        );
        res.json({
            data: configureAnnouncementResponseData(
                updatedAnnouncement,
                req.meta
            ),
            message: "Announcement successfully fetched",
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function deleteAnnouncement(req: IModifiedRequest, res: Response) {
    try {
        const deletedAnnouncement = await courseService.deleteAnnouncementById({
            courseId: ObjectId(req.params.courseId),
            announcementId: ObjectId(req.params.announcementId),
        });

        res.json({
            data: configureAnnouncementResponseData(
                deletedAnnouncement,
                req.meta
            ),
            message: "Announcement successfully deleted",
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}
