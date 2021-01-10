import { Model, Types } from "mongoose";
import { inject, injectable } from "inversify";
import {
    EUserRoles,
    IUser,
    IQuery,
    IFilterQuery,
    IUserService,
    ILocationService,
    ISchoolService,
    IErrorService,
    EErrorTypes,
    IUpdateQuery,
} from "../types";
import { SERVICE } from "../constants/service.constants";
import { Instructor, SchoolOfficial, Student, User } from "../models";
import { isValidUserRole } from "../helpers";

@injectable()
class UserService implements IUserService {
    private model = User;
    constructor(
        @inject(SERVICE.LOCATION_SERVICE)
        protected locationService: ILocationService,
        @inject(SERVICE.SCHOOL_SERVICE) protected schoolService: ISchoolService,
        @inject(SERVICE.ERROR_SERVICE) protected errorService: IErrorService
    ) {}

    private getUserModelByRole(role: EUserRoles): Model<IUser> {
        if (!isValidUserRole(role))
            this.errorService.throwError(
                EErrorTypes.BAD_REQUEST,
                `${role} isn't a valid user role`
            );
        switch (role) {
            case EUserRoles.STUDENT:
                return Student as Model<IUser>;
            case EUserRoles.SCHOOL_OFFICIAL:
                return SchoolOfficial as Model<IUser>;
            case EUserRoles.INSTRUCTOR:
                return Instructor as Model<IUser>;
        }
    }

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
                  await this.schoolService.findSchoolByNcesId(
                      userData.meta.school
                  )
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

        return await this.model.aggregate(aggregateOptions);
    }

    async findUsers(query: IQuery<IUser>): Promise<IUser[]> {
        return await this.model
            .find(query.filter)
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
        return await this.model.findOne(filter);
    }

    async findUserById(id: Types.ObjectId): Promise<IUser> {
        return await this.model.findById(id);
    }

    async findUserByEmail(email: string): Promise<IUser> {
        return await this.findUser({ email });
    }

    async updateUser(
        filter: IFilterQuery<IUser>,
        userData: IUpdateQuery<IUser>
    ): Promise<IUser> {
        return await this.model.findOneAndUpdate(filter, userData, {
            new: true,
            runValidators: true,
        });
    }

    async updateUserById(
        userId: Types.ObjectId,
        userData: IUpdateQuery<IUser>
    ): Promise<IUser> {
        return await this.updateUser({ _id: userId }, userData);
    }

    async deleteUser(where: IQuery<IUser>): Promise<IUser> {
        return await this.model.findOneAndDelete(where);
    }

    async deleteUserById(id: Types.ObjectId): Promise<IUser> {
        return await this.model.findByIdAndDelete(id);
    }

    async updateUserLocationByZip(
        userId: Types.ObjectId,
        zip: string
    ): Promise<IUser> {
        const location = await this.locationService.findLocationByZip(zip);
        return await this.model.findByIdAndUpdate(
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

export default UserService;
