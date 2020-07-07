import { EUserRoles, IUser } from "../types";
import { Model, Document, Types } from "mongoose";

const { ObjectId } = Types;

export default class UserService {
    constructor(
        private getUserModelByRole: (role: EUserRoles) => Model<IUser>,
        private Users: Model<IUser>
    ) {}

    async createUser({
        role,
        userData,
    }: {
        role: EUserRoles;
        userData: IUser;
    }): Promise<IUser> {
        if ((userData as any).password)
            throw new Error("We don't store passwords around here kiddo");
        return await this.getUserModelByRole(role).create(userData);
    }

    async findUsers(
        where: object,
        options: {
            role?: EUserRoles;
            limit?: number;
            skip?: number;
            sort?: object;
        }
    ): Promise<IUser[]> {
        let model = options.role
            ? this.getUserModelByRole(options.role)
            : this.Users;

        return await model
            .find(where || {})
            .sort(options.sort)
            .skip(options.skip || 0)
            .limit(
                typeof options.limit === "number" && options.limit < 20
                    ? options.limit
                    : 20
            );
    }

    async findUsersByIds(ids: Types.ObjectId[]): Promise<IUser[]> {
        return await this.Users.find({ _id: { $in: ids } });
    }

    async findUser(where: object): Promise<IUser> {
        return await this.Users.findOne(where);
    }

    async findUserById(id: Types.ObjectId): Promise<IUser> {
        return await this.Users.findById(id);
    }

    async findUserByEmail(email: string): Promise<IUser> {
        return await this.findUser({ email });
    }

    async updateUser({
        where,
        userData,
    }: {
        where: object;
        userData: object;
    }): Promise<IUser> {
        return await this.Users.findOneAndUpdate(where, userData, {
            new: true,
        });
    }

    async updateUserById({
        id,
        userData,
    }: {
        id: Types.ObjectId;
        userData: object;
    }): Promise<IUser> {
        return await this.Users.findByIdAndUpdate(id, userData, { new: true });
    }

    async deleteUser(where: {
        role: EUserRoles;
        where: object;
    }): Promise<IUser> {
        return await this.Users.findOneAndDelete(where);
    }

    async deleteUserById(id: Types.ObjectId): Promise<IUser> {
        return await this.Users.findByIdAndDelete(id);
    }

    async addCourseMetadata({
        userIds,
        courseIds,
        roles,
    }: {
        userIds: Types.ObjectId[];
        courseIds: Types.ObjectId[];
        roles: EUserRoles[];
    }): Promise<void> {
        // Because User meta schemas are determined by the discriminator (roles).
        // I decided against one metadata schema model with everything uptional because
        // default values (empty arrays) have to be set before mongodb is able to push to it.
        // I'm afraid setting default values for all user types will lead to a jumbled mess
        // with metadata that doesn't make sense and shouldn't exist.
        await Promise.all(
            roles.map((role: EUserRoles) => {
                return this.getUserModelByRole(role).updateMany(
                    {
                        _id: { $in: userIds },
                    },
                    {
                        $push: { "meta.courses": { $each: courseIds } },
                    }
                );
            })
        );
    }

    async removeCourseMetadata({
        userIds,
        courseIds,
        roles,
    }: {
        userIds: Types.ObjectId[];
        courseIds: Types.ObjectId[];
        roles: EUserRoles[];
    }): Promise<void> {
        await Promise.all(
            roles.map((role: EUserRoles) => {
                return this.getUserModelByRole(role).updateMany(
                    {
                        _id: { $in: userIds },
                    },
                    {
                        $pullAll: { "meta.courses": courseIds },
                    }
                );
            })
        );
    }

    async addChatMetadata({
        userIds,
        chatIds,
        roles,
    }: {
        userIds: Types.ObjectId[];
        chatIds: Types.ObjectId[];
        roles?: EUserRoles[];
    }): Promise<void> {
        roles = roles || Object.values(EUserRoles);
        await Promise.all(
            roles.map((role: EUserRoles) => {
                return this.getUserModelByRole(role).updateMany(
                    { _id: { $in: userIds } },
                    { $push: { "meta.chats": { $each: chatIds } } }
                );
            })
        );
    }

    async removeChatMetadata({
        userIds,
        chatIds,
        roles,
    }: {
        userIds: Types.ObjectId[];
        chatIds: Types.ObjectId[];
        roles?: EUserRoles[];
    }): Promise<void> {
        roles = roles || Object.values(EUserRoles);
        await Promise.all(
            roles.map((role: EUserRoles) => {
                return this.getUserModelByRole(role).updateMany(
                    { _id: { $in: userIds } },
                    { $pullAll: { "meta.chats": chatIds } }
                );
            })
        );
    }
}
