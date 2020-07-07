import { Request, Response } from "express";
import {
    errorParser,
    userService,
    metadataService,
    courseService,
    schoolService,
    chatService,
} from "../../services";
import { configureUsersQuery } from "../../helpers/user.helpers";
import { Types } from "mongoose";
import { IUser, IStudent, IInstructor, ISchoolOfficial } from "../../types";

const { ObjectId } = Types;

export async function getUsers(req: Request, res: Response) {
    try {
        const { limit, skip, sort, role, where } = configureUsersQuery(
            req.query
        );
        const users: IUser[] = await userService.findUsers(where, {
            limit,
            skip,
            sort,
            role,
        });
        res.json({
            message: "Users successfully found",
            data: users,
        });
    } catch (e) {
        res.status(errorParser.status(e)).json(errorParser.json(e));
    }
}

export async function getUserById(req: Request, res: Response) {
    try {
        const id = ObjectId(req.params.id);
        const user: IUser = await userService.findUserById(id);

        res.json({
            message: "User successfully fetched",
            data: user,
        });
    } catch (e) {
        res.status(errorParser.status(e)).json(errorParser.json(e));
    }
}

export async function updateUserById(req: Request, res: Response) {
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
        res.status(errorParser.status(e)).json(errorParser.json(e));
    }
}

export async function deleteUserById(req: Request, res: Response) {
    try {
        const id = ObjectId(req.params.id);
        const deletedUser: IUser = await userService.deleteUserById(id);

        await metadataService.handleDeletedUserMetadataUpdate(deletedUser);
        res.json({
            message: "User successfully deleted",
            data: deletedUser,
        });
    } catch (e) {
        res.status(errorParser.status(e)).json(errorParser.json(e));
    }
}

export async function getUserCoursesById(req: Request, res: Response) {
    try {
        const user: IUser = await userService.findUserById(
            ObjectId(req.params.id)
        );
        const courseIds = (user as IStudent | IInstructor).meta.courses;
        const courses = await courseService.findCoursesByIds(courseIds);

        res.json({
            message: "User courses successfully fetched",
            data: courses,
        });
    } catch (e) {
        res.status(errorParser.status(e)).json(errorParser.json(e));
    }
}

export async function getUserSchoolById(req: Request, res: Response) {
    try {
        const user: IUser = await userService.findUserById(
            ObjectId(req.params.id)
        );

        const schoolId = (user as IStudent | ISchoolOfficial).meta.school;
        const school = await schoolService.findSchoolById(schoolId);

        res.json({
            message: "User courses successfully fetched",
            data: school,
        });
    } catch (e) {
        res.status(errorParser.status(e)).json(errorParser.json(e));
    }
}

export async function getUserChatsById(req: Request, res: Response) {
    try {
        const user: IUser = await userService.findUserById(
            ObjectId(req.params.id)
        );
        const chatIds = user.meta.chats;
        const chats = await chatService.findChatsByIds(chatIds);

        res.json({
            message: "User chats successfuly fetched",
            data: chats,
        });
    } catch (e) {
        res.status(errorParser.status(e)).json(errorParser.json(e));
    }
}
