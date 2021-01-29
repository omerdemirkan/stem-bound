import { Router } from "express";
import * as authControllers from "./auth.controllers";
import { authMiddlewareService } from "../../../services";

const authRouter = Router();

authRouter.get(
    "/me",
    authMiddlewareService.extractTokenPayload,
    authControllers.me
);

authRouter.post(
    "/send-verification-email",
    authControllers.sendVerificationEmail
);

authRouter.post("/sign-up", authControllers.signUp);

authRouter.post("/log-in", authControllers.logIn);

export default authRouter;
