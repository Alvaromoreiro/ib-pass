export interface NewPaymentAvailableResponse {
    'available': boolean
}
export interface PaymentComponentConfig {
    target?: HTMLElement | string;
    contextId: string;
    customStyles?: CustomizedStyles;
    onPaymentSuccess: (OnSuccessEvent) => void;
    onError: (OnErrorEvent) => void;
    auth:Auth
}

export interface OnErrorEvent{
    status: 'FAILED_PAYMENT' |
    'UNKNOWN' |
    'UNAUTHORIZED' |
    'CONTEXT_NOT_FOUND' |
    'NO_AVAILABLE_PAYMENT_METHODS' |
    'EXCEED_ATTEMPS' |
    'DENIED_FRAUD' |
    'PREVIOUSLY_PROCESED'
}

export interface OnSuccessEvent{
    status:  keyof typeof SuccessEventStatus;
    methodType: keyof typeof SuccessEventMethodTypes;
    details?: OnPaymentSuccessEventDetails;
    unpaidItemList?: OnPaymentSuccessUnpaidItemsList[]
}

export interface OnPaymentSuccessEventDetails {
    creditCardType?: keyof typeof SuccessEventCreditCardTypes;
}

export interface OnPaymentSuccessUnpaidItemsList {
    type: keyof typeof SuccessEventUnpaidItems;
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

export interface ErrorSubscriptionModel  {
    code:string
    description?:string
    continuePayment?:()=>void
}

export enum SuccessEventStatus {
    COMPLETED = 'COMPLETED',
    PARTIALLY_PAID = 'PARTIALLY_PAID'
}

export enum SuccessEventUnpaidItems {
    INSURANCE = 'INSURANCE',
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
