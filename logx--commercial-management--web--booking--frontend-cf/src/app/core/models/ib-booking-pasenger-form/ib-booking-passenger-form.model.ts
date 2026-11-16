import { ContactData, PrefixData } from '@core/models/ib-booking-passenger-info/components/ib-booking-contact-form-model';

/** Optional travel document the passenger may present (e.g. passport, NIE). Built from `optionalDocuments` in the security info service response. */
export type OptionalDocument = {
    code: string;
    description: string;
    showFields: { [key: string]: any };
    number?: string;
};

/** Mandatory travel document for the passenger. Extends `OptionalDocument` with the document number. Built from `mandatoryDocuments` in the security info service response. */
export type MandatoryDocument = OptionalDocument & {
    number: string;
    code: string;
};

/** Display label for a passenger entry in the form, including its ordinal position. */
export type PassengerName = {
    name: string;
    pasNumber: number;
    needsTranslate: boolean;
};

/** Information for wheelchair assistance types. */
export type WheelchairInfo = {
    code: string;
    name: string;
    description: string;
};

/** Special assistance needs for a passenger, derived from the user's travel preferences and the available services in `fareData.services`. */
export type SpecialNeeds = {
    availableTypes: string[];
    specialVision: boolean;
    specialHearing: boolean;
    specialGuideDog: boolean;
    specialIntellDisability: boolean;
    specialWheelchair: boolean;
    specialWheelchairValue: string;
    specialWheelchairInfo: WheelchairInfo[];
    isEnable?: boolean;
};

/** Service-side validation error for a passenger (e.g. resident discount or frequent flyer errors). */
export type ServiceError = {
    errorMessage: string;
    type: string;
    typeError: string;
};

/** Visibility flags for optional fields in the passenger form, computed by the transformer from `requiredFields` in the service response. */
export type PassengerOptions = {
    haveBirthdate: boolean;
    haveName: boolean;
    haveSurname: boolean;
    haveLastName: boolean;
    haveIbPlus: boolean;
    haveGender: boolean;
    resident?: { haveError: boolean; errorMessage: string };
};

/** Resident discount information for Canary Islands or Ceuta/Melilla routes. */
export type ResidentDiscountInfo = {
    municipalityCode: string;
};

/** Large family discount information, including the certificate number and the autonomous community code. */
export type LargeFamilyDiscountInfo = {
    largeFamilyCertificateNumber: string;
    communityCode: {
        code: string;
        description: string;
    };
    communityCodePattern?: string;
};

/** A business code type option for corporate (On Business) booking flows, filtered by `name` in the passenger form. */
export type BusinessCodeType = {
    name: string;
    code: string;
};

/** On Business card number and business code type for corporate booking flows. */
export type OBNumberInfo = {
    businessCodeType: BusinessCodeType;
    number: string;
};

/** A selectable option (code + description) within a required field dropdown (e.g. municipality, community code). */
export type RequiredFieldOption = {
    code: string;
    description: string;
};

/** An airline company available for frequent flyer card selection, filtered by `airlineName` in the form. */
export type Company = {
    iataCompanyCode: string;
    airlineName: string;
};

/** User profile info embedded in a frequently-travelled passenger record. */
export type FrequentlyPassengerUserInfo = {
    firstName?: string;
    lastName?: string;
    secondLastName?: string;
};

/** A previously-travelled passenger entry available for autocomplete selection in the passenger form. */
export type FrequentlyPassenger = {
    type: string;
    isSelected?: boolean;
    index?: number;
    needsTranslate?: boolean;
    name?: string;
    surname1?: string;
    surname2?: string;
    displayName?: string;
    title?: string;
    gender?: string;
    birthDate?: string;
    program?: string;
    frequentFlyer?: string;
    selectedDoc?: MandatoryDocument | null;
    specialNeeds?: boolean;
    userInfo?: FrequentlyPassengerUserInfo;
};

/** Container for frequently-travelled passengers grouped under `beneficiaries`, shaped by `checkPassengers()`. */
export type FrequentlyPassengersData = {
    beneficiaries: FrequentlyPassenger[];
};

/** Logged-in user data used to pre-fill the first passenger's form and iTravel check. */
export type PassengerInfoLogged = {
    ibPlusNumber?: string | number;
    name?: string;
    surname1?: string;
    surname2?: string;
    birthDate?: string;
    type?: string;
    contactEmail?: string;
    selectedDoc: MandatoryDocument ;
};

/** Form data filled in by the passenger or pre-loaded from the logged-in user's profile. */
export type PassengerData = {
    name?: string;
    surname?: string;
    lastSurname?: string;
    gender?: string;
    /** Day/month/year stored as `['DD', 'MM', 'YYYY']` or as a string-keyed object `{ '0': 'DD', '1': 'MM', '2': 'YYYY' }`. */
    birthDate?: string[] | { [key: string]: string };
    mandatoryDoc: MandatoryDocument | null;
    optionalDoc: OptionalDocument | null;
    residentDiscountInfo?: ResidentDiscountInfo | null;
    largeFamilyDiscountInfo?: LargeFamilyDiscountInfo | null;
    largeFamilyType?: string;
    freqFlyerInfo?: unknown;
    freqFlyerSelected?: boolean;
    OBNumberSelected?: boolean;
    OBNumberInfo?: OBNumberInfo | null;
    
    personInCharge?: PersonInCharge | null;
};

/** A `PassengerInfo` instance assigned as caregiver for an infant, enriched with a computed display label. */
export type PersonInCharge = PassengerInfo & { displayName?: string };

/** Full passenger entity in the form, generated by the transformer from `passengersSecurityInformation[i]` in the security info service response. */
export type PassengerInfo = {
    id: string;
    type: string;
    name: PassengerName;
    /** Map of required fields; present keys are objects (with optional `values` for dropdowns), absent keys mean the field is not required. */
    requiredFields: { [key: string]: { values?: RequiredFieldOption[] } };
    serviceErrors: ServiceError[];
    optionalDocs: Record<string, OptionalDocument> ;
    mandatoryDocs: MandatoryDocument[];
    specialNeeds: SpecialNeeds;
    data: PassengerData;
    options: PassengerOptions;
    isSelected: boolean;
    isValidForm: boolean;
    canBeInCharge: boolean;
    selectedFrequentlyPassenger?: FrequentlyPassenger | null;
    /** Filtered list of previously-travelled passengers available for autocomplete selection. Populated by `checkPassengers()`. */
    frequentlyPassengers: FrequentlyPassenger[];
    /** Large family discount data pre-loaded from the logged-in user's profile. */
    largeFamilyDiscountInfo?: LargeFamilyDiscountInfo;
    /** Resident discount data pre-loaded from the logged-in user's profile. */
    residentDiscountInfo?: ResidentDiscountInfo;
    /** Large family type options available for this passenger, including the `values` string array. */
    largeFamilyTypes?: { values: string[] };
    /** Previously selected frequently-flyer passenger entry, used to deselect it when a new one is chosen. */
    previousSelected?: FrequentlyPassenger;
};

/** Advisory or warning message from the fare (advices/warnings in fareData). A checkbox may be required for the user to acknowledge it. */
export type WarningMessage = {
    id: string;
    title: string;
    text: string;
    checkBox: boolean | null;
    checkBoxText: string;
    checkBoxConditions: boolean;
    showCheckBoxError: boolean;
};

/** Container for informational advisories and acknowledgement-required warnings shown on the passenger page. */
export type WarningMessages = {
    status: boolean;
    simpleAdvises: WarningMessage[];
    checkAdvises: WarningMessage[];
};

/** On Hold booking option details, built from `onHoldOptions` in the fareData offers. */
export type OnHoldInfo = {
    holdTimes: string;
    maxFreeTime: number;
    moreTimePrice: number;
    minPrice: number | string;
    freePrice: unknown;
    freeOption: boolean;
    payOption: boolean;
    holdTimesFree: string;
    holdTimesPay: number;
    onHoldOptionText: string;
    onHoldOptionTitle?: string;
    onHoldOptionDescription?: string;
};

/** Flight summary displayed in the sidebar basket of the passenger page. */
export type SummaryInfo = {
    trips: unknown[];
    passengers: { [key: string]: unknown };
    otherFees: unknown[];
};

/** Security and flight form data produced by `transformSecurityInfoPassengerData`. Stored as `securityInfo` inside `passengersFormData` and passed directly to `createBookingOrder`. */
export type SecurityInfo = {
    passengerInfo: PassengerInfo[];
    isLogged: boolean | string;
    isResident: boolean;
    iTravel: boolean;
    passengerInfoLogged?: PassengerInfoLogged;
    contactData: ContactData;
    frequentlyPassengers: FrequentlyPassengersData | [];
    largeFamilyDiscountInfo: LargeFamilyDiscountInfo;
    totalPrice: unknown;
    totalPriceWithOutDiscount: unknown;
    totalPriceWithDiscount: unknown;
    aviosInfo: unknown;
    onHold: OnHoldInfo;
    onHoldIfIsLogged: OnHoldInfo | null;
    discounts: unknown[];
    originalDiscounts?: unknown[];
    summaryInfo: SummaryInfo;
    relatedContent: unknown;
    warningMessages: WarningMessages;
    gdprInfo?: unknown;
};
export type Country= {
    code: string,
    description: string,
    isoCode: string
};
export type PassengersFormData = {
    securityInfo: SecurityInfo;
    prefixesList: PrefixData[];
    phonePrefixFallback: boolean;
    companiesList: Company[];
    businessCodeType: BusinessCodeType[];
    countriesList: Country[];
    frequentlyPassengers: FrequentlyPassengersData | [];
};
