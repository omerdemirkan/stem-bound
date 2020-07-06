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

const { ObjectId } = Types;

export async function getUsers(req: Request, res: Response) {
    try {
        const { limit, skip, sort, role, where } = configureUsersQuery(
            req.query
        ) as any;
        const users = await userService.findUsers(where, {
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
        const user = await userService.findUserById(id);

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
        const user = await userService.updateUserById({
            id,
            userData: req.body,
        });

        res.json({
            message: "User successfully updated",
            data: user,
        });
    } catch (e) {
        res.status(errorParser.status(e)).json(errorParser.json(e));
    }
}

export async function deleteUserById(req: Request, res: Response) {
    try {
        const id = ObjectId(req.params.id);
        const user = await userService.deleteUserById(id);

        await metadataService.handleDeletedUserMetadataUpdate(user);
        res.json({
            message: "User successfully deleted",
            data: user,
        });
    } catch (e) {
        res.status(errorParser.status(e)).json(errorParser.json(e));
    }
}

export async function getUserCoursesById(req: Request, res: Response) {
    try {
        const student: any = await userService.findUserById(
            ObjectId(req.params.id)
        );
        const courseIds = student.meta.courses.map((id: string) =>
            ObjectId(id)
        );
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
        const user: any = await userService.findUserById(
            ObjectId(req.params.id)
        );

        const schoolId = ObjectId(user.meta.school);
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
        const user: any = await userService.findUserById(
            ObjectId(req.params.id)
        );
        const chatIds = user.meta.chats.map((chatId) => ObjectId(chatId));
        const chats = chatService.findChatsByIds(chatIds);

        res.json({
            message: "User chats successfuly fetched",
            data: chats,
        });
    } catch (e) {
        res.status(errorParser.status(e)).json(errorParser.json(e));
    }
}
