export interface IMailDTO {
    to: string | string[];
    html?: string;
    text?: string;
    subject: string;
    from?: string;
    inline?: string | string[];
}
