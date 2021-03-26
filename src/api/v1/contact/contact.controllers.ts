import { Response } from "express";
import { configureContactData } from "../../../helpers";
import { sendContactUsEmails } from "../../../jobs";
import { errorService } from "../../../services";
import { IModifiedRequest } from "../../../types";

export async function contactUs(req: IModifiedRequest, res: Response) {
    try {
        const contactData = configureContactData(req.body);
        await sendContactUsEmails(contactData);
        res.json({
            message: `Thanks for contacting us! Emails were sent to the team.`,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}
