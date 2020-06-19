import { Request, Response } from "express";
import { errorParser, userService } from "../../services";
import { EUserRoles } from "../../types";
import { configureUsersQuery, toUserRole } from "../../helpers/user.helpers";
import { Types } from "mongoose";

const { ObjectId } = Types;

export async function getUsers(req: Request, res: Response) {
    try {
        const users = await userService.findUser(
            configureUsersQuery(req.query) as any
        );
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

        res.json({
            message: "User successfully deleted",
            data: user,
        });
    } catch (e) {
        res.status(errorParser.status(e)).json(errorParser.json(e));
    }
}
