export interface NewPaymentAvailableResponse {
    'available': boolean
}
export interface PaymentComponentConfig {
    target?: HTMLElement | string;
    contextId: string;
    customStyles?: CustomizedStyles;
    onPaymentSuccess: (OnPaymentSuccessEvent) => void;
    onError: (OnErrorEvent) => void;
    auth:Auth
}

export interface OnErrorEvent{
    status: keyof typeof OnErrorEventStatus;
}
export interface CustomizedStyles {
    outstandColor?: string;
    darkOutstandColor?: string;
    regularFont?: string;
    outstandFont?: string;
}
export interface Auth {
    token: string,
    additionalTokens?: AdditionalToken[]        
}
export interface AdditionalToken {
    key: string,
    value: string
}

export interface OnPaymentSuccessEventDetails {
    creditCardType?: keyof typeof SuccessEventCreditCardTypes;
}

export interface OnPaymentSuccessUnpaidItemsList {
    type: keyof typeof SuccessEventUnpaidItems;
}

export interface OnPaymentSuccessEvent{
    status:  keyof typeof SuccessEventStatus;
    methodType: keyof typeof SuccessEventMethodTypes;
    details?: OnPaymentSuccessEventDetails;
    unpaidItemList?: OnPaymentSuccessUnpaidItemsList[]
}

export enum PmtWebComponentSubs {
    PRICE = 'price',
    PAYMENT = 'payment',
    ERROR = 'error'
}

export enum OnErrorEventStatus {
    FAILED_PAYMENT = 'FAILED_PAYMENT',
    UNAUTHORIZED = 'UNAUTHORIZED',
    UNKNOWN = 'UNKNOWN',
    EXCEED_ATTEMPS = 'EXCEED_ATTEMPS',
    DENIED_FRAUD = 'DENIED_FRAUD'
}

export enum SuccessEventStatus {
    COMPLETED = 'COMPLETED',
    PARTIALLY_PAID = 'PARTIALLY_PAID'
}

export enum SuccessEventUnpaidItems {
    ALLIANZ_INSURANCE = 'ALLIANZ_INSURANCE',
    DONATION = 'DONATION',
    GLOBICK = 'GLOBICK'
}

export enum SuccessEventMethodTypes {
    CREDIT_CARD = 'CREDIT_CARD',
    SOFORT = 'SOFORT',
    IDEAL = 'IDEAL',
    PAYPAL = 'PAYPAL',
    BIZUM = 'BIZUM',
    NEMURU = 'NEMURU',
    FREE = 'FREE'
}

export enum SuccessEventCreditCardTypes {
    AX = 'AX',
    CA = 'CA',
    DC = 'DC',
    DS = 'DS',
    EL = 'EL',
    JC = 'JC',
    TP = 'TP',
    UP = 'UP',
    VI = 'VI'
}