import { Request, Response } from "express";
import { errorService, courseService } from "../../../../services";
import { Types } from "mongoose";
import { EUserRoles, IMeeting, IModifiedRequest } from "../../../../types";
import {
    configureMeetingArrayQuery,
    configureMeetingArrayResponseData,
    configureMeetingResponseData,
} from "../../../../helpers";

const { ObjectId } = Types;

export async function getMeetings(req: IModifiedRequest, res: Response) {
    try {
        const courseId = ObjectId(req.params.courseId);
        const query = configureMeetingArrayQuery(req.meta);
        const meetings: IMeeting[] = await courseService.findMeetings(
            { _id: courseId },
            query
        );
        res.json({
            message: "Meetings successfully fetched",
            data: configureMeetingArrayResponseData(meetings, req.meta),
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
            data: configureMeetingResponseData(meeting, req.meta),
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
            data: configureMeetingArrayResponseData(newMeetings, req.meta),
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function updateMeeting(req: IModifiedRequest, res: Response) {
    try {
        const updatedMeeting = await courseService.updateMeeting(
            {
                _id: ObjectId(req.params.courseId),
                "meta.instructors": ObjectId(req.payload.user._id),
            },
            ObjectId(req.params.meetingId),
            req.body
        );
        res.json({
            message: "Meeting successfully updated",
            data: configureMeetingResponseData(updatedMeeting, req.meta),
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
            data: configureMeetingResponseData(deletedMeeting, req.meta),
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}
