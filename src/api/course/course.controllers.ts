import { Request, Response } from "express";
import { Types } from "mongoose";
import {
    courseService,
    errorService,
    metadataService,
    userService,
    schoolService,
} from "../../services";

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

        await metadataService.handleNewCourseMetadataUpdate(newCourse);

        res.json({
            message: "Course successfully created",
            data: {
                course: newCourse,
            },
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function enrollInCourseById(req: Request, res: Response) {
    try {
        const studentId = ObjectId((req as any).payload.user._id);
        const courseId = ObjectId(req.params.id);

        await metadataService.handleCourseEnrollmentMetadataUpdate({
            courseId,
            studentId,
        });
        res.json({
            message: "Successfully enrolled in course.",
            data: { status: true },
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function dropCourseById(req: Request, res: Response) {
    try {
        const studentId = ObjectId((req as any).payload.user._id);
        const courseId = ObjectId(req.params.id);

        await metadataService.handleCourseDropMetadataUpdate({
            courseId,
            studentId,
        });
        res.json({
            message: "Successfully dropped course.",
            data: { status: true },
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
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
        res.status(errorService.status(e)).json(errorService.json(e));
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
        res.status(errorService.status(e)).json(errorService.json(e));
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
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function deleteCourseById(req: Request, res: Response) {
    try {
        const courseId = ObjectId(req.params.id);

        const deletedCourse: any = await courseService.deleteCourseById(
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

export async function getCourseInstructorsById(req: Request, res: Response) {
    try {
        const course: any = await courseService.findCourseById(
            ObjectId(req.params.id)
        );
        const instructorIds = course.meta.instructors.map((id: string) =>
            ObjectId(id)
        );

        const instructors = await userService.findUsersByIds(instructorIds);

        res.json({
            message: "Course instructors successfully fetched",
            data: instructors,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function getCourseStudentsById(req: Request, res: Response) {
    try {
        const course: any = await courseService.findCourseById(
            ObjectId(req.params.id)
        );
        const studentIds = course.meta.students.map((id: string) =>
            ObjectId(id)
        );
        const students = await userService.findUsersByIds(studentIds);
        res.json({
            message: "Course students successfully fetched",
            data: students,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function getCourseSchoolById(req: Request, res: Response) {
    try {
        const course: any = await courseService.findCourseById(
            ObjectId(req.params.id)
        );
        const schoolId = ObjectId(course.meta.school);
        const school = await schoolService.findSchoolById(schoolId);
        res.json({
            message: "Course school successfully fetched",
            data: school,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}
