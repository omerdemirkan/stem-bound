import { ESocketEvents } from "../types";

export function constructClientChatEvent({
    chatId,
    event,
}: {
    chatId: string;
    event: ESocketEvents;
}) {
    return `chats/${chatId}/${event}`;
}
