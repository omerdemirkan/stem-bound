import { Request, Response } from "express";
import { mailingListService, errorParser } from "../../services";

export async function createMailingListSubscriber(req: Request, res: Response) {
    try {
        const mailingListSubscriber = await mailingListService.createSubscriber(
            req.body
        );

        res.json({
            message: "Successfully subscribed to mailing list!",
            data: mailingListSubscriber,
        });
    } catch (e) {
        res.status(errorParser.status(e)).json(errorParser.json(e));
    }
}

export async function getMailingListSubscribers(req: Request, res: Response) {
    try {
        const mailingListSubscribers = await mailingListService.findSubscribers();

        res.json({
            message: "Successfully fetched mailing list subscribers",
            data: mailingListSubscribers,
        });
    } catch (e) {
        res.status(errorParser.status(e)).json(errorParser.json(e));
    }
}
