import { Request } from "express";
import { ITokenPayload } from "./auth.types";

export interface IRequestMetadata {
    payload?: ITokenPayload;
    params: any;
    query: any;
    body: any;
}

export interface IModifiedRequest extends Request {
    payload?: ITokenPayload;
    meta: IRequestMetadata;
}
