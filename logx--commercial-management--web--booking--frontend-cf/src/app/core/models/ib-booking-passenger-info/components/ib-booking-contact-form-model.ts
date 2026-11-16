export interface PrefixData {
    code: string;
    countryCode: string,
    description: string
}

export interface ContactData {
    contactEmail: string,
    contactPhone: string,
    contactPrefix: PrefixData,
    denyNewsLetters:boolean,
    isNewsLetters:boolean,
    isValidForm: boolean
}