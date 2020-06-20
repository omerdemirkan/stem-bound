import { Request, Response } from "express";
import { Types } from "mongoose";
import { courseService, schoolService, errorParser } from "../../services";

const { ObjectId } = Types;

export async function createCourse(req: Request, res: Response) {
    try {
        const courseData = req.body;
        const instructorId = (req as any).payload.user._id;

        if (!courseData.meta.instructors?.includes(instructorId)) {
            // To ensure that the instructor creating the course is and instructor for the course.
            throw new Error(
                `Payload user id isn't included in course instructors metadata.`
            );
        }

        const newCourse = await courseService.createCourse(courseData);
        const schoolId = newCourse.meta.school;
        const courseId = newCourse._id;

        res.json({
            message: "Course successfully created",
            data: {
                course: newCourse,
            },
        });
    } catch (e) {
        res.status(errorParser.status(e)).json(errorParser.json(e));
    }
}

export async function enrollInCourseById(req: Request, res: Response) {
    try {
        const studentId = ObjectId((req as any).payload.user._id);
        const courseId = ObjectId(req.params.id);

        // Not using promise.all because I dont want to update the student metadata if the course id is invalid.
        await courseService.addStudentMetadata({
            studentId,
            courseId,
        });

        res.json({
            message: "Successfully enrolled in course.",
            data: { status: true },
        });
    } catch (e) {
        res.status(errorParser.status(e)).json(errorParser.json(e));
    }
}

export async function dropCourseById(req: Request, res: Response) {
    try {
        const studentId = ObjectId((req as any).payload.user._id);
        const courseId = ObjectId(req.params.id);

        // Not using promise.all because I dont want to update the student metadata if the course id is invalid.
        await courseService.removeStudentMetadataFromOne({
            studentId,
            courseId,
        });

        res.json({
            message: "Successfully dropped course.",
            data: { status: true },
        });
    } catch (e) {
        res.status(errorParser.status(e)).json(errorParser.json(e));
    }
}

export async function getCourses(req: Request, res: Response) {
    try {
        const data = await courseService.findCourses({});

        res.json({
            message: "Courses successfully fetched",
            data,
        });
    } catch (e) {
        res.status(errorParser.status(e)).json(errorParser.json(e));
    }
}

export async function getCourseById(req: Request, res: Response) {
    try {
        const id = ObjectId(req.params.id);
        const data = await courseService.findCourseById(id);

        res.json({
            message: "Course successfully fetched",
            data,
        });
    } catch (e) {
        res.status(errorParser.status(e)).json(errorParser.json(e));
    }
}

export async function updateCourseById(req: Request, res: Response) {
    try {
        const id = ObjectId(req.params.id);
        const newCourseData = req.body;

        const data = await courseService.updateCourseById(id, newCourseData);

        res.json({
            message: "Course successfully updated",
            data,
        });
    } catch (e) {
        res.status(errorParser.status(e)).json(errorParser.json(e));
    }
}

export async function deleteCourseById(req: Request, res: Response) {
    try {
        const courseId = ObjectId(req.params.id);

        const deletedCourse: any = await courseService.deleteCourseById(
            courseId
        );

        const instructorId = (req as any).payload.user._id;
        const studentIds = deletedCourse.meta.students;
        const schoolId = deletedCourse.meta.school;

        await Promise.all([
            schoolService.removeCourseMetadata({
                schoolId,
                courseId,
            }),
        ]);

        res.json({
            message: "Course successfully deleted",
            data: {
                course: deletedCourse,
            },
        });
    } catch (e) {
        res.status(errorParser.status(e)).json(errorParser.json(e));
    }
}
