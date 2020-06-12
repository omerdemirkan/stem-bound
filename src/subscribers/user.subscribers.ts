import { Container } from 'typedi';

import { events } from '../config/constants.config';
import { EventEmitter } from 'events';
import { Subscriber } from '../config/types.config';

export default new Subscriber(function() {
    const eventEmitter: EventEmitter = Container.get(EventEmitter);

    eventEmitter.on(events.user.USER_SIGNUP, function({ role, user }) {
        console.log(`User of type ${role} signed up`);
    });
});

