import { EUserRoles, ITokenPayload, EUserEvents, IUser } from "../types";
import { JwtService, BcryptService, UserService, MetadataService } from ".";
import { EventEmitter } from "events";
import { emitter } from "../decorators";
import { configureTokenPayload } from "../helpers";
import { injectable } from "inversify";
import { container } from "../config";

@injectable()
class AuthService {
    @emitter()
    private eventEmitter: EventEmitter;

    constructor(
        private jwtService: JwtService,
        private bcryptService: BcryptService,
        private userService: UserService,
        private metadataService: MetadataService
    ) {}

    async userSignUp(
        userData: Partial<IUser>,
        role: EUserRoles
    ): Promise<{ user: any; accessToken: string }> {
        await this.bcryptService.replaceKeyWithHash(userData, "password", {
            newKey: "hash",
        });

        const newUser: any = await this.userService.createUser(userData, role);

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

container.bind<AuthService>(AuthService).toSelf();

export default AuthService;
