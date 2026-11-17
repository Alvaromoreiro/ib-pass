import { RequiredFieldOptions, TypesOCR } from 'commercial-management--digital--web-components-design--library';

export interface SecurityResponse {
    requiredFieldsOptions?:         RequiredFieldOptions[];
    passengersSecurityInformation?: PassengerSecurityInfo[];
    legalDocumentsRequired?:        Document[];
    name?:                          string;
    founded?:                       number;
    members?:                       string[];
}

export interface Address {
    address?: string;
    zipCode?: string;
    city?:    string;
    state?:   string;
    country?: string | CountryCode;
}

export type SecurityRequest = PassengerSecurityInfo[];

export interface PassengerSecurityInfo {
    id:                                 string | number;
    requiredFields?:                     string[];
    name:                               string;
    surname:                            string;
    title?:                              string;
    gender:                             string;
    birthDate:                          string;
    inTransit:                          boolean;
    destinationAddress?:                 Address;
    homeAddress?:                        Address;
    emergencyContact:                   EmergencyContact;
    nationality:                        string | CountryCode | null;
    cityOfBirth?:                        string;
    countryOfResidence?:                 string;
    mandatoryDocuments?:                 MandatoryDocument[];
    optionalDocuments?:                  SecurityDocument[];
    documents:                          Document[];
    infantPassengerSecurityInformation?: InfantPassengerSecurityInfo;
}

export interface Document {
    type:           string | Type;
    number?:        string;
    expiryDate?:    string;
    issuerCountry?: string | Type;
    ocrVerified?: boolean;
    mrzText?: string;
}

export interface EmergencyContact {
    name: string;
    phone: Phone;
    refused: boolean;
}

export interface Phone {
    countryCode: CountryCode | string;
    number:      string;
}

export interface CountryCode {
    code:        string;
    description: string;
}

export interface InfantPassengerSecurityInfo {
    id:                 null;
    requiredFields:     string[];
    name:               string;
    surname:            string;
    gender:             string;
    birthDate:          string;
    nationality:        string;
    cityOfBirth:        string;
    countryOfResidence: string;
    mandatoryDocuments?: MandatoryDocument[];
    optionalDocuments?:  SecurityDocument[];
    documents:          Document[];
    homeAddress?:        Address;
}

export interface MandatoryDocument {
    documents: SecurityDocument[];
}

export interface SecurityDocument {
    issuerCountry:         string;
    type:                  Type;
    expiryDate:            string;
    number:                string;
    country?:              string;
    requiredFields:        RequiredField[];
    requiredFieldsOptions: RequiredFieldOptions[];
    ocr?: TypesOCR;
}

export enum RequiredField {
    CntryDoc = 'CNTRY_DOC',
    ExpiryDoc = 'EXPIRY_DOC',
    NumDoc = 'NUM_DOC'
}

export interface Type {
    code:        string;
    description: string;
}