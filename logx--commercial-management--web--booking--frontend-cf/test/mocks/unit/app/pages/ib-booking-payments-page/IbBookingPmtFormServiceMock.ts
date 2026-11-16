import { PriceSubscriptionModel, Currency, PriceEntriesTypes } from '@src/app/core/models/ib-booking-payments/ib-booking-payments-model';

export const PmtComponentPriceMock: PriceSubscriptionModel = <PriceSubscriptionModel> <unknown> {
    total: 6,
    currency: {} as Currency,
    discounts: [
        { id: 'VOUCHER', type: 'VOUCHER', total: 3 }
    ],
    charges: [
        { type: PriceEntriesTypes.DONATION, id: 'UNICEF', name: 'UNICEF', total: 3 },
        { type: PriceEntriesTypes.FEE, id: 'fee', name: 'Credit card fee', total: 3 }
    ]
};
export const PmtComponentPriceBaseMock: PriceSubscriptionModel = <PriceSubscriptionModel> <unknown> {
    total: 100,
    currency: {} as Currency,
    charges: [],
    discounts: []
};

export const PmtComponentPriceHasAviosAndVoucher: PriceSubscriptionModel = <PriceSubscriptionModel> <unknown> {
    total: 6,
    currency: {} as Currency,
    discounts: [
        { id: 'VOUCHER', type: 'VOUCHER', total: 3 },
        { id: 'REWARDS', type: 'REWARDS', total: 3 }
    ],
    charges: [
        { type: PriceEntriesTypes.DONATION, id: 'UNICEF', name: 'UNICEF', total: 3 },
        { type: PriceEntriesTypes.FEE, id: 'fee', name: 'Credit card fee', total: 3 }
    ]
};

export const PmtComponentPriceHasAvios: PriceSubscriptionModel = <PriceSubscriptionModel> <unknown> {
    total: 6,
    currency: {} as Currency,
    discounts: [
        { id: 'REWARDS', type: 'REWARDS', total: 3 }
    ],
    charges: [
        { type: PriceEntriesTypes.DONATION, id: 'UNICEF', name: 'UNICEF', total: 3 },
        { type: PriceEntriesTypes.FEE, id: 'fee', name: 'Credit card fee', total: 3 }
    ]
};
const PmtComponentEvents = {
    'price': {...PmtComponentPriceBaseMock},
    'payment': {
        status: 'INITIALIZATION',
        method: 'CREDIT_CARD'
    },
    // 'error': {
    //     code: 'ERROR',
    //     description: 'ERROR_DESCRIPTION',
    //     continuePayment: () => {}
    // },
    'error': {
        status: 'FAILED',
        errorItemList: [ {
            code: 'ERROR',
            description: 'ERROR_DESCRIPTION',
            continuePayment: () => {}
        } ]
    }
};
export class IbBookingPmtFormServiceMock {
    public getNewPaymentComponent = async () => {
        const subscribe = ( eventName: string, callback: ( data: any ) => void ): void => { callback(PmtComponentEvents[eventName]); };
        return {
            subscribe
        };
    };

    public getPaymentContext = jasmine.createSpy('getPaymentContext').and.callFake(()=> Promise.resolve({contextId:'context', warnings:[]}));
    importWebComponent = jasmine.createSpy( 'importWebComponent' );
}
