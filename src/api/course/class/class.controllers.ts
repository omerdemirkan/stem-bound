import { Request, Response } from "express";
import { errorService, courseService } from "../../../services";
import { Types } from "mongoose";
import { ICourse } from "../../../types";
import { EErrorTypes } from "../../../types/error.types";

const { ObjectId } = Types;

export async function getClassesByCourseId(req: Request, res: Response) {
    try {
        const courseId = ObjectId(req.params.courseId);
        const course: ICourse = await courseService.findCourseById(courseId);
        if (!course) {
            errorService.throwError(EErrorTypes.DOCUMENT_NOT_FOUND);
        }
        res.json({
            message: "Classes successfully fetched",
            data: course.classes,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}
