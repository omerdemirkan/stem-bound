import http from "http";
import initializeSocket, { Server } from "socket.io";
import * as sockets from "../sockets";

export let io: Server;

export default function socketLoader(app) {
    io = initializeSocket(http.createServer(app));
    sockets.init(io);
}
