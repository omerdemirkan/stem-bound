import SocketIO from "socket.io";
import * as sockets from "../sockets";
import config from "../config";
import http from "http";

export default function socketLoader(app): http.Server {
    const server = new http.Server(app);
    const io = new SocketIO(server);
    sockets.init(io);
    return server;
}
