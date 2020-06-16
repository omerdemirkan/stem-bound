import express, { Application } from 'express';
import config from './config';
import loaders from './loaders';
import { EventEmitter } from 'events';

const eventEmitter = new EventEmitter;

const app: Application = express();

(async function() {
    
    await loaders({app});
    await app.listen(config.port);
    console.log('Server running on port ' + config.port);
    
    eventEmitter.emit('SERVER_RUNNING')
})()

export default new Promise(function(resolve) {
    eventEmitter.on('SERVER_RUNNING', () => resolve(app))
});