export interface CustomerData {
    generalInfo?:                GeneralInfo;
    personalInfo?:               PersonalInfo;
    largeFamilyInfo?:            LargeFamilyInfo;
    residentInfo?:               ResidentInfo;
    acceptedTermsAndConditions?: boolean;
    name?:                       string;
    founded?:                    number;
    members?:                    string[];
}

export interface GeneralInfo {
    hashEID: string;
}

export interface LargeFamilyInfo {
    category:  string;
    docNumber: string;
    zipCode:   string;
}

export interface PersonalInfo {
    name:             string;
    surname1:         string;
    gender:           string;
    contactEmail:     string;
    telecomAddresses: TelecomAddresses;
    alarms:           Alarm[];
}

export interface Alarm {
    number: number;
    params: string[];
}

export interface TelecomAddresses {
    deviceType:          string;
    type:                string;
    preferenceIndicator: boolean;
    number:              string;
    countryDiallingCode: string;
}

export interface ResidentInfo {
    area: number;
}