import initializeChatSocket from "./chat.socket";
import initializeRoomSocket from "./room.socket";
import initializeCourseSocket from "./course.socket";
import { eventEmitter, logger } from "../config";
import { Server, Socket } from "socket.io";
import { findUserFromSocket } from "../helpers/socket.helpers";
import { ISocketInitializer } from "../types";

const socketInitializers: ISocketInitializer[] = [
    initializeChatSocket,
    initializeCourseSocket,
    initializeRoomSocket,
];

export default socketInitializers;

export function init(io: Server) {
    io.on("connection", async function (socket: Socket) {
        let user = await findUserFromSocket(socket);
        logger.info(`User ${user._id} connected.`);

        if (!user)
            return logger.error("Cannot find user from socket connection");

        socket.join(user._id.toString());

        socketInitializers.forEach(function (initializer) {
            initializer(socket, { eventEmitter, io, user });
        });
    });
}
