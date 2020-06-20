import { EUserRoles, ITokenPayload, EUserEvents } from "../types";
import { JwtService, BcryptService, UserService, MetadataService } from ".";
import { Types } from "mongoose";
import { EventEmitter } from "events";

const { ObjectId } = Types;

export default class AuthService {
    constructor(
        private jwtService: JwtService,
        private bcryptService: BcryptService,
        private userService: UserService,
        private metadataService: MetadataService,
        private eventEmitter: EventEmitter
    ) {}

    async userSignUp({
        role,
        userData,
    }: {
        role: EUserRoles;
        userData: object;
    }): Promise<{ user: any; accessToken: string }> {
        await this.bcryptService.removePasswordAndInsertHash(userData);

        const newUser: any = await this.userService.createUser({
            role,
            userData,
        });

        await this.metadataService.handleNewUserMetadataUpdate(newUser);

        const payload: ITokenPayload = {
            role: newUser.role,
            user: {
                _id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
            },
        };

        const accessToken = await this.jwtService.sign(payload);

        this.eventEmitter.emit(EUserEvents.USER_SIGNUP, {
            role: newUser.role,
            user: newUser,
        });
        return { user: newUser, accessToken };
    }

    async userLogin({
        email,
        password,
    }: {
        email: string;
        password: string;
    }): Promise<{ user: any; accessToken: string } | null> {
        const user: any = await this.userService.findUserByEmail(email);

        if (await this.bcryptService.compare(password, user.hash)) {
            const payload: ITokenPayload = {
                role: user.role,
                user: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                },
            };

            const accessToken = await this.jwtService.sign(payload);
            return { user, accessToken };
        }

        return null;
    }
}
