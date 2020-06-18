import { EventEmitter } from 'events';
import { 
    Subscriber, 
    EUserEvents 
} from '../types';
import { 
    eventEmitter 
} from '../services'

export default new Subscriber(function() {
    
    eventEmitter.on(EUserEvents.USER_SIGNUP, function({ role, user }) {
        console.log(`User of type ${role} signed up\n${user}`); 
    });
});

