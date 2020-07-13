import { Router } from "express";
import * as mailingListControllers from "./mailing-list.controllers";
import { authMiddlewareService } from "../../../services";
import { EUserRoles } from "../../../types";

const mailingListRouter = Router();

mailingListRouter.post("/", mailingListControllers.createMailingListSubscriber);
mailingListRouter.get(
    "/",
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles(["ADMIN"]),
    mailingListControllers.createMailingListSubscriber
);

export default mailingListRouter;
