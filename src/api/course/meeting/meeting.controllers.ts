import { Request, Response } from "express";
import { errorService, courseService } from "../../../services";
import { Types } from "mongoose";
import { ICourse, IMeeting } from "../../../types";
import { EErrorTypes } from "../../../types/error.types";

const { ObjectId } = Types;

export async function getMeetingsByCourseId(req: Request, res: Response) {
    try {
        const courseId = ObjectId(req.params.courseId);
        const course: ICourse = await courseService.findCourseById(courseId);
        if (!course) {
            errorService.throwError(EErrorTypes.DOCUMENT_NOT_FOUND);
        }
        res.json({
            message: "Meetings successfully fetched",
            data: course.meetings,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function getMeetingByIds(req: Request, res: Response) {
    try {
        const courseId = ObjectId(req.params.courseId);
        const meetingId = ObjectId(req.params.meetingId);
        const course: ICourse = await courseService.findCourseById(courseId);
        if (!course) {
            errorService.throwError(EErrorTypes.DOCUMENT_NOT_FOUND);
        }
        const meeting = course.meetings.find(
            (meeting: IMeeting) =>
                meeting._id.toString() === meetingId.toString()
        );
        if (!meeting) {
            errorService.throwError(EErrorTypes.DOCUMENT_NOT_FOUND);
        }
        res.json({
            message: "Meeting successfully found",
            data: meeting,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function createMeetingByCourseId(req: Request, res: Response) {
    try {
        const courseId = ObjectId(req.params.courseId);
        const newMeetings: IMeeting[] = await courseService.createMeetings(
            courseId,
            req.body.meetings || [req.body]
        );

        res.json({
            message: "Meetings successfully added",
            data: newMeetings,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}
