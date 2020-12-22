import {
    DocumentQuery,
    MongooseFilterQuery,
    Document,
    MongooseUpdateQuery,
} from "mongoose";

export type IFilterQuery<T extends Document> = MongooseFilterQuery<
    Pick<T, keyof T>
>;

export type IUpdateQuery<T extends Document> = MongooseUpdateQuery<T>;
export type ISortQuery<T extends Document> = DocumentQuery<T[], T, {}>;

export interface IQuery<T extends Document> {
    filter: IFilterQuery<T>;
    sort?: ISortQuery<T>;
    update?: IUpdateQuery<T>;
    limit?: number;
    skip?: number;
}

export interface ISubDocumentQuery<T> {
    filter?(element: T): boolean;
    sort?(a: T, b: T): number;
    limit?: number;
    skip?: number;
    before?: Date | string;
    after?: Date | string;
}
