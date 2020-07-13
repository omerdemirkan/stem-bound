import { Router } from "express";
import * as apiMiddlewares from "./api.middlewares";

import userRouter from "./user/user.routes";
import schoolRouter from "./school/school.routes";
import authRouter from "./auth/auth.routes";
import courseRouter from "./course/course.routes";
import chatRouter from "./chat/chat.routes";
import mailingListRouter from "./mailing-list/mailing-list.routes";
import locationRouter from "./location/location.routes";

const router: Router = Router();

router.use(apiMiddlewares.apiRateLimiter);
router.use(apiMiddlewares.requestLogger);

router.use("/users", userRouter);
router.use("/schools", schoolRouter);
router.use("/auth", authRouter);
router.use("/courses", courseRouter);
router.use("/chats", chatRouter);
router.use("/mailing-list", mailingListRouter);
router.use("/locations", locationRouter);

export default router;
