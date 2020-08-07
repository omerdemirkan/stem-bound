import {
    EUserRoles,
    IUser,
    IUserQuery,
    EModels,
    IInstructor,
    IStudent,
    ISchoolOfficial,
} from "../types";
import { Model, Types } from "mongoose";
import { LocationService } from ".";
import { model } from "../decorators";

const { ObjectId } = Types;

export default class UserService {
    @model(EModels.USER)
    private User: Model<IUser>;

    @model(EModels.INSTRUCTOR)
    private Instructor: Model<IInstructor>;
    @model(EModels.SCHOOL_OFFICIAL)
    private SchoolOfficial: Model<ISchoolOfficial>;
    @model(EModels.STUDENT)
    private Student: Model<IStudent>;

    private userModelsByRole = {
        [EUserRoles.STUDENT]: this.Student,
        [EUserRoles.INSTRUCTOR]: this.Instructor,
        [EUserRoles.SCHOOL_OFFICIAL]: this.SchoolOfficial,
    };

    private getUserModelByRole(role: EUserRoles): Model<IUser> {
        return this.userModelsByRole[role];
    }

    constructor(private locationService: LocationService) {}

    async createUser(
        userData,
        {
            role,
        }: {
            role: EUserRoles;
        }
    ): Promise<IUser> {
        if ((userData as any).password)
            throw new Error("We don't store passwords around here kiddo");

        userData.location = ((await this.locationService.findLocationByZip(
            (userData as any).zip
        )) as any)._doc;
        return await this.getUserModelByRole(role).create(userData);
    }

    async findUsersByCoordinates(
        coordinates: number[],
        { limit, where, skip, text, role }: IUserQuery
    ) {
        let aggregateOptions: any[] = [
            {
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates,
                    },
                    distanceField: "distance.calculated",
                    key: "location.geoJSON",
                },
            },
        ];
        if (where && Object.keys(where).length) {
            (aggregateOptions[0].$geoNear as any).query = where;
        }

        if (text) {
            aggregateOptions.push({ $text: { $search: text } });
        }

        aggregateOptions.push({ $skip: skip || 0 });

        aggregateOptions.push(
            limit ? { $limit: limit > 50 ? 50 : limit } : { $limit: 20 }
        );

        let model = role ? this.getUserModelByRole(role) : this.User;

        return await model.aggregate(aggregateOptions);
    }

    async findUsers({ coordinates, ...options }: IUserQuery): Promise<IUser[]> {
        if (coordinates) {
            return await this.findUsersByCoordinates(coordinates, options);
        }

        const model = options.role
            ? this.getUserModelByRole(options.role)
            : this.User;
        let where: any = {};

        if (options.text) {
            where.$text = { $search: options.text };
        }
        return await model
            .find(where)
            .sort(options.sort)
            .skip(options.skip || 0)
            .limit(Math.min(options.limit, 20));
    }

    async findUsersByIds(ids: Types.ObjectId[]): Promise<IUser[]> {
        return await this.User.find({ _id: { $in: ids } });
    }

    async findUser(where: object): Promise<IUser> {
        return await this.User.findOne(where);
    }

    async findUserById(id: Types.ObjectId): Promise<IUser> {
        return await this.User.findById(id);
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
        return await this.User.findOneAndUpdate(where, userData, {
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
        return await this.User.findByIdAndUpdate(id, userData, { new: true });
    }

    async deleteUser(where: {
        role: EUserRoles;
        where: object;
    }): Promise<IUser> {
        return await this.User.findOneAndDelete(where);
    }

    async deleteUserById(id: Types.ObjectId): Promise<IUser> {
        return await this.User.findByIdAndDelete(id);
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
                        $addToSet: { "meta.courses": { $each: courseIds } },
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
                    { $addToSet: { "meta.chats": { $each: chatIds } } }
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
