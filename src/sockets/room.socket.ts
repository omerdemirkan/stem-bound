import { ESocketEvents, ISocketInitializer } from "../types";

const initializeRoomSockets: ISocketInitializer = (
    socket,
    { eventEmitter }
) => {
    // DEFAULT USER ROOM
    // @ts-ignore
    const userId = socket.request._query?.user_id;

    if (typeof userId === "string") {
        socket.join(userId);
    }

    socket.on(ESocketEvents.JOIN_ROOM, function (room: string) {
        try {
            console.log("joined: " + room);
            socket.join(room);
        } catch (e) {}
    });
    socket.on(ESocketEvents.LEAVE_ROOM, function (room: string) {
        try {
            console.log("left: " + room);
            socket.leave(room);
        } catch (e) {}
    });
};

export default initializeRoomSockets;
