import { Request, Response } from "express";
import { Types } from "mongoose";
import {
    courseService,
    errorService,
    metadataService,
    userService,
    schoolService,
} from "../../services";
import { EErrorTypes } from "../../types/error.types";
import { ICourse, IStudent, IUser } from "../../types";

const { ObjectId } = Types;

export async function createCourse(req: Request, res: Response) {
    try {
        const courseData = req.body;
        const newCourse: ICourse = await courseService.createCourse(courseData);

        await metadataService.handleNewCourseMetadataUpdate(newCourse);

        res.status(201).json({
            message: "Course successfully created",
            data: newCourse,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function enrollInCourse(req: Request, res: Response) {
    try {
        const studentId = ObjectId((req as any).payload.user._id);
        const courseId = ObjectId(req.params.id);

        await metadataService.handleCourseEnrollmentMetadataUpdate({
            courseId,
            studentId,
        });
        res.json({
            message: "Successfully enrolled in course.",
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function dropCourse(req: Request, res: Response) {
    try {
        const studentId = ObjectId((req as any).payload.user._id);
        const courseId = ObjectId(req.params.id);

        await metadataService.handleCourseDropMetadataUpdate({
            courseId,
            studentId,
        });
        res.json({
            message: "Successfully dropped course",
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function getCourses(req: Request, res: Response) {
    try {
        const courses: ICourse[] = await courseService.findCourses({});

        if (!courses) {
            errorService.throwError(EErrorTypes.DOCUMENT_NOT_FOUND);
        }
        res.json({
            message: "Courses successfully fetched",
            data: courses,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function getCourse(req: Request, res: Response) {
    try {
        const id = ObjectId(req.params.id);
        const course: ICourse = await courseService.findCourseById(id);

        if (!course) {
            errorService.throwError(EErrorTypes.DOCUMENT_NOT_FOUND);
        }
        res.json({
            message: "Course successfully fetched",
            data: course,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function updateCourse(req: Request, res: Response) {
    try {
        const id = ObjectId(req.params.id);
        const newCourseData = req.body;

        const updatedCourse: ICourse = await courseService.updateCourseById(
            id,
            newCourseData
        );

        res.json({
            message: "Course successfully updated",
            data: updatedCourse,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function deleteCourse(req: Request, res: Response) {
    try {
        const courseId = ObjectId(req.params.id);

        const deletedCourse: ICourse = await courseService.deleteCourseById(
            courseId
        );

        await metadataService.handleDeletedCourseMetadataUpdate(deletedCourse);

        res.json({
            message: "Course successfully deleted",
            data: {
                course: deletedCourse,
            },
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function getCourseInstructors(req: Request, res: Response) {
    try {
        const course: ICourse = await courseService.findCourseById(
            ObjectId(req.params.id)
        );

        if (!course) {
            errorService.throwError(EErrorTypes.DOCUMENT_NOT_FOUND);
        }
        const instructorIds = course.meta.instructors;
        const instructors = await userService.findUsersByIds(instructorIds);

        res.json({
            message: "Course instructors successfully fetched",
            data: instructors,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function getCourseStudents(req: Request, res: Response) {
    try {
        const course: ICourse = await courseService.findCourseById(
            ObjectId(req.params.id)
        );

        if (!course) {
            errorService.throwError(EErrorTypes.DOCUMENT_NOT_FOUND);
        }
        const studentIds = course.meta.students;
        const students: IUser[] = await userService.findUsersByIds(studentIds);
        res.json({
            message: "Course students successfully fetched",
            data: students,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function getCourseSchool(req: Request, res: Response) {
    try {
        const course: ICourse = await courseService.findCourseById(
            ObjectId(req.params.id)
        );

        if (!course) {
            errorService.throwError(EErrorTypes.DOCUMENT_NOT_FOUND);
        }
        const schoolId = course.meta.school;
        const school = await schoolService.findSchoolById(schoolId);
        res.json({
            message: "Course school successfully fetched",
            data: school,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}
