import { injectable } from "inversify";
import { Model, Document, Types } from "mongoose";
import { container, mailClient } from "../config";
import { model } from "../decorators";
import { EModels, IMailingListService, IQuery } from "../types";

@injectable()
class MailingListService implements IMailingListService {
    @model(EModels.MAILING_LIST_SUBSCRIBER)
    private Subscriber: Model<Document>;

    async findSubscribers(query: IQuery<any> = { filter: {} }): Promise<any[]> {
        return await this.Subscriber.find(query.filter)
            .sort(query.sort)
            .skip(query.skip || 0)
            .limit(query.limit ? Math.min(query.limit, 20) : 20);
    }

    async findSubscriberByEmail(email: string) {
        return await this.Subscriber.findOne({ email });
    }

    async findSubscriberById(id: Types.ObjectId) {
        return await this.Subscriber.findById(id);
    }

    async createSubscriber(subscriberData: any) {
        return await this.Subscriber.create(subscriberData);
    }

    async deleteSubscriberById(id: Types.ObjectId) {
        return await this.Subscriber.findByIdAndDelete(id);
    }

    async deleteSubscriberByEmail(email: string) {
        return await this.Subscriber.findOneAndDelete({ email });
    }

    async sendEmail(emailData: any) {
        return await mailClient.messages().send(emailData);
    }
}

container.bind<MailingListService>(MailingListService).toSelf();

export default MailingListService;
