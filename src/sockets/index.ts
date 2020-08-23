export { default as initializeChatSocket } from "./chat.socket";

import initializeChatSocket from "./chat.socket";
import initializeRoomSockets from "./room.socket";
import { jwtService, userService } from "../services";
import { ITokenPayload, IUser } from "../types";
import { Types } from "mongoose";
import { eventEmitter } from "../config";
import { Server, Socket } from "socket.io";

export function init(io: Server) {
    io.on("connection", async function (socket: Socket) {
        let user: IUser;
        try {
            const accessToken = socket.request._query["authorization"];
            const payload = (await jwtService.verify(
                accessToken
            )) as ITokenPayload;
            user = await userService.findUserById(
                Types.ObjectId(payload.user._id)
            );

            initializeRoomSockets(socket, { eventEmitter, io, user });
            initializeChatSocket(socket, { eventEmitter, io, user });
        } catch (e) {
            console.log(e);
        }
    });
}
