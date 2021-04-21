import { Response } from "express";
import {
    errorService,
    userService,
    metadataService,
    courseService,
    schoolService,
    chatService,
    storageService,
} from "../../../services";
import {
    configureUserArrayQuery,
    configureUserArrayResponseData,
    configureUserResponseData,
    configureChatArrayResponseData,
} from "../../../helpers";
import { Types } from "mongoose";
import {
    IUser,
    IStudent,
    ISchoolOfficial,
    ICourse,
    EErrorTypes,
    IModifiedRequest,
    EUserRoles,
} from "../../../types";
import {
    configureCourseArrayQuery,
    configureCourseArrayResponseData,
} from "../../../helpers";

const { ObjectId } = Types;

export async function getUsers(req: IModifiedRequest, res: Response) {
    try {
        const { query, coordinates } = configureUserArrayQuery(req.meta);
        let users: IUser[];
        if (coordinates)
            users = await userService.findUsersByCoordinates(
                coordinates,
                query
            );
        else users = await userService.findUsers(query);
        res.json({
            message: "Users successfully found",
            data: configureUserArrayResponseData(users, req.meta),
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function getUser(req: IModifiedRequest, res: Response) {
    try {
        const id = ObjectId(req.params.id);
        const user: IUser = await userService.findUserById(id);
        if (!user) {
            errorService.throwError(
                EErrorTypes.DOCUMENT_NOT_FOUND,
                "User not found"
            );
        }

        res.json({
            message: "User successfully fetched",
            data: configureUserResponseData(user, req.meta),
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function updateUser(req: IModifiedRequest, res: Response) {
    try {
        const userId = ObjectId(req.params.id);
        const updatedUser: IUser = await userService.updateUserFieldsById(
            userId,
            req.body
        );

        res.json({
            message: "User successfully updated",
            data: configureUserResponseData(updatedUser, req.meta),
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function deleteUser(req: IModifiedRequest, res: Response) {
    try {
        const deletedUser: IUser = await userService.deleteUserById(
            ObjectId(req.params.id)
        );

        await metadataService.handleDeletedUserMetadataUpdate(deletedUser);
        res.json({
            message: "User successfully deleted",
            data: configureUserResponseData(deletedUser, req.meta),
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function getUserCourses(req: IModifiedRequest, res: Response) {
    try {
        const userId = ObjectId(req.params.id);
        const query = configureCourseArrayQuery(req.meta);
        let courses: ICourse[];
        switch (req.payload.user.role) {
            case EUserRoles.INSTRUCTOR:
                courses = await courseService.findCoursesByInstructorId(
                    userId,
                    query
                );
                break;
            case EUserRoles.STUDENT:
                courses = await courseService.findCoursesByStudentId(
                    userId,
                    query
                );
                break;
        }

        res.json({
            message: "User courses successfully fetched",
            data: configureCourseArrayResponseData(courses, req.meta),
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function getUserSchool(req: IModifiedRequest, res: Response) {
    try {
        const user: IUser = await userService.findUserById(
            ObjectId(req.params.id)
        );
        if (!user) {
            errorService.throwError(
                EErrorTypes.DOCUMENT_NOT_FOUND,
                "User not found"
            );
        }
        const schoolId = (user as IStudent | ISchoolOfficial).meta.school;
        const school = await schoolService.findSchoolByNcesId(schoolId);

        res.json({
            message: "User courses successfully fetched",
            data: school,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function getUserChats(req: IModifiedRequest, res: Response) {
    try {
        const userId = ObjectId(req.params.id);
        const chats = await chatService.findChatsByUserId(userId);

        res.json({
            message: "User chats successfuly fetched",
            data: configureChatArrayResponseData(chats, req),
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function updateUserProfilePicture(
    req: IModifiedRequest,
    res: Response
) {
    try {
        const file: any = req.files.file;
        const profilePictureUrl = await storageService.saveFileToBucket(file);

        const user = await userService.updateUserById(ObjectId(req.params.id), {
            profilePictureUrl,
        });

        res.json({
            data: configureUserResponseData(user, req.meta),
            message: "User profile picture successfully updated",
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function updateUserLocation(req: IModifiedRequest, res: Response) {
    try {
        const userId = ObjectId(req.params.id);
        const updatedUser = await userService.updateUserLocationByZip(
            userId,
            req.body.zip as string
        );

        res.json({
            message: "User location successfully updated",
            data: configureUserResponseData(updatedUser, req.meta),
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function countUsers(req: IModifiedRequest, res: Response) {
    try {
        const { query } = configureUserArrayQuery(req.meta);
        const numUsers = await userService.countUsers(query.filter);
        res.json({
            message: "Users successfully counted",
            data: numUsers,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}
