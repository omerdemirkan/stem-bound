import { Request, Response } from "express";
import { Types } from "mongoose";
import { configureFindSchoolsQuery } from "../../helpers/school.helpers";
import { schoolService, errorParser } from "../../services";

const { ObjectId } = Types;

export async function getSchools(req: Request, res: Response) {
    try {
        const { coordinates, limit, skip, query } = configureFindSchoolsQuery(
            req.query
        );
        let data;
        if (coordinates) {
            data = await schoolService.findSchoolsByCoordinates({
                coordinates,
                limit,
                skip,
            });
        } else {
            data = await schoolService.findSchools(query);
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
