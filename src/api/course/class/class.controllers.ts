import { Request, Response } from "express";
import { errorService, courseService } from "../../../services";
import { Types } from "mongoose";
import { ICourse, IClass } from "../../../types";
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

export async function getClassByIds(req: Request, res: Response) {
    try {
        const courseId = ObjectId(req.params.courseId);
        const classId = ObjectId(req.params.classId);
        const course: ICourse = await courseService.findCourseById(courseId);
        if (!course) {
            errorService.throwError(EErrorTypes.DOCUMENT_NOT_FOUND);
        }
        const foundClass = course.classes.find(
            (classElem: IClass) =>
                classElem._id.toString() === classId.toString()
        );
        if (!foundClass) {
            errorService.throwError(EErrorTypes.DOCUMENT_NOT_FOUND);
        }
        res.json({
            message: "Class successfully found",
            data: foundClass,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function createClassByCourseId(req: Request, res: Response) {
    try {
        const courseId = ObjectId(req.params.courseId);
        const newClasses: IClass[] = await courseService.createClasses(
            courseId,
            req.body.classes || [req.body]
        );

        res.json({
            message: "Classes successfully added",
            data: newClasses,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}
