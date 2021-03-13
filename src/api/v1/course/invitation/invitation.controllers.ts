import { Response } from "express";
import { Types } from "mongoose";
import { sendCourseInstructorInvitationEmail } from "../../../../jobs/email.jobs";
import { courseService, errorService, userService } from "../../../../services";
import { EErrorTypes, EUserRoles, IModifiedRequest } from "../../../../types";

const { ObjectId } = Types;

export async function inviteInstructor(req: IModifiedRequest, res: Response) {
    try {
        const courseId = ObjectId(req.params.courseId),
            inviterId = ObjectId(req.payload.user._id),
            invitedId = ObjectId(req.body.userId),
            [invited, course] = await Promise.all([
                userService.findUserById(invitedId),
                courseService.findCourseById(courseId),
            ]);

        if (!course.meta.instructors.some((i) => inviterId.equals(i)))
            errorService.throwError(
                EErrorTypes.FORBIDDEN,
                `You must be an instructor of ${course.title} to invite instructors`
            );
        if (invited.role !== EUserRoles.INSTRUCTOR)
            errorService.throwError(
                EErrorTypes.BAD_REQUEST,
                `The user you attempted to invite as an instructor is not an instructor`
            );
        if (course.meta.instructors.some((i) => invitedId.equals(i)))
            return res.json({
                message: `${invited.firstName} is already and instructor`,
            });

        await sendCourseInstructorInvitationEmail({
            courseId,
            invitedId,
            inviterId,
            schoolId: course.meta.school,
        });

        res.json({
            message: `${invited.firstName} was successfully invited as an instructor!`,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}
