export interface IMailDTO {
    to: string | string[];
    html: string;
    subject: string;
    from?: string;
    inline?: string | string[];
}
