import { injectable } from "inversify";
import { IEmailService, IMailDTO } from "../types";
import mg from "mailgun-js";
import config from "../config";

@injectable()
export default class EmailService implements IEmailService {
    client = mg({
        apiKey: config.mailgunApiKey,
        domain: config.clientDomain,
    });

    async send({ to, from, subject, html }: IMailDTO) {
        this.client.messages().send({
            from: from || `STEM-bound <help@${config.mailgunDomain}>`,
            to,
            subject,
            html,
        });
    }
}
