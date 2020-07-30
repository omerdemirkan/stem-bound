export { default as initializeChatSocket } from "./chat.socket";

import { Server, Socket } from "socket.io";
import initializeChatSocket from "./chat.socket";
import { eventEmitter } from "../config";

export function init(io: Server) {
    io.on("connection", (socket: Socket) => {
        initializeChatSocket(socket);
    });
}
