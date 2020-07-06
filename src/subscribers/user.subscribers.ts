import { EUserEvents, IEventEmitterOnFunction } from "../types";
import { logger } from "../config";
import { Subscriber } from "../helpers/subscriber.helpers";

export default new Subscriber(function (on: IEventEmitterOnFunction) {
    on(EUserEvents.USER_SIGNUP, function ({ role, user }) {
        logger.info(`User of type ${role} signed up\n${user}`);
    });
});
