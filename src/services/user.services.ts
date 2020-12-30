import { Model, Types } from "mongoose";
import { LocationService, SchoolService } from ".";
import { model } from "../decorators";
import { injectable } from "inversify";
import { container } from "../config";
import {
    EUserRoles,
    IUser,
    EModels,
    IInstructor,
    IStudent,
    ISchoolOfficial,
    IQuery,
    IFilterQuery,
    IUserService,
} from "../types";

@injectable()
class UserService implements IUserService {
    @model(EModels.USER)
    private User: Model<IUser>;

    @model(EModels.INSTRUCTOR)
    private Instructor: Model<IInstructor>;
    @model(EModels.SCHOOL_OFFICIAL)
    private SchoolOfficial: Model<ISchoolOfficial>;
    @model(EModels.STUDENT)
    private Student: Model<IStudent>;

    private getUserModelByRole(role: EUserRoles): Model<IUser> {
        switch (role) {
            case EUserRoles.STUDENT:
                return this.Student;
            case EUserRoles.SCHOOL_OFFICIAL:
                return this.SchoolOfficial;
            case EUserRoles.INSTRUCTOR:
                return this.Instructor;
        }
    }

    constructor(
        private locationService: LocationService,
        private schoolService: SchoolService
    ) {}

    async createUser(userData, role: EUserRoles): Promise<IUser> {
        if ((userData as any).password)
            throw new Error(
                "We don't store plaintext passwords around here kiddo"
            );

        userData.location = (userData as any).zip
            ? (
                  await this.locationService.findLocationByZip(
                      (userData as any).zip
                  )
              ).toObject()
            : (
                  await this.schoolService.findSchoolById(userData.meta.school)
              ).toObject().location;
        return await this.getUserModelByRole(role).create(userData);
    }

    async findUsersByCoordinates(
        coordinates: number[],
        query: IQuery<IUser> = { filter: {} }
    ) {
        let aggregateOptions: any[] = [];

        aggregateOptions.push({
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates,
                },
                distanceField: "distance.calculated",
                key: "location.geoJSON",
                query: query.filter,
            },
        });

        aggregateOptions.push({ $skip: query.skip || 0 });

        aggregateOptions.push({
            $limit: query.limit ? (query.limit > 50 ? 50 : query.limit) : 20,
        });

        return await this.User.aggregate(aggregateOptions);
    }

    async findUsers(query: IQuery<IUser>): Promise<IUser[]> {
        return await this.User.find(query.filter)
            .sort(query.sort)
            .skip(query.skip || 0)
            .limit(Math.min(query.limit, 20));
    }

    async findUsersByIds(
        ids: Types.ObjectId[],
        query: IQuery<IUser> = { filter: {} }
    ): Promise<IUser[]> {
        query.filter._id = { $in: ids };
        return await this.findUsers(query);
    }

    async findUser(filter: IFilterQuery<IUser>): Promise<IUser> {
        return await this.User.findOne(filter);
    }

    async findUserById(id: Types.ObjectId): Promise<IUser> {
        return await this.User.findById(id);
    }

    async findUserByEmail(email: string): Promise<IUser> {
        return await this.findUser({ email });
    }

    async updateUser(
        filter: IFilterQuery<IUser>,
        userData: Partial<IUser>
    ): Promise<IUser> {
        return await this.User.findOneAndUpdate(filter, userData, {
            new: true,
            runValidators: true,
        });
    }

    async updateUserById(
        userId: Types.ObjectId,
        userData: Partial<IUser>
    ): Promise<IUser> {
        return await this.updateUser({ _id: userId }, userData);
    }

    async deleteUser(where: IQuery<IUser>): Promise<IUser> {
        return await this.User.findOneAndDelete(where);
    }

    async deleteUserById(id: Types.ObjectId): Promise<IUser> {
        return await this.User.findByIdAndDelete(id);
    }

    async updateUserProfilePictureUrl(
        userId: Types.ObjectId,
        profilePictureUrl: string
    ): Promise<IUser> {
        return await this.updateUserById(userId, { profilePictureUrl });
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

container.bind<UserService>(UserService).toSelf();

export default UserService;
