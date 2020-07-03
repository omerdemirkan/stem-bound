import { Model, Document, Types } from "mongoose";
import { mailgun } from "../config";

export default class MailingListService {
    constructor(private Subscribers: Model<Document>) {}

    async findSubscribers(where = {}) {
        return await this.Subscribers.find(where);
    }

    async findSubscriberByEmail(email: string) {
        return await this.Subscribers.findOne({ email });
    }

    async findSubscriberById(id: Types.ObjectId) {
        return await this.Subscribers.findById(id);
    }

    async createSubscriber(subscriberData: any) {
        return await this.Subscribers.create(subscriberData);
    }

    async deleteSubscriberById(id: Types.ObjectId) {
        return await this.Subscribers.findByIdAndDelete(id);
    }

    async deleteSubscriberByEmail(email: string) {
        return await this.Subscribers.findOneAndDelete({ email });
    }

    async sendEmail(emailData: any) {
        return await mailgun.messages().send(emailData);
    }
}
