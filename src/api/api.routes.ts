import { Router, Request, Response } from "express";
import * as modulesMiddlewares from "./api.middlewares";

import userRouter from "./user/user.routes";
import schoolRouter from "./school/school.routes";
import authRouter from "./auth/auth.routes";
import courseRouter from "./course/course.routes";
import chatRouter from "./chat/chat.routes";

const router: Router = Router();

router.use(modulesMiddlewares.requestLogger);

router.use("/user", userRouter);
router.use("/school", schoolRouter);
router.use("/auth", authRouter);
router.use("/course", courseRouter);
router.use("/chat", chatRouter);

export default router;
