export { default as userSubscribers } from "./user.subscribers";
export { default as courseSubscribers } from "./course.subscribers";
export { default as chatSubscribers } from "./chat.subscribers";

import userSubscribers from "./user.subscribers";
import courseSubscribers from "./course.subscribers";
import chatSubscribers from "./chat.subscribers";

export function init() {
    userSubscribers.initialize();
    courseSubscribers.initialize();
    chatSubscribers.initialize();
}
