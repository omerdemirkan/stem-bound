import { Request, Response } from "express";
import { Types } from "mongoose";
import { configureFindSchoolsQuery } from "../../helpers/school.helpers";
import {
    schoolService,
    errorService,
    userService,
    courseService,
} from "../../services";
import { IUser, IStudent } from "../../types";

const { ObjectId } = Types;

export async function getSchools(req: Request, res: Response) {
    try {
        const {
            coordinates,
            limit,
            skip,
            query,
            text,
        } = configureFindSchoolsQuery(req.query);
        let data;
        if (coordinates) {
            data = await schoolService.findSchoolsByCoordinates({
                coordinates,
                limit,
                skip,
                query,
                text,
            });
        } else if (text) {
            data = await schoolService.findSchoolsByText(text);
        } else {
            data = await schoolService.findSchools(query);
        }

        res.json({
            message: "",
            data,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function getSchoolById(req: Request, res: Response) {
    try {
        const id = ObjectId(req.params.id);
        const data = await schoolService.findSchoolById(id);

        res.json({
            message: "",
            data,
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
            message: "",
            data,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function getSchoolStudentsById(req: Request, res: Response) {
    try {
        const school: any = await schoolService.findSchoolById(
            ObjectId(req.params.id)
        );
        const studentIds = school.meta.students;
        const students = (await userService.findUsersByIds(
            studentIds
        )) as IStudent[];

        res.json({
            message: "School students successfully fetched",
            data: students,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function getSchoolOfficialsById(req: Request, res: Response) {
    try {
        const school: any = await schoolService.findSchoolById(
            ObjectId(req.params.id)
        );
        const schoolOfficialIds = school.meta.schoolOfficials;
        const schoolOfficials = await userService.findUsersByIds(
            schoolOfficialIds
        );

        res.json({
            message: "School school officials successfully fetched",
            data: schoolOfficials,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function getSchoolCoursesById(req: Request, res: Response) {
    try {
        const school: any = await schoolService.findSchoolById(
            ObjectId(req.params.id)
        );
        const courseIds = school.meta.courses.map((id: string) => ObjectId(id));

        const courses = await courseService.findCoursesByIds(courseIds);

        res.json({
            message: "School courses successfully fetched",
            data: courses,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}
