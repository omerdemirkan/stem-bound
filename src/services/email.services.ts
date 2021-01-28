import { inject, injectable } from "inversify";
import { IEmailService, IErrorService, IMailDTO } from "../types";
import mg from "mailgun-js";
import config from "../config";
import { SERVICE } from "../constants";

@injectable()
export default class EmailService implements IEmailService {
    client = mg({
        apiKey: config.mailgunApiKey,
        domain: config.clientDomain,
    });

    constructor(
        @inject(SERVICE.ERROR_SERVICE) protected errorService: IErrorService
    ) {}

    async send({ to, from, subject, html }: IMailDTO) {
        return new Promise((resolve, reject) => {
            this.client.messages().send(
                {
                    from: from || `STEM-bound <help@${config.mailgunDomain}>`,
                    to,
                    subject,
                    html,
                },
                function (error, body) {
                    if (error) reject(error);
                    else resolve(body);
                }
            );
        });
    }
}
