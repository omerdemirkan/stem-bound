import { Socket } from "socket.io";

export default function initializeChatSocket(socket: Socket) {
    socket.on("chat_user", function () {});
}
