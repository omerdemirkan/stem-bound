import { MongooseFilterQuery } from "mongoose";

export type IQuery<T> = MongooseFilterQuery<Pick<T, keyof T>>;
