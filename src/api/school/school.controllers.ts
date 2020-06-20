import { Request, Response } from "express";
import { Types } from "mongoose";
import { configureFindSchoolsQuery } from "../../helpers/school.helpers";
import {
    schoolService,
    errorParser,
    userService,
    courseService,
} from "../../services";

const { ObjectId } = Types;

export async function getSchools(req: Request, res: Response) {
    try {
        const { coordinates, limit, skip, where } = configureFindSchoolsQuery(
            req.query
        );
        let data;
        if (coordinates) {
            data = await schoolService.findSchoolsByCoordinates({
                coordinates,
                limit,
                skip,
                where,
            });
        } else {
            data = await schoolService.findSchools(where);
        }

        res.json({
            message: "",
            data,
        });
    } catch (e) {
        res.status(errorParser.status(e)).json(errorParser.json(e));
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
        res.status(errorParser.status(e)).json(errorParser.json(e));
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
        res.status(errorParser.status(e)).json(errorParser.json(e));
    }
}

export async function getSchoolStudentsById(req: Request, res: Response) {
    try {
        const school: any = await schoolService.findSchoolById(
            ObjectId(req.params.id)
        );
        const studentIds = school.meta.students.map((id: string) =>
            ObjectId(id)
        );
        const students = await userService.findUsersByIds(studentIds);

        res.json({
            message: "School students successfully fetched",
            data: students,
        });
    } catch (e) {
        res.status(errorParser.status(e)).json(errorParser.json(e));
    }
}

export async function getSchoolOfficialsById(req: Request, res: Response) {
    try {
        const school: any = await schoolService.findSchoolById(
            ObjectId(req.params.id)
        );
        const schoolOfficialIds = school.meta.schoolOfficials.map(
            (id: string) => ObjectId(id)
        );
        const schoolOfficials = await userService.findUsersByIds(
            schoolOfficialIds
        );

        res.json({
            message: "School school officials successfully fetched",
            data: schoolOfficials,
        });
    } catch (e) {
        res.status(errorParser.status(e)).json(errorParser.json(e));
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
        res.status(errorParser.status(e)).json(errorParser.json(e));
    }
}
