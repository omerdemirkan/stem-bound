import { Request, Response } from "express";
import { errorService, locationService } from "../../services";
import { configureLocationQuery } from "../../helpers";
import { EErrorTypes } from "../../types/error.types";

export async function getLocations(req: Request, res: Response) {
    try {
        const { text } = configureLocationQuery(req.query as any);
        const locations = await locationService.findLocationsByText(text);

        if (!locations) {
            errorService.throwError(EErrorTypes.DOCUMENT_NOT_FOUND);
        }

        res.json({
            message: "Locations successfully fetched",
            data: locations,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}
