import { MongooseFilterQuery } from "mongoose";

export type IFindQuery<T> = MongooseFilterQuery<Pick<T, keyof T>>;
