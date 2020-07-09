import { Router } from "express";
import * as modulesMiddlewares from "./api.middlewares";

import userRouter from "./user/user.routes";
import schoolRouter from "./school/school.routes";
import authRouter from "./auth/auth.routes";
import courseRouter from "./course/course.routes";
import chatRouter from "./chat/chat.routes";
import mailingListRouter from "./mailing-list/mailing-list.routes";

const router: Router = Router();

router.use(modulesMiddlewares.requestLogger);

router.use("/users", userRouter);
router.use("/schools", schoolRouter);
router.use("/auth", authRouter);
router.use("/courses", courseRouter);
router.use("/chats", chatRouter);
router.use("/mailing-list", mailingListRouter);

export default router;
