import { Subscriber, EUserEvents } from "../types";
import { eventEmitter, logger } from "../config";

export default new Subscriber(function () {
    eventEmitter.on(EUserEvents.USER_SIGNUP, function ({ role, user }) {
        logger.info(`User of type ${role} signed up\n${user}`);
    });
});
