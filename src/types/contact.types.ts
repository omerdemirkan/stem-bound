export enum EContactPurpose {
    VOLUNTEER = "VOLUNTEER",
    GENERAL_INFORMATION = "GENERAL_INFORMATION",
    PARTNERSHIP = "PARTNERSHIP",
}

export interface IContactData {
    email: string;
    purpose: EContactPurpose;
    message: string;
}
