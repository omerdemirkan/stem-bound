import { NextFunction, Response } from "express";
import { IModifiedRequest } from "./request.types";

export type IMiddleware = (
    req: IModifiedRequest,
    res: Response,
    next: NextFunction
) => void;
