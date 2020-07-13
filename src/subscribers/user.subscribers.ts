import { EUserEvents, IEventEmitterOnFunction, IUser } from "../types";
import { logger } from "../config";
import { Subscriber } from "../helpers/subscriber.helpers";

function initializeUserSubscribers(on: IEventEmitterOnFunction) {
    on(EUserEvents.USER_SIGNUP, function (user: IUser) {
        logger.info(`User of type ${user.role} signed up\n${user}`);
    });
}

export default new Subscriber(initializeUserSubscribers);
