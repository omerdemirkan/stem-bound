import { Router } from "express";
import * as contactControllers from "./contact.controllers";

const contactRouter = Router();

contactRouter.post("/", contactControllers.contactUs);

export default contactRouter;
