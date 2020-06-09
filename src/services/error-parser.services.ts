import { Service } from 'typedi';

@Service()
export default class ErrorParserService {
    status(error: Error) {
        console.log(error);
        return 400;
    }
    
    json(error: Error) {
        return {
            message: error.message
        }
    }
}

