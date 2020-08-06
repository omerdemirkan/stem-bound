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
        const courseId = ObjectId(req.params.courseId);
        const course = await courseService.findCourseById(courseId);
        if (!course) {
            errorService.throwError(
                EErrorTypes.DOCUMENT_NOT_FOUND,
                "Course not found"
            );
        }
        res.json({
            data: course.announcements,
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
        const course = await courseService.findCourseById(courseId);
        if (!course) {
            errorService.throwError(
                EErrorTypes.DOCUMENT_NOT_FOUND,
                "Course not found"
            );
        }
        const announcement = course.announcements.find(
            (announcement) =>
                announcement._id.toString() === announcementId.toString()
        );
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
