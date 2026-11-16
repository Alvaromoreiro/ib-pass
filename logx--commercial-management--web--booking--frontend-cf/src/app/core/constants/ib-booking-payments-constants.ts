import { SummaryProps } from 'commercial-management--digital--web-components-design--library';
import { PaymentsInfoType } from '../models/ib-booking-payments/ib-booking-payments-model';
import { BookingAppConstants } from './ib-booking-constants';

export const SummaryDefaultModel: SummaryProps = {
    trips: [],
    passengers: {
        onClick: (pass: string) => {},
        types: [],
        total: ''
    },
    ancillaries: [],
    otherItems: [],
    isMultiTrip: false,
    totalPrice: '',
    avios: null,
    totalDcc: null,
    onholdPrice: null,
    upgradingBid: null,
    priceModalClick: null
};

export const DiscountsToReset = [BookingAppConstants.DISCOUNT_TYPES.PARTNER, BookingAppConstants.DISCOUNT_TYPES.VOUCHER, BookingAppConstants.DISCOUNT_TYPES.REWARDS];
export const BkiPmtConstants = {
    COMPONENT: {
        CHARGES: {
            FEE: 'fee',
            DONATION: 'UNICEF'
        },
        DISCOUNT: {
            VOUCHER: 'VOUCHER',
            REWARDS: 'REWARDS'
        }
    },
    BASKET: {
        OTHERS:{
            FEE: 'CARD',
            DONATION: 'DONATION'
        }
    },
    SUMMARY: {
        OTHERS: 'OTHER_CHARGES',
        DISCOUNTS: 'DISCOUNTS'
    },
    PAYMENT_TYPES: {
        ONHOLD: 'ONHOLD'
    }
};

export const defaultPaymentInfo: PaymentsInfoType = <PaymentsInfoType> <unknown> {
    creditCardsInfo: {
        creditCardsList: []
    },
    sessionId: '',
    currency: <Currency> {},
    relatedContent: {
        original: {},
        transformed: {
            CONDITIONS: {},
            TOTAL_PRICE: {}
        }
    },
    originalPaymentMethods: [],
    paymentMethods: [],
    requiredAdditionalFields: {
        paymentMethods: [],
        info: {}
    },
    availableDiscounts: {},
    appliedDiscounts: {
        status: false,
        types: {}
    },
    somethingToPay: false,
    isOnHoldOrder: null,
    paymentId: '',
    price: {
        totalPrice: 0,
        formattedTotalPrice: '',
        formattedOldPriceInfo: '',
        textTotalPrice: '',
        showTotalPrice: false
    },
    selectedPaymentInfo: {},
    iberiaPayLoadingIframe: false,
    psd2Warning: false,
    fullAvios: false,
    nemuru: {
        available: false,
        quotas: []
    },
    isReducedCreditCardForm: false,
    customerCreditCards: {
        CREDITCARD: [],
        IBERIA_PAY: []
    }
};
