import { eventEmitter } from "../config";
import { EUserEvents } from "../types";

eventEmitter.on(EUserEvents.USER_SIGNUP_INITIATED, function () {});
