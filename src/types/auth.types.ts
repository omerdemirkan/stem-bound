import { EUserRoles } from "./index";

import { Types } from "mongoose";

export interface ITokenPayload {
    role: EUserRoles;
    user: {
        _id: Types.ObjectId;
        firstName: string;
        lastName: string;
        email: string;
    };
}
