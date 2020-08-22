import { Socket } from "socket.io";
import { ISocketOptions } from "../types";

export default function initializeChatSocket(
    socket: Socket,
    { eventEmitter }: ISocketOptions
) {}
