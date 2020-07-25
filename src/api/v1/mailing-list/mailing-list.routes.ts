import { Router } from "express";
import * as mailingListControllers from "./mailing-list.controllers";
import { authMiddlewareService } from "../../../services";

const mailingListRouter = Router();

mailingListRouter.post("/", mailingListControllers.createMailingListSubscriber);
mailingListRouter.get(
    "/",
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles(["ADMIN"]),
    mailingListControllers.createMailingListSubscriber
);

export default mailingListRouter;
