import { Container } from 'typedi';
import { Request, Response } from 'express';
import SchoolOfficialService from './school-official.services';
import { ErrorParserService } from '../../../services';
import { Types } from 'mongoose';

const schoolOfficialService: SchoolOfficialService = Container.get(SchoolOfficialService);
const errorParser = Container.get(ErrorParserService);
const { ObjectId } = Types

export async function createSchoolOfficial(req: Request, res: Response) {
    try {
        const newSchoolOfficial = req.body;
        const data = await schoolOfficialService.createSchoolOfficial(newSchoolOfficial);

        res.json({
            data
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
        const data = await schoolOfficialService.deleteSchoolOfficialById(id);
        res.json({
            data
        });
    } catch (e) {
        res
        .status(errorParser.status(e))
        .json(errorParser.json(e))
    }
}

export async function deleteSchoolOfficialsByIds(req: Request, res: Response) {
    try {
        const ids: Types.ObjectId[] = req.body.ids
        .map(
            (id: string) => ObjectId(id)
        );
        const data = await schoolOfficialService.deleteSchoolOfficialsByIds(ids);
        res.json({
            data
        });
    } catch (e) {
        res
        .status(errorParser.status(e))
        .json(errorParser.json(e))
    }
}