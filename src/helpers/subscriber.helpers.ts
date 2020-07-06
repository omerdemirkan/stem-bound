import { eventEmitter } from "../config";
import { IEventEmitterOnFunction } from "../types";

// I decided against importing eventEmitter directly and executing using a blank import because
// this approach doesn't allow for injecting a listener creator and doesn't give fine-grain control over
// event initialization. On the other hand, I decided to use a simple initializing function with state avoiding reinitialization
// rather than using classes and decorators, which I believe is an antipattern in this context.

// Passing the on function alone to subscribers without binding to the event emitter causes an error.
const on = eventEmitter.on.bind(eventEmitter);

export function Subscriber(initialize: (on: IEventEmitterOnFunction) => void) {
    this.initialized = false;
    this.initialize = function (): void {
        if (!this.initialized) {
            initialize.call(this, on);
            this.initialized = true;
        }
    };
}
