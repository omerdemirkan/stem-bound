export { default as initializeChatSocket } from "./chat.socket";

import initializeChatSocket from "./chat.socket";
import initializeRoomSockets from "./room.socket";
import { eventEmitter, logger } from "../config";
import { Server, Socket } from "socket.io";
import { findUserFromSocket } from "../helpers/socket.helpers";

export function init(io: Server) {
    io.on("connection", async function (socket: Socket) {
        let user = await findUserFromSocket(socket);

        if (!user)
            return logger.error("Cannot find user from socket connection");

        initializeRoomSockets(socket, { eventEmitter, io, user });
        initializeChatSocket(socket, { eventEmitter, io, user });
    });
}
