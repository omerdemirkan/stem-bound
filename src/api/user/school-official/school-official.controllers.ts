import { Request, Response } from "express";
import { Types } from "mongoose";
import {
    schoolOfficialService,
    schoolService,
    errorParser,
} from "../../../services";

const { ObjectId } = Types;

export async function createSchoolOfficial(req: Request, res: Response) {
    try {
        const newSchoolOfficial = req.body;
        const user: any = await schoolOfficialService.createSchoolOfficial(
            newSchoolOfficial
        );
        await schoolService.addStudentMetadata({
            studentId: user._id,
            schoolId: user.meta.school,
        });

        res.json({
            message: "",
            data: { user },
        });
    } catch (e) {
        res.status(errorParser.status(e)).json(errorParser.json(e));
    }
}

export async function getSchoolOfficials(req: Request, res: Response) {
    try {
        const data = await schoolOfficialService.findSchoolOfficials();
        res.json({
            data,
        });
    } catch (e) {
        res.status(errorParser.status(e)).json(errorParser.json(e));
    }
}

export async function getSchoolOfficialById(req: Request, res: Response) {
    try {
        const id = ObjectId(req.params.id);
        const data = await schoolOfficialService.findSchoolOfficialById(id);
        res.json({
            message: "",
            data,
        });
    } catch (e) {
        res.status(errorParser.status(e)).json(errorParser.json(e));
    }
}

export async function updateSchoolOfficialById(req: Request, res: Response) {
    try {
        const id = ObjectId(req.params.id);
        const newSchoolOfficial = req.body;
        const data = await schoolOfficialService.updateSchoolOfficialById(
            id,
            newSchoolOfficial
        );

        res.json({
            message: "",
            data,
        });
    } catch (e) {
        res.status(errorParser.status(e)).json(errorParser.json(e));
    }
}

export async function deleteSchoolOfficialById(req: Request, res: Response) {
    try {
        const id = ObjectId(req.params.id);
        const user: any = await schoolOfficialService.deleteSchoolOfficialById(
            id
        );

        await schoolService.removeStudentMetadata({
            studentId: id,
            schoolId: user.meta.school,
        });

        res.json({
            message: "",
            data: { user },
        });
    } catch (e) {
        res.status(errorParser.status(e)).json(errorParser.json(e));
    }
}

export async function getSchoolOfficialSchoolById(req: Request, res: Response) {
    try {
        const id = ObjectId(req.params.id);
        const schoolOfficial: any = await schoolOfficialService.findSchoolOfficialById(
            id
        );

        const schoolId = schoolOfficial.meta.school;
        const school = await schoolService.findSchoolById(schoolId);

        res.json({
            message: "",
            data: school,
        });
    } catch (e) {
        res.status(errorParser.status(e)).json(errorParser.json(e));
    }
}
