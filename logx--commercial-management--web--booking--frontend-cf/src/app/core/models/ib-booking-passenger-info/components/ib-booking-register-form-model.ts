export interface LinkFilterData {
    needsOrigin?: boolean;
    needsMarket?:boolean;
    needsLang?: boolean;
    uri?:string;
}

export interface RequestRegisterService {
    email:string;
    password:string;
    name: string;
    lastName:string;
    phone:{
        prefix:string;
        number:string;
    }
    magazine:boolean;
}

export type WebEnrolmentTypeV2 = 'NORMAL_ENROL' | 'SOCIAL_NETWORK_ENROL';

export interface EnrolMemberRequestV02 {
    invitationIdentifier?: string | null;
    person: {
        personName: {
            firstName: string;
            familyName: string;
            secondFamilyName?: string;
        };
        countryOfResidence: string;
        prefLanguage: string;
        email: string;
        enrolmentType: WebEnrolmentTypeV2;
    };
    marketingPermissions: boolean;
    termsAndConditions: {
        version: string;
        acceptedDate: string;
    };
    securityProfile: {
        username?: string;
        password?: string;
    };
}