import { Response } from "express";
import { Types } from "mongoose";
import { configureFindSchoolsQuery } from "../../../helpers/school.helpers";
import { schoolService, errorService } from "../../../services";
import { ISchool, EErrorTypes, IModifiedRequest } from "../../../types";

const { ObjectId } = Types;

export async function getSchools(req: IModifiedRequest, res: Response) {
    try {
        const { query, coordinates } = configureFindSchoolsQuery(
            req.query,
            req.ip
        );
        let schools: ISchool[];
        schools = coordinates
            ? await schoolService.findSchoolsByCoordinates(coordinates, query)
            : await schoolService.findSchools(query);

        res.json({
            message: "Schools successfully fetched",
            data: schools,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function getSchool(req: IModifiedRequest, res: Response) {
    try {
        const id = ObjectId(req.params.id);
        const school: ISchool = await schoolService.findSchoolById(id);

        if (!school) {
            errorService.throwError(
                EErrorTypes.DOCUMENT_NOT_FOUND,
                "School not found"
            );
        }

        res.json({
            message: "School successfully fetched",
            data: school,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function refreshDatabase(req: IModifiedRequest, res: Response) {
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
