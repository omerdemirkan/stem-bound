import { EventEmitter } from "events";
import { emitter } from "../decorators";
import { configureTokenPayload } from "../helpers";
import { inject, injectable } from "inversify";
import {
    EUserRoles,
    ITokenPayload,
    EUserEvents,
    IUser,
    IAuthService,
    IJwtService,
    IBcryptService,
    IUserService,
} from "../types";
import { SERVICE } from "../constants/service.constants";

@injectable()
class AuthService implements IAuthService {
    @emitter()
    private eventEmitter: EventEmitter;

    constructor(
        @inject(SERVICE.JWT_SERVICE) protected jwtService: IJwtService,
        @inject(SERVICE.BCRYPT_SERVICE) protected bcryptService: IBcryptService,
        @inject(SERVICE.USER_SERVICE) protected userService: IUserService
    ) {}

    async userSignUp(
        userData: Partial<IUser>,
        role: EUserRoles
    ): Promise<{ user: IUser; accessToken: string }> {
        await this.userService.configureUserData(userData, role);

        const newUser = await this.userService.createUser(userData, role);

        const payload: ITokenPayload = configureTokenPayload(newUser);

        const accessToken = await this.jwtService.sign(payload);

        this.eventEmitter.emit(EUserEvents.USER_SIGNUP, newUser);
        return { user: newUser, accessToken };
    }

    async userLogin(
        email: string,
        password: string
    ): Promise<{ user: any; accessToken: string } | null> {
        const user = await this.userService.findUserByEmail(email);

        if (!user) {
            return null;
        }

        if (await this.bcryptService.compare(password, user.hash)) {
            const payload: ITokenPayload = configureTokenPayload(user);

            const accessToken = await this.jwtService.sign(payload);
            return { user, accessToken };
        }

        return null;
    }
}

export default AuthService;
