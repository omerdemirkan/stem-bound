import { Router } from "express";

import userRouter from "./user/user.routes";
import schoolRouter from "./school/school.routes";
import authRouter from "./auth/auth.routes";
import courseRouter from "./course/course.routes";
import chatRouter from "./chat/chat.routes";
import mailingListRouter from "./mailing-list/mailing-list.routes";
import locationRouter from "./location/location.routes";

const v1Router: Router = Router();

v1Router.use("/users", userRouter);
v1Router.use("/schools", schoolRouter);
v1Router.use("/auth", authRouter);
v1Router.use("/courses", courseRouter);
v1Router.use("/chats", chatRouter);
v1Router.use("/mailing-list", mailingListRouter);
v1Router.use("/locations", locationRouter);

export default v1Router;
