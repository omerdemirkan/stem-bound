import { Container } from 'typedi';
import { EventEmitter } from 'events';
import models from '../models'

export default function() {
    Container.set('eventEmitter', new EventEmitter());
    
    Object.keys(models).forEach(function(modelName: string) {
        Container.set(modelName, (models as any)[modelName]);
    });
}