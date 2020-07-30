export { default as initializeChatSocket } from "./chat.socket";
import { eventEmitter } from "../config";
import { Server, Socket } from "socket.io";
import initializeChatSocket from "./chat.socket";

export function init(io: Server) {
    io.on("connection", function (socket: Socket) {
        console.log("User connected");

        socket.on("ping", function () {
            console.log("Server pinged");
            socket.emit("pong", "Boojie");
        });
        initializeChatSocket(socket, eventEmitter);
    });
}
