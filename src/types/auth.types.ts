import { EUserRoles } from "./index";

export interface ITokenPayload {
    user: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        role: EUserRoles | "ADMIN";
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
