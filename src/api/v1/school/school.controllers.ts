import { Request, Response } from "express";
import { Types } from "mongoose";
import { configureFindSchoolsQuery } from "../../../helpers/school.helpers";
import {
    schoolService,
    errorService,
    userService,
    courseService,
} from "../../../services";
import { IStudent, ISchool, ICourse, EErrorTypes } from "../../../types";

const { ObjectId } = Types;

export async function getSchools(req: Request, res: Response) {
    try {
        const {
            coordinates,
            limit,
            skip,
            where,
            text,
        } = configureFindSchoolsQuery(req.query, req.ip);
        let schools: ISchool[];
        if (coordinates) {
            schools = await schoolService.findSchoolsByCoordinates({
                coordinates,
                limit,
                skip,
                where,
                text,
            });
        } else if (text) {
            schools = await schoolService.findSchoolsByText(text);
        } else {
            schools = await schoolService.findSchools(where);
        }

        res.json({
            message: "Schools successfully fetched",
            data: schools,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function getSchool(req: Request, res: Response) {
    try {
        const id = ObjectId(req.params.id);
        const school: ISchool = await schoolService.findSchoolById(id);

        if (!school) {
            errorService.throwError(EErrorTypes.DOCUMENT_NOT_FOUND);
        }

        res.json({
            message: "School successfully fetched",
            data: school,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function refreshDatabase(req: Request, res: Response) {
    try {
        const { url } = req.body;
        const data = await schoolService.refreshDatabase({ url });

        res.json({
            message: "School db successfully refreshed",
            data,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function getSchoolStudents(req: Request, res: Response) {
    try {
        const school: ISchool = await schoolService.findSchoolById(
            ObjectId(req.params.id)
        );
        if (!school) {
            errorService.throwError(EErrorTypes.DOCUMENT_NOT_FOUND);
        }
        const studentIds = school.meta.students;
        const students = studentIds.length
            ? ((await userService.findUsersByIds(studentIds)) as IStudent[])
            : [];

        res.json({
            message: "School students successfully fetched",
            data: students,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function getSchoolOfficials(req: Request, res: Response) {
    try {
        const school: ISchool = await schoolService.findSchoolById(
            ObjectId(req.params.id)
        );
        if (!school) {
            errorService.throwError(EErrorTypes.DOCUMENT_NOT_FOUND);
        }
        const schoolOfficialIds = school.meta.schoolOfficials;
        const schoolOfficials = schoolOfficialIds.length
            ? await userService.findUsersByIds(schoolOfficialIds)
            : [];

        res.json({
            message: "School school officials successfully fetched",
            data: schoolOfficials,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function getSchoolCourses(req: Request, res: Response) {
    try {
        const school: ISchool = await schoolService.findSchoolById(
            ObjectId(req.params.id)
        );
        if (!school) {
            errorService.throwError(EErrorTypes.DOCUMENT_NOT_FOUND);
        }
        const courseIds = school.meta.courses;
        const courses: ICourse[] = courseIds.length
            ? await courseService.findCoursesByIds(courseIds)
            : [];

        res.json({
            message: "School courses successfully fetched",
            data: courses,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}
