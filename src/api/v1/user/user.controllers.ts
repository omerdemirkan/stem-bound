import { Request, Response, json } from "express";
import {
    errorService,
    userService,
    metadataService,
    courseService,
    schoolService,
    chatService,
} from "../../../services";
import { configureUsersQuery } from "../../../helpers/user.helpers";
import { Types } from "mongoose";
import {
    IUser,
    IStudent,
    IInstructor,
    ISchoolOfficial,
    ICourse,
    IUserQueryOptions,
    IChat,
    EErrorTypes,
} from "../../../types";
import { configureChatArrayResponseData } from "../../../helpers/chat.helpers";
import { configureCourseArrayResponseData } from "../../../helpers";
import { saveFileToBucket } from "../../../jobs";

const { ObjectId } = Types;

export async function getUsers(req: Request, res: Response) {
    try {
        const query: IUserQueryOptions = configureUsersQuery(req.query, req.ip);
        let users: IUser[] = await userService.findUsers(query);
        res.json({
            message: "Users successfully found",
            data: users,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function getUser(req: Request, res: Response) {
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
            data: user,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function updateUser(req: Request, res: Response) {
    try {
        const id = ObjectId(req.params.id);
        const updatedUser: IUser = await userService.updateUserById({
            id,
            userData: req.body,
        });

        res.json({
            message: "User successfully updated",
            data: updatedUser,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function deleteUser(req: Request, res: Response) {
    try {
        const id = ObjectId(req.params.id);
        const deletedUser: IUser = await userService.deleteUserById(id);

        await metadataService.handleDeletedUserMetadataUpdate(deletedUser);
        res.json({
            message: "User successfully deleted",
            data: deletedUser,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function getUserCourses(req: Request, res: Response) {
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
        const courseIds = (user as IStudent | IInstructor).meta.courses;
        const courses: ICourse[] = courseIds.length
            ? await courseService.findCoursesByIds(courseIds)
            : [];

        res.json({
            message: "User courses successfully fetched",
            data: configureCourseArrayResponseData(courses, {
                query: req.query,
                payload: (req as any).payload,
            }),
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function getUserSchool(req: Request, res: Response) {
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
        const school = await schoolService.findSchoolById(schoolId);

        res.json({
            message: "User courses successfully fetched",
            data: school,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function getUserChats(req: Request, res: Response) {
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
        const chatIds = user.meta.chats;
        const chats: IChat[] = chatIds.length
            ? await chatService.findChatsByIds(chatIds, {
                  sort: { updatedAt: -1 },
              })
            : [];

        res.json({
            message: "User chats successfuly fetched",
            data: configureChatArrayResponseData(chats, {
                query: req.query,
                payload: (req as any).payload,
            }),
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}

export async function saveUserProfilePicture(req: Request, res: Response) {
    try {
        const file: any = req.files.file;
        console.log(file);
        const profilePictureUrl = await saveFileToBucket(file);

        await userService.updateUserProfilePictureUrl(
            ObjectId(req.params.id),
            profilePictureUrl
        );

        res.json({
            data: {
                profilePictureUrl,
            },
            message: "User profile picture successfully updated",
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}
