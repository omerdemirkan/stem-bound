import { EUserRoles } from "./index";

export interface ITokenPayload {
    role: EUserRoles | "ADMIN";
    user: {
        _id: string;
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
