import { Request, Response } from "express";
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
    IUserQuery,
    ITokenPayload,
} from "../../../types";
import { IChat } from "../../../types/chat.types";
import { EErrorTypes } from "../../../types/error.types";
import { configureChatResponseData } from "../../../helpers/chat.helpers";

const { ObjectId } = Types;

export async function getUsers(req: Request, res: Response) {
    try {
        const query: IUserQuery = configureUsersQuery(req.query, req.ip);
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
            errorService.throwError(EErrorTypes.DOCUMENT_NOT_FOUND);
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
            errorService.throwError(EErrorTypes.DOCUMENT_NOT_FOUND);
        }
        const courseIds = (user as IStudent | IInstructor).meta.courses;
        const courses: ICourse[] = courseIds.length
            ? await courseService.findCoursesByIds(courseIds)
            : [];

        res.json({
            message: "User courses successfully fetched",
            data: courses,
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
            errorService.throwError(EErrorTypes.DOCUMENT_NOT_FOUND);
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
            errorService.throwError(EErrorTypes.DOCUMENT_NOT_FOUND);
        }
        const chatIds = user.meta.chats;
        const chats: IChat[] = chatIds.length
            ? await chatService.findChatsByIds({
                  ids: chatIds,
                  sort: { updatedAt: -1 },
              })
            : [];

        const configuredChats = configureChatResponseData({
            userId: user._id,
            chats: chats,
            requestQuery: req.query,
        });

        res.json({
            message: "User chats successfuly fetched",
            data: configuredChats,
        });
    } catch (e) {
        res.status(errorService.status(e)).json(errorService.json(e));
    }
}
