import { Request, Response } from "express";
import { errorService, courseService } from "../../../../services";
import { Types } from "mongoose";
import { EUserRoles, IMeeting, IModifiedRequest } from "../../../../types";
import { configureMeetingArrayResponseData } from "../../../../helpers";

const { ObjectId } = Types;

export async function getMeetings(req: IModifiedRequest, res: Response) {
    try {
        const { limit, skip, before, after } = req.query;
        const courseId = ObjectId(req.params.courseId);
        const meetings: IMeeting[] = await courseService.findMeetings(
            { _id: courseId },
            { limit, skip, before, after } as any
        );
        res.json({
            message: "Meetings successfully fetched",
            data: configureMeetingArrayResponseData(meetings),
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function getMeeting(req: IModifiedRequest, res: Response) {
    try {
        const courseId = ObjectId(req.params.courseId);
        const meetingId = ObjectId(req.params.meetingId);
        const meeting = await courseService.findMeetingByCourseId({
            courseId,
            meetingId,
        });
        res.json({
            message: "Meeting successfully found",
            data: meeting,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function createMeeting(req: IModifiedRequest, res: Response) {
    try {
        const courseId = ObjectId(req.params.courseId);
        const newMeetings: IMeeting[] = await courseService.createMeetingsByCourseId(
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

export async function updateMeeting(req: IModifiedRequest, res: Response) {
    try {
        const updatedMeeting: IMeeting = await courseService.updateMeeting(
            {
                _id: ObjectId(req.params.courseId),
                "meta.instructors": ObjectId(req.payload.user._id),
            },
            ObjectId(req.params.meetingId),
            req.body
        );
        res.json({
            message: "Meeting successfully updated",
            data: updatedMeeting,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function deleteMeeting(req: IModifiedRequest, res: Response) {
    try {
        const courseId = ObjectId(req.params.courseId);
        const meetingId = ObjectId(req.params.meetingId);
        const deletedMeeting: IMeeting = await courseService.deleteMeeting(
            { _id: courseId },
            meetingId
        );

        res.json({
            message: "Meeting successfully deleted",
            data: deletedMeeting,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}
