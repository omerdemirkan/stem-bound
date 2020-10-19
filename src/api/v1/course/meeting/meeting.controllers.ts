import { Request, Response } from "express";
import { errorService, courseService } from "../../../../services";
import { Types } from "mongoose";
import { IMeeting } from "../../../../types";
import { configureMeetingArrayResponseData } from "../../../../helpers";

const { ObjectId } = Types;

export async function getMeetings(req: Request, res: Response) {
    try {
        const { limit, skip, before, after } = req.query;
        const courseId = ObjectId(req.params.courseId);
        const meetings: IMeeting[] = await courseService.findMeetingsByCourseId(
            courseId,
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

export async function getMeeting(req: Request, res: Response) {
    try {
        const courseId = ObjectId(req.params.courseId);
        const meetingId = ObjectId(req.params.meetingId);
        const meeting = await courseService.findMeetingById({
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

export async function createMeeting(req: Request, res: Response) {
    try {
        const courseId = ObjectId(req.params.courseId);
        const newMeetings: IMeeting[] = await courseService.createMeetings(
            req.body.meetings || [req.body],
            courseId
        );

        res.json({
            message: "Meetings successfully added",
            data: newMeetings,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function updateMeeting(req: Request, res: Response) {
    try {
        const updatedMeeting: IMeeting = await courseService.updateMeeting({
            courseId: ObjectId(req.params.courseId),
            meetingId: ObjectId(req.params.meetingId),
            requestingUserId: (req as any).payload.user._id,
            meetingData: req.body,
        });
        res.json({
            message: "Meeting successfully updated",
            data: updatedMeeting,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function deleteMeeting(req: Request, res: Response) {
    try {
        const courseId = ObjectId(req.params.courseId);
        const meetingId = ObjectId(req.params.meetingId);
        const deletedMeeting: IMeeting = await courseService.deleteMeeting({
            courseId,
            meetingId,
            requestingUserId: (req as any).payload.user._id,
        });

        res.json({
            message: "Meeting successfully deleted",
            data: deletedMeeting,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}
