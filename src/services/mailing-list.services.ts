import { Model, Document, Types } from "mongoose";
import { mailgun } from "../config";

export default class MailingListService {
    constructor(private Subscribers: Model<Document>) {}

    async getSubscriberByEmail(email: string) {
        return await this.Subscribers.findOne({ email });
    }

    async getSubscriberById(id: Types.ObjectId) {
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
