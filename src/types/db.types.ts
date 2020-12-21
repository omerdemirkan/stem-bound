import { DocumentQuery, MongooseFilterQuery, Document } from "mongoose";

export type IFilterQuery<T extends Document> = MongooseFilterQuery<
    Pick<T, keyof T>
>;

export interface IQuery<T extends Document> {
    filter?: IFilterQuery<T>;
    sort?: DocumentQuery<T[], T, {}>;
    limit?: number;
    skip?: number;
}
