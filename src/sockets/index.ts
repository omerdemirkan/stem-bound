export { default as initializeChatSocket } from "./chat.socket";
import { eventEmitter } from "../config";
import { Server, Socket } from "socket.io";
import initializeChatSocket from "./chat.socket";

export function init(io: Server) {
    console.log("Inside socket initializer");
    io.on("connection", function (socket: Socket) {
        console.log(`
        
        
        A USER CONNECTED!!!
        
        
        `);
        socket.emit("greet", "Yoo whats good");
        initializeChatSocket(socket, eventEmitter);
    });
}
