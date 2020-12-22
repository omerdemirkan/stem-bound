import { Request, Response } from "express";
import { IModifiedRequest } from "../types";

export function modifyRequestMiddleware(req: Request, res: Response, next) {
    (req as IModifiedRequest).meta = {
        body: req.body,
        params: req.params,
        query: req.query,
        payload: null,
        ip: req.ip,
    };
    next();
}
