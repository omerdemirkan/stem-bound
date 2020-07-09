// SCHOOL

import { EErrorTypes } from "../types/error.types";

export const schoolCsvColumns = [
    "X",
    "Y",
    "FID",
    "NCESID",
    "NAME",
    "ADDRESS",
    "CITY",
    "STATE",
    "ZIP",
    "ZIP4",
    "TELEPHONE",
    "TYPE",
    "STATUS",
    "POPULATION",
    "COUNTY",
    "COUNTYFIPS",
    "COUNTRY",
    "LATITUDE",
    "LONGITUDE",
    "NAICS_CODE",
    "NAICS_DESC",
    "SOURCE",
    "SOURCEDATE",
    "VAL_METHOD",
    "VAL_DATE",
    "WEBSITE",
    "LEVEL_",
    "ENROLLMENT",
    "ST_GRADE",
    "END_GRADE",
    "DISTRICTID",
    "FT_TEACHER",
    "SHELTER_ID",
];

export const courseTypes = ["IN_PERSON", "REMOTE", "HYBRID"];

export const meetingTypes = ["IN_PERSON", "REMOTE"];

export const errors = Object.freeze({
    [EErrorTypes.BAD_REQUEST]: {
        status: 400,
        message: "You should read the documentation",
    },
    [EErrorTypes.UNAUTHORIZED]: {
        status: 401,
        message: "You need to be authenticated",
    },
    [EErrorTypes.FORBIDDEN]: {
        status: 403,
        message: "You aren't allowed access",
    },
    [EErrorTypes.DOCUMENT_NOT_FOUND]: {
        status: 404,
        message: "Can't find what you're looking for",
    },
    [EErrorTypes.CONFLICT]: {
        status: 409,
        message: "Conflict found",
    },
});
