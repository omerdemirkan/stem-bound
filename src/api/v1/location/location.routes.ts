import { Router } from "express";
import { authMiddlewareService } from "../../../services";
import * as locationControllers from "./location.controllers";

const locationRouter = Router();

locationRouter.get("/", locationControllers.getLocations);
locationRouter.post(
    "/refresh-database",
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles(["ADMIN"]),
    locationControllers.refreshDatabase
);

export default locationRouter;
