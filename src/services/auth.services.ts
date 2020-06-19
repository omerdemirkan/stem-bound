import { EUserRoles } from "../types";
import { JwtService, BcryptService, SchoolService } from ".";
import { Types } from "mongoose";

const { ObjectId } = Types;

export default class AuthService {
    constructor(
        private jwtService: JwtService,
        private bcryptService: BcryptService,
        private schoolService: SchoolService
    ) {}

    async userSignUp({
        role,
        userData,
    }: {
        role: EUserRoles;
        userData: object;
    }) {
        return { user: "adsf", accessToken: "asdf" };
    }

    async userLogin({
        role,
        email,
        password,
    }: {
        role: EUserRoles;
        email: string;
        password: string;
    }) {
        return { user: "adsf", accessToken: "adsf" };
    }

    async getUserById({ id, role }: { id: Types.ObjectId; role: EUserRoles }) {
        let user;

        return user;
    }

    async getUserByEmail({ email, role }: { email: string; role: EUserRoles }) {
        let user;

        return user;
    }
}
