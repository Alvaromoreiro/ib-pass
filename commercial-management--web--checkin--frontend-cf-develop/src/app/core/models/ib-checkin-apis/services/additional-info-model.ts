export type AdditonalInfoBody = PassengerAdditionalInfo[];

export interface PassengerAdditionalInfo {
    id:                string;
    disruptionContact: DisruptionContact | null;
    frequentFlyer?:     FrequentFlyer;
}

export interface DisruptionContact {
    language: string;
    email:    string;
    phone:    Phone;
}

export interface Phone {
    countryCode: CountryCode | string;
    number:      string;
}

export interface CountryCode {
    code:        string;
    description: string;
}

export interface FilterPassengerAdditionalInfo {
    validAdditionalInfo: PassengerAdditionalInfo[];
    hasAllIncompleteData: boolean;
}

export interface FrequentFlyer {
    number:             string;
    iataCompanyCode:    string;
}