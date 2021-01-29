export interface IMailDTO {
    to: string;
    html: string;
    subject: string;
    from?: string;
    inline?: string | string[];
}
