import { Request, Response } from 'express';
import { Container } from 'typedi';
import SchoolService from './school.services';
import { ErrorParserService } from '../../services';
import { Types } from 'mongoose';


const { ObjectId } = Types;

const schoolService = Container.get(SchoolService);
const errorParser = Container.get(ErrorParserService);

export async function getSchools(req: Request, res: Response) {
    try {
        const data = schoolService.findSchools();

        res.json({
            data
        });
    } catch (e) {
        res
        .status(errorParser.status(e))
        .json(errorParser.json(e));
    }
}

export async function getSchoolById(req: Request, res: Response) {
    try {
        const id = ObjectId(req.params.id)
        const data = schoolService.findOneById(id)

        res.json({
            data
        })
    } catch (e) {
        res
        .status(errorParser.status(e))
        .json(errorParser.json(e));
    }
}

export async function refreshDatabase(req: Request, res: Response) {
    try {
        const { url } = req.body;
        const data = await schoolService.refreshDatabase({ url });

        res.json({
            data
        })
    } catch (e) {
        res
        .status(errorParser.status(e))
        .json(errorParser.json(e));
    }
}