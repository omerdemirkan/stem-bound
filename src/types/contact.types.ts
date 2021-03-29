export enum EContactPurpose {
    VOLUNTEER = "VOLUNTEER",
    GENERAL_INFORMATION = "GENERAL_INFORMATION",
    PARTNERSHIP = "PARTNERSHIP",
}

export interface IContactData {
    firstName: string;
    lastName: string;
    email: string;
    purpose: EContactPurpose;
    message: string;
}
