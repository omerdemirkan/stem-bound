import { Request, Response } from "express";
import { Types } from "mongoose";
import {
    courseService,
    errorService,
    metadataService,
    userService,
    schoolService,
} from "../../../services";
import {
    ICourse,
    IUser,
    EErrorTypes,
    ISchoolOfficial,
    IModifiedRequest,
} from "../../../types";
import {
    configureCourseArrayQuery,
    configureCourseArrayResponseData,
    configureCourseResponseData,
} from "../../../helpers";

const { ObjectId } = Types;

export async function createCourse(req: IModifiedRequest, res: Response) {
    try {
        let courseData: ICourse = req.body;
        courseData.meta.instructors = [ObjectId(req.payload.user._id)];
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

export async function enrollInCourse(req: IModifiedRequest, res: Response) {
    try {
        await metadataService.handleCourseEnrollmentMetadataUpdate({
            courseId: ObjectId(req.params.id),
            studentId: ObjectId(req.payload.user._id),
        });
        res.json({
            message: "Successfully enrolled in course.",
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function dropCourse(req: IModifiedRequest, res: Response) {
    try {
        await metadataService.handleCourseDropMetadataUpdate({
            courseId: ObjectId(req.params.id),
            studentId: ObjectId(req.payload.user._id),
        });
        res.json({
            message: "Successfully dropped course",
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function getCourses(req: IModifiedRequest, res: Response) {
    try {
        const query = configureCourseArrayQuery(req.meta);
        const courses: ICourse[] = await courseService.findCourses(query);
        res.json({
            message: "Courses successfully fetched",
            data: configureCourseArrayResponseData(courses, req.meta),
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function getCourse(req: IModifiedRequest, res: Response) {
    try {
        const id = ObjectId(req.params.id);
        const course: ICourse = await courseService.findCourseById(id);

        if (!course) {
            errorService.throwError(
                EErrorTypes.DOCUMENT_NOT_FOUND,
                "Course not found"
            );
        }
        res.json({
            message: "Course successfully fetched",
            data: course,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function updateCourse(req: IModifiedRequest, res: Response) {
    try {
        const id = ObjectId(req.params.id);
        const newCourseData: Partial<ICourse> = req.body;

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

export async function deleteCourse(req: IModifiedRequest, res: Response) {
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

export async function getCourseInstructors(
    req: IModifiedRequest,
    res: Response
) {
    try {
        const course: ICourse = await courseService.findCourseById(
            ObjectId(req.params.id)
        );

        if (!course) {
            errorService.throwError(
                EErrorTypes.DOCUMENT_NOT_FOUND,
                "Course not found"
            );
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

export async function getCourseStudents(req: IModifiedRequest, res: Response) {
    try {
        const course: ICourse = await courseService.findCourseById(
            ObjectId(req.params.id)
        );

        if (!course) {
            errorService.throwError(
                EErrorTypes.DOCUMENT_NOT_FOUND,
                "Course not found"
            );
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

export async function getCourseSchool(req: IModifiedRequest, res: Response) {
    try {
        const course: ICourse = await courseService.findCourseById(
            ObjectId(req.params.id)
        );

        if (!course) {
            errorService.throwError(
                EErrorTypes.DOCUMENT_NOT_FOUND,
                "Course not found"
            );
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

export async function verifyCourse(req: IModifiedRequest, res: Response) {
    try {
        const courseId = ObjectId(req.params.id);
        const schoolOfficialId = ObjectId(req.payload.user._id);

        const [course, schoolOfficial] = await Promise.all([
            courseService.findCourseById(courseId),
            userService.findUserById(
                schoolOfficialId
            ) as Promise<ISchoolOfficial>,
        ]);

        if (!schoolOfficial.meta.school.equals(course.meta.school))
            errorService.throwError(
                EErrorTypes.FORBIDDEN,
                "Only school officials from the school at which the course is taught can verify"
            );

        course.verified = req.body.verified;

        await course.save();

        res.json({
            message: "Course verification successfully updated",
            data: configureCourseResponseData(course, req.meta),
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}
