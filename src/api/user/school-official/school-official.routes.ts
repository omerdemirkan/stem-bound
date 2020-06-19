import { Router } from "express";
import * as schoolOfficialControllers from "./school-official.controllers";
import { EUserRoles } from "../../../types";
import { authMiddlewareService } from "../../../services";

const schoolOfficialRouter = Router();

schoolOfficialRouter.get("/", schoolOfficialControllers.getSchoolOfficials);

schoolOfficialRouter.get(
    "/:id",
    schoolOfficialControllers.getSchoolOfficialById
);

schoolOfficialRouter.get(
    "/:id/school",
    schoolOfficialControllers.getSchoolOfficialSchoolById
);

schoolOfficialRouter.patch(
    "/:id",
    authMiddlewareService.blockRequestBodyMetadata,
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles([
        EUserRoles.SCHOOL_OFFICIAL,
        EUserRoles.ADMIN,
    ]),
    authMiddlewareService.matchParamIdToPayloadUserId,
    schoolOfficialControllers.updateSchoolOfficialById
);

schoolOfficialRouter.delete(
    "/:id",
    authMiddlewareService.extractTokenPayload,
    authMiddlewareService.allowedRoles([
        EUserRoles.ADMIN,
        EUserRoles.SCHOOL_OFFICIAL,
    ]),
    authMiddlewareService.matchParamIdToPayloadUserId,
    schoolOfficialControllers.deleteSchoolOfficialById
);

export default schoolOfficialRouter;
