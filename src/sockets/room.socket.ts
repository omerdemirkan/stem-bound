import { Socket } from "socket.io";
import { ISocketOptions, ESocketEvents } from "../types";

export default function initializeRoomSockets(
    socket: Socket,
    { eventEmitter }: ISocketOptions
) {
    // DEFAULT USER ROOM
    const userId = socket.request._query.user_id;

    if (typeof userId === "string") {
        socket.join(userId);
    }

    socket.on(ESocketEvents.JOIN_ROOM, function (room: string) {
        try {
            socket.join(room);
        } catch (e) {}
    });
    socket.on(ESocketEvents.LEAVE_ROOM, function (room: string) {
        try {
            socket.leave(room);
        } catch (e) {}
    });
}
