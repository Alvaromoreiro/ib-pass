
export enum VoucherTypeEnum {
    PARTNER = 'PARTNER',
    GIFTCARD = 'GIFTCARD',
    OTHER = 'OTHER'
}

export type VoucherTypeEnumType = `${VoucherTypeEnum}`;

export interface VoucherValidatedEvent {
    order: any,
}

export interface CheckVoucherResponse {
    order:                          any;
    passengers:                     Passenger[];
    tickets:                        any[];
    warnings:                       any[];
    paymentsInfo:                   any[];
    contextMetadata:                ContextMetadata;
    relatedContent:                 any[];
    feeInformations:                any[];
    errorsWithAdditionalInfo:       null;
    identificator:                  null;
    syncHasChangedPassengerName:    boolean;
    flowType:                       null;
    orderFlags:                     null;
    infoValidationFF:               null;
    syncHasChangedSpecialNeeds:     boolean;
    syncHasChangedBaggage:          boolean;
    syncHasChangedSeats:            boolean;
    syncHasChangedPriorityBoarding: boolean;
    kpiDisruption:                  null;
    checkInInfo:                    null;
    locSurEncrypt:                  string;
}

export interface ContextMetadata {
    language:   string;
    country:    string;
    currencies: Currency[];
}


export interface Passenger {
    passengerType:                string;
    personalInfo:                 PersonalInfo;
    passengerId:                  string;
    idInfo:                       null;
    contactInfo:                  null;
    residenceAccreditationStatus: null;
    documentInfos:                null;
    redressInfo:                  null;
    emergencyContactInfo:         null;
    externalPersonalInfo:         ExternalPersonalInfo;
    indirectOnBusinessInfo:       null;
    frequentFlyerInfo:            null;
}

export interface ExternalPersonalInfo {
    name:         string;
    firstSurname: string;
    lastSurname:  string;
}

export interface PersonalInfo {
    firstName:     string;
    firstSurname:  string;
    lastSurname:   string;
    surnameSuffix: string;
}
export interface CheckVoucherOtpValidateResponse {
    otpSessionId: string;
    otpSessionExpired: string;
    otpSessionRequested: string;
    otpEmail: string;
}
