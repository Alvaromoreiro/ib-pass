import { GetContextResponse } from '@src/app/shared/http-services/sse-orm/ib-payment-context.service';
import { FareOnHoldOptions } from '../generic-models/fare-models';
import { ShowPassegenerTaxesModal } from './ib-booking-summary-model';

export interface NewPaymentAvailableResponse {
    'available': boolean
}
export interface PaymentWebComponent {
    init: (config: PaymentComponentConfig) => Promise<void>;
    subscribe: (subscription: PmtWebComponentSubs, callback: (data: any) => void, errorLists?: string[]) => void;
}
export interface PaymentComponentConfig {
    target?: HTMLElement | string;
    contextId: string;
    customStyles?: CustomizedStyles;
    onPaymentSuccess: (OnPaymentSuccessEvent) => void;
    onError: (OnErrorEvent) => void;
    auth:Auth
}

export enum PmtWebComponentSubs {
    PRICE = 'price',
    PAYMENT = 'payment',
    ERROR = 'error'
}

export enum OnErrorEventStatus {
    UNAUTHORIZED = 'UNAUTHORIZED',
    DENIED_FRAUD = 'DENIED_FRAUD',
    UNKNOWN = 'UNKNOWN'
}

export enum SuccessEventStatus {
    COMPLETED = 'COMPLETED',
    PARTIALLY_PAID = 'PARTIALLY_PAID'
}

export enum SuccessEventUnpaidItems {
    INSURANCE = 'INSURANCE',
    DONATION = 'DONATION',
    GLOBICK = 'GLOBICK',
    ASSISTCARD = 'ASSIST_CARD'
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

export enum PriceEntriesTypes {
    DONATION = 'DONATION',
    FEE = 'FEE'
}
export interface OnErrorEvent{
    status: keyof typeof OnErrorEventStatus;
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


export type PriceSubscriptionModel = {
    total: number;
    currency: Currency;
    charges: PriceEntries[];
    discounts: DiscountsEntries[];
    currencyConversion: CurrencyConversionModel;
};

export interface CurrencyConversionModel {
    currency:string;
    total:number;
}
export interface ErrorSubscriptionModel {
    status:        string;
    errorItemList: ErrorItemList[];
}

export interface ErrorItemList {
    code:        string;
    description: string;
    continuePayment?:()=> Promise <any>
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

export interface PmtPageTitleInfo {
    isFree: boolean;
    hours: number;
}
export interface PmtPageOnHoldInfo {
    titleInfo: PmtPageTitleInfo | undefined;
    isOnHold: boolean;
}

export type Currency = {
    code: string;
    format: CurrencyDisplayFormat;
};

export type CurrencyDisplayFormat = {
    symbol?: {
        value?: string;
        alignment?: Alignment;
    };
    decimalDigits?: {
        value?: number;
        rounding?: Rounding;
    };
    separator?: {
        decimal?: string;
        grouping?: string;
    };
};

export type Alignment = 'L' | 'R';

export type Rounding = 'UP' | 'DOWN';

export type PriceEntries = {
    name: string;
    total: number;
    id: string;
    type: keyof typeof PriceEntriesTypes;
    value?: number;
};

export type DiscountsEntries = {
    id: string;
    total: number;
    type: 'VOUCHER' | 'REWARDS';
    rewardValue?: number;
    rewardCurrency?: string;
    description?: string;
    partner?: Partner;
};

export interface Partner {
    id: string;
    name?: string;
    description?: string;
}

export interface SetSummaryInfoProps {
    showPassegenerTaxesModal?: ShowPassegenerTaxesModal;
    selectedOnHold?: FareOnHoldOptions;
    priceModalClick?: () => void;
}

export interface PaymentsInfoType {
    creditCardsInfo: {
        creditCardsList: any[]
    },
    sessionId: string;
    currency: Currency;
    relatedContent: {
        original: any | null;
        transformed: {
            CONDITIONS: any | null;
            TOTAL_PRICE: any | null;
        }
    },
    originalPaymentMethods: any[],
    paymentMethods: any[],
    requiredAdditionalFields: {
        paymentMethods: any[],
        info: any | null;
    },
    availableDiscounts: any | null;
    appliedDiscounts: {
        status: boolean;
        types: any | null;
    },
    somethingToPay: boolean;
    isOnHoldOrder: null,
    paymentId: string;
    price: {
        totalPrice: number;
        formattedTotalPrice: string;
        formattedOldPriceInfo: string;
        textTotalPrice: string;
        showTotalPrice: boolean;
    },
    selectedPaymentInfo: any | null;
    iberiaPayLoadingIframe: boolean;
    psd2Warning: boolean;
    fullAvios: false,
    nemuru: {
        available: boolean;
        quotas: any[];
    },
    isReducedCreditCardForm: boolean;
    customerCreditCards: {
        CREDITCARD: any[];
        IBERIA_PAY: any[];
    }
}

export interface PmtRedirectionInfo{
    contextResponse: GetContextResponse;
    paymentCompleted: boolean;
}