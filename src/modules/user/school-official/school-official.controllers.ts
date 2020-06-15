import { Container } from 'typedi';
import { Request, Response } from 'express';
import SchoolOfficialService from './school-official.services';
import { ErrorParserService } from '../../../services';
import { Types } from 'mongoose';
import SchoolService from '../../school/school.services';

const schoolOfficialService: SchoolOfficialService = Container.get(SchoolOfficialService);
const schoolService: SchoolService = Container.get(SchoolService)
const errorParser = Container.get(ErrorParserService);
const { ObjectId } = Types

export async function createSchoolOfficial(req: Request, res: Response) {
    try {
        const newSchoolOfficial = req.body;
        const user: any = await schoolOfficialService.createSchoolOfficial(newSchoolOfficial);
        await schoolService.addStudentMetadata({
            studentId: user._id,
            schoolId: user.meta.school
        })

        res.json({
            data: { user }
        })
    } catch (e) {
        res
        .status(errorParser.status(e))
        .json(errorParser.json(e));
    }
}

export async function getSchoolOfficials(req: Request, res: Response) {
    try {
        const data = await schoolOfficialService.findSchoolOfficials()
        res.json({
            data
        });
    } catch (e) {
        res
        .status(errorParser.status(e))
        .json(errorParser.json(e))
    }
}

export async function getSchoolOfficialById(req: Request, res: Response) {
    try {
        const id = ObjectId(req.params.id);
        const data = await schoolOfficialService.findSchoolOfficialById(id)
        res.json({
            data
        });
    } catch (e) {
        res
        .status(errorParser.status(e))
        .json(errorParser.json(e))
    }
}

export async function updateSchoolOfficialById(req: Request, res: Response) {
    try {
        if (req.body.meta) throw new Error('metadata cannot be updated from this route');
        const id = ObjectId(req.params.id);
        const newSchoolOfficial = req.body;
        const data = await schoolOfficialService.updateSchoolOfficialById(id, newSchoolOfficial);

        res.json({
            data
        })
    } catch (e) {
        res
        .status(errorParser.status(e))
        .json(errorParser.json(e))
    }
}

export async function deleteSchoolOfficialById(req: Request, res: Response) {
    try {
        const id = ObjectId(req.params.id);
        const user: any = await schoolOfficialService.deleteSchoolOfficialById(id);
            
        await schoolService.removeStudentMetadata({
            studentId: id,
            schoolId: user.meta.school
        })

        res.json({
            data: { user }
        });
    } catch (e) {
        res
        .status(errorParser.status(e))
        .json(errorParser.json(e))
    }
}