import { Container } from 'typedi';

import { events } from '../config/constants';
import { EventEmitter } from 'events';

function initialize() {
    const eventEmitter: EventEmitter = Container.get('eventEmitter');

    eventEmitter.on(events.user.USER_SIGNUP, function() {
        console.log('inside eventEmitter listening to user signup');
    });
}

export default {
    initialize
}

