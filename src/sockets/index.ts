export { default as initializeChatSocket } from "./chat.socket";
import { eventEmitter } from "../config";
import { Server, Socket } from "socket.io";
import initializeChatSocket from "./chat.socket";
import initializeRoomSockets from "./room.socket";

export function init(io: Server) {
    io.on("connection", function (socket: Socket) {
        console.log("User has connected");
        socket.on("disconnect", () => {
            console.log("User has disconnected");
        });
        initializeRoomSockets(socket, { eventEmitter, io });
        initializeChatSocket(socket, { eventEmitter, io });
    });
}
