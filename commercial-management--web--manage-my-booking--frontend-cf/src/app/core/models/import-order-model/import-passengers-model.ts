namespace ImportOrderData {
    export interface Passenger {
        passengerType: string;
        personalInfo: PersonalInfo;
        passengerId: string;
        contactInfo: ContactInfo;
        ckiStatus?: null;
        optionalInformation?: null[] | null;
        residenceAccreditationStatus?: null;
        securityInformation: SecurityInformation;
        externalPersonalInfo: ExternalPersonalInfo;
    }
    export interface PersonalInfo {
        name: string;
        surname: string;
        birthDate?: null;
    }
    export interface ContactInfo {
        phone: string;
        email: string;
        phoneType: string;
        confirmationMailOption?: null;
    }
    export interface SecurityInformation {
        relatedContent?: (RelatedContent)[] | null;
    }
    export interface RelatedContent {
        key: string;
        value: string;
    }
    export interface ExternalPersonalInfo {
        name: string;
        firstSurname: string;
        lastSurname: string;
    }
}