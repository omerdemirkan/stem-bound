import { ESocketEvents, ITokenPayload, IUser } from "../types";
import { Socket } from "socket.io";
import { Types } from "mongoose";
import { userService, jwtService } from "../services";

export function constructClientChatEvent({
    chatId,
    event,
}: {
    chatId: string;
    event: ESocketEvents;
}) {
    return `chats/${chatId}/${event}`;
}

export async function findUserFromSocket(
    socket: Socket
): Promise<IUser | null> {
    try {
        const accessToken = socket.request._query["authorization"];
        const payload = (await jwtService.verify(accessToken)) as ITokenPayload;
        return await userService.findUserById(Types.ObjectId(payload.user._id));
    } catch (e) {
        return null;
    }
}
