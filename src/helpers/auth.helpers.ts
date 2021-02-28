import { IUser, ITokenPayload } from "../types";

export function getTokenPayload(user: IUser): ITokenPayload {
    return {
        user: {
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
        },
    };
}
