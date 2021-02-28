import { eventEmitter } from "../config";
import { EChatEvents } from "../types";

eventEmitter.on(EChatEvents.CHAT_MESSAGE_CREATED, function () {});
