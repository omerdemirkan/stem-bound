import { IUser, ITokenPayload } from "../types";

export function configureTokenPayload(user: IUser): ITokenPayload {
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
