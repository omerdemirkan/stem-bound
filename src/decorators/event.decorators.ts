import { eventEmitter } from "../config";
import { EventEmitter } from "events";

export function emitter(type: "global" | "new" = "global") {
    return function (target: any, key: string | symbol) {
        Object.defineProperty(target, key, {
            value: type === "global" ? eventEmitter : new EventEmitter(),
        });
    };
}
