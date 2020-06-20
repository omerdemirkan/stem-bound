import { EUserRoles } from "../types";
import { Model, Document, Types } from "mongoose";

export default class UserService {
    constructor(
        private getUserModelByRole: (role: EUserRoles) => Model<Document>,
        private Users: Model<Document>
    ) {}

    async createUser({
        role,
        userData,
    }: {
        role: EUserRoles;
        userData: object;
    }) {
        return this.getUserModelByRole(role).create(userData);
    }

    async findUsers({
        role,
        where,
        limit,
        skip,
        sort,
    }: {
        role?: EUserRoles;
        where?: object;
        limit?: number;
        skip?: number;
        sort?: object;
    }) {
        let model = role ? this.getUserModelByRole(role) : this.Users;

        return await model
            .find(where || {})
            .sort(sort)
            .skip(skip || 0)
            .limit(typeof limit === "number" && limit < 20 ? limit : 20);
    }

    async findUser(where: object) {
        return await this.Users.findOne(where);
    }

    async findUserById(id: Types.ObjectId) {
        return await this.Users.findById(id);
    }

    async findUserByEmail(email: string) {
        return await this.findUser({ email });
    }

    async updateUser({ where, userData }: { where: object; userData: object }) {
        return await this.Users.findOneAndUpdate(where, userData);
    }

    async updateUserById({
        id,
        userData,
    }: {
        id: Types.ObjectId;
        userData: object;
    }) {
        return await this.Users.findByIdAndUpdate(id, userData);
    }

    async deleteUser(where: { role: EUserRoles; where: object }) {
        return await this.Users.findOneAndDelete(where);
    }

    async deleteUserById(id: Types.ObjectId) {
        return await this.Users.findByIdAndDelete(id);
    }

    async addCourseMetadata({
        userIds,
        courseIds,
    }: {
        userIds: Types.ObjectId[];
        courseIds: Types.ObjectId[];
    }) {
        await this.Users.updateMany(
            { _id: { $in: userIds } },
            {
                $push: { "meta.courses": { $each: courseIds } },
            }
        );
    }

    async removeCourseMetadata({
        userIds,
        courseIds,
    }: {
        userIds: Types.ObjectId[];
        courseIds: Types.ObjectId[];
    }) {
        await this.Users.updateMany(
            { _id: { $in: userIds } },
            {
                $pull: { "meta.courses": { $each: courseIds } },
            }
        );
    }
}
