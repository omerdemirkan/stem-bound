import {
    EUserRoles,
    IUser,
    EModels,
    IInstructor,
    IStudent,
    ISchoolOfficial,
    IUserQueryOptions,
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

    async createUser(userData, role: EUserRoles): Promise<IUser> {
        if ((userData as any).password)
            throw new Error("We don't store passwords around here kiddo");

        userData.location = ((await this.locationService.findLocationByZip(
            (userData as any).zip
        )) as any)._doc;
        return await this.getUserModelByRole(role).create(userData);
    }

    async findUsersByCoordinates(
        coordinates: number[],
        options: IUserQueryOptions
    ) {
        let aggregateOptions: any[] = [];

        console.log(options.excludedUserIds);
        if (options.excludedUserIds) {
            aggregateOptions.push({
                $match: { _id: { $nin: options.excludedUserIds } },
            });
        }

        aggregateOptions.push({
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates,
                },
                distanceField: "distance.calculated",
                key: "location.geoJSON",
            },
        });

        if (options?.where && Object.keys(options.where).length) {
            (aggregateOptions[0].$geoNear as any).query = options.where;
        }

        if (options?.text) {
            aggregateOptions.push({ $text: { $search: options.text } });
        }

        aggregateOptions.push({ $skip: options.skip || 0 });

        aggregateOptions.push(
            options?.limit
                ? { $limit: options.limit > 50 ? 50 : options.limit }
                : { $limit: 20 }
        );

        let model = options?.role
            ? this.getUserModelByRole(options.role)
            : this.User;

        return await model.aggregate(aggregateOptions);
    }

    async findUsers(options: IUserQueryOptions): Promise<IUser[]> {
        if (options?.coordinates) {
            return await this.findUsersByCoordinates(
                options.coordinates,
                options
            );
        }

        const model = options.role
            ? this.getUserModelByRole(options.role)
            : this.User;
        let where: any = {};

        if (options.text) {
            where.$text = { $search: options.text };
        }

        if (options.excludedUserIds) {
            where._id = {
                $nin: options.excludedUserIds,
            };
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

    async updateUser(where: object, userData: object): Promise<IUser> {
        const user = await this.findUser(where);
        Object.assign(user, userData);

        // @ts-ignore
        return await user.save();
    }

    async updateUserById({
        id,
        userData,
    }: {
        id: Types.ObjectId;
        userData: object;
    }): Promise<IUser> {
        return await this.updateUser({ _id: id }, userData);
    }

    async deleteUser(where: any): Promise<IUser> {
        return await this.User.findOneAndDelete(where);
    }

    async deleteUserById(id: Types.ObjectId): Promise<IUser> {
        return await this.User.findByIdAndDelete(id);
    }

    async updateUserProfilePictureUrl(
        userId: Types.ObjectId,
        profilePictureUrl: string
    ): Promise<IUser> {
        const user = await this.findUserById(userId);

        user.profilePictureUrl = profilePictureUrl;
        // @ts-ignore
        return await user.save();
    }

    async updateUserLocationByZip(
        userId: Types.ObjectId,
        zip: string
    ): Promise<IUser> {
        const location = await this.locationService.findLocationByZip(zip);
        return await this.User.findByIdAndUpdate(
            userId,
            {
                $set: { location },
            },
            { new: true }
        );
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

    async addChatMetadata(
        {
            userIds,
            chatIds,
        }: {
            userIds: Types.ObjectId[];
            chatIds: Types.ObjectId[];
        },
        options?: {
            roles?: EUserRoles[];
        }
    ): Promise<void> {
        let roles = options?.roles || Object.values(EUserRoles);
        await Promise.all(
            roles.map((role: EUserRoles) => {
                return this.getUserModelByRole(role).updateMany(
                    { _id: { $in: userIds } },
                    { $addToSet: { "meta.chats": { $each: chatIds } } }
                );
            })
        );
    }

    async removeChatMetadata(
        {
            userIds,
            chatIds,
        }: {
            userIds: Types.ObjectId[];
            chatIds: Types.ObjectId[];
        },
        options?: {
            roles?: EUserRoles[];
        }
    ): Promise<void> {
        const roles = options?.roles || Object.values(EUserRoles);
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
