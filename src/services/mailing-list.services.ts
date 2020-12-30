import { injectable } from "inversify";
import { Types } from "mongoose";
import { mailClient } from "../config";
import { MailingListSubscriber } from "../models";
import { IMailingListService, IQuery } from "../types";

@injectable()
class MailingListService implements IMailingListService {
    private model = MailingListSubscriber;

    async findSubscribers(query: IQuery<any> = { filter: {} }): Promise<any[]> {
        return await this.model
            .find(query.filter)
            .sort(query.sort)
            .skip(query.skip || 0)
            .limit(query.limit ? Math.min(query.limit, 20) : 20);
    }

    async findSubscriberByEmail(email: string) {
        return await this.model.findOne({ email });
    }

    async findSubscriberById(id: Types.ObjectId) {
        return await this.model.findById(id);
    }

    async createSubscriber(subscriberData: any) {
        return await this.model.create(subscriberData);
    }

    async deleteSubscriberById(id: Types.ObjectId) {
        return await this.model.findByIdAndDelete(id);
    }

    async deleteSubscriberByEmail(email: string) {
        return await this.model.findOneAndDelete({ email });
    }

    async sendEmail(emailData: any) {
        return await mailClient.messages().send(emailData);
    }
}

export default MailingListService;
