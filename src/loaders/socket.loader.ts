import http from "http";
import initializeWebSocketServer from "socket.io";
import * as sockets from "../sockets";

export default function socketLoader(app) {
    const io = initializeWebSocketServer(http.createServer(app));
    io.origins(["http://localhost:3000"]);
    sockets.init(io);
}
