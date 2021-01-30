import { Server } from "socket.io";
import * as sockets from "../sockets";
import http from "http";
import config from "../config";

export default function socketLoader(app): http.Server {
    const server = new http.Server(app);
    const io = new Server(server, {
        cors: {
            credentials: true,
            origin: config.clientOrigin,
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        },
    });
    sockets.init(io);
    return server;
}
