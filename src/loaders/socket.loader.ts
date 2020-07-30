import http from "http";
import Server from "socket.io";
import * as sockets from "../sockets";

export default function socketLoader(app) {
    const io = new Server(http.createServer(app));
    // io.origins(["http://localhost:3000"]);
    sockets.init(io);
    io.listen(443);
}
