import { AJSModalServiceType } from '@src/app/shared/services/ib-modal/ib-modal-service-bridge.service';
import { ProcessedHttpError } from 'ib-web-commons/dist/models';

/**
 * INTERFACE
 */
export interface IRootScopeExt extends CommonsRootScope {
    phonesList: IPhonesList;
    footerModel: IFooterModel;
    otpServicesURI: string;
    METAS: Record<string, MetaType>;
    CHECKIN_FIELDS_LENGTH: object;
    CHECKIN_PATTERNS: object;
    loadLinks: boolean;
    showMainFooter?: boolean;
    extraClassFooter?: string;
    serviceAncillarie: CommonsAncillariesService,
    serviceModal: AJSModalServiceType
}

export interface IFooterModel {
    phoneInfo: IPhoneInfo;
}

export interface IPhoneInfo {
    prefix: string;
    phoneNumber: string;
    text: string;
}

export interface IPhoneEntry {
    prefix: string;
    telephone: string;
    text: string;
    prefixAlt?: string;
    telephoneAlt?: string;
    textAlt?: string;
    timeText?: string;
}

export interface IPhonesList {
    RESERVAS?: IPhoneEntry;
    [key: string]: IPhoneEntry | undefined;
}
export interface ReactComponentData<PropsT> {
    props: PropsT,
    component: (props: PropsT) => import('react/jsx-runtime').JSX.Element;
}

/**
 * TYPES
 */
export type CommercialDataMarket = {
    currency: Currency;
    languages: Language[];
    market: Market;
    marketFlags: MarketFlags;
    sessionTimeLifeInMinutes: number;
    maxSearchTime: number;
    minSearchTime: number;
    passengerTypes: PassengerType[];
    discounts: CommercialDataDiscounts[];
    defaultValues: DefaultValues;
    roundingPolicy: string;
    availabilityPriceShowPolicy: string;
    mainCities: MainCities;
    availabilityType: string;
};

export type CommercialDataDiscounts = {
    code: string;
    description: string;
    countries: string[];
    cities: CommercialDataCity[];
    relatedField: string;
    type: string;
};

export type ChekinHttpResponse<T> = {
    code: number;
    data: T;
};

export type ChekinHttpErrorModel = {
    errorCode: number;
    requestURL: string;
} | ProcessedHttpError;

export type MarketLangType = { 
    market: string, 
    language: string 
};

export type MetaType = {
    'META-AUTHOR': string;
    'META-DESCRIPTION': string;
    'META-KEYWORDS': string;
    'META-TITLE': string;
};