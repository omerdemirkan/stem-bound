import { Request, Response } from 'express';
import { Container } from 'typedi';
import SchoolService from './school.services';
import { ErrorParserService } from '../../services';
import { Types } from 'mongoose';
import { configureFindSchoolsQuery } from './school.helpers';


const { ObjectId } = Types;

const schoolService = Container.get(SchoolService);
const errorParser = Container.get(ErrorParserService);

export async function getSchools(req: Request, res: Response) {
    try {
        const { coordinates, limit, skip, query } = configureFindSchoolsQuery(req.query);
        let data
        if (coordinates) {
            data = await schoolService.findSchoolsByCoordinates({
                coordinates,
                limit,
                skip
            })
        } else {
            data = await schoolService.findSchools(query)
        }

        res.json({
            message: '',
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
        const data = await schoolService.findOneById(id)

        res.json({
            message: '',
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
            message: '',
            data
        })
    } catch (e) {
        res
        .status(errorParser.status(e))
        .json(errorParser.json(e));
    }
}