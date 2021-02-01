import { inject, injectable } from "inversify";
import { IEmailService, IErrorService, IMailDTO } from "../types";
import mg from "mailgun-js";
import config from "../config";
import { SERVICE_SYMBOLS } from "../constants";

@injectable()
export default class EmailService implements IEmailService {
    client = mg({
        apiKey: config.mailgunApiKey,
        domain: config.mailgunDomain,
    });

    constructor(
        @inject(SERVICE_SYMBOLS.ERROR_SERVICE)
        protected errorService: IErrorService
    ) {}

    async send({ to, from, subject, html, inline }: IMailDTO) {
        return await this.client.messages().send({
            from: from || `STEM-bound <help@${config.mailgunDomain}>`,
            to,
            subject,
            html,
            inline,
        });
    }
}
