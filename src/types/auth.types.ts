import { EUserRoles } from "./index";

import { Types } from "mongoose";
import { type } from "os";

export interface ITokenPayload {
    role: EUserRoles;
    user: {
        _id: Types.ObjectId;
        firstName: string;
        lastName: string;
        email: string;
    };
}

export type IRequestValidationFunction = ({
    body,
    payload,
    params,
}: {
    body?: any;
    payload?: ITokenPayload;
    params?: any;
}) => boolean;
