import { eventEmitter } from "../config";
import { IEventEmitterOnFunction } from "../types";

// Passing the on function alone to subscribers without binding to the event emitter causes an error.
const on = eventEmitter.on.bind(eventEmitter);

export class Subscriber {
    private initialized = false;
    public initialize: (...args) => any;
    constructor(initialize: (on: IEventEmitterOnFunction) => void) {
        // To ensure one initialization
        this.initialize = function () {
            if (!this.initialized) {
                initialize.call(this, on);
                this.initialized = true;
            }
        };
    }
}
