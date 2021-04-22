import { IContactData } from "../types";

export function configureContactData(data: any): IContactData | null {
    const contactData: IContactData = {
        email: data.email,
        message: data.message,
        firstName: data.firstName,
        lastName: data.lastName,
    };
    // Return to set up validation with yup
    return contactData;
}
