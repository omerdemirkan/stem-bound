import { Router } from "express";
import * as locationControllers from "./location.controllers";

const locationRouter = Router();

locationRouter.get("/", locationControllers.getLocations);

export default locationRouter;
