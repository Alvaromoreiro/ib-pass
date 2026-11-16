import { IbBookingPriceDetailModalTransformer } from '@shared/components/ib-booking-price-detail-modal/ib-booking-price-detail-modal.transformer';
import { OrderItem } from '@src/app/core/models/ib-booking-on-hold-confirmation/ib-booking-on-hold-confirmation-component-model';

// Types to avoid primitive obsession
interface TestPrice {
    fare: number;
    tax: number;
    total: number;
    ticketingFee: number;
    currency: string;
}

interface TestTax {
    code: string;
    amount: number;
    description: string;
    subcode: string;
    country: string;
    carrier: string;
    currency: string;
}

interface PassengerPriceConfig {
    passengerId: string;
    fareCalculation: string;
    price: TestPrice;
    taxes?: TestTax[];
}

interface OrderItemConfig {
    orderItemId: string;
    price: TestPrice;
    passengerPrices: any[];
    sliceId?: string;
}

interface ValidationConfig {
    result: any[];
    passengerIdFragment: string;
    expectedPrice: TestPrice;
}

type PassengerId = 'ADT_001' | 'ADT_002' | 'CHD_001' | 'INF_001' | 'SENIOR_001_SPECIAL';
type CurrencyCode = 'EUR';
type TaxCode = 'YQ' | 'YR';

describe('IbBookingPriceDetailModalTransformer', () => {
    // Typed constants to avoid primitive obsession
    const TEST_CONSTANTS = {
        CURRENCY: 'EUR' as CurrencyCode,
        PASSENGER_IDS: {
            ADT_001: 'ADT_001' as PassengerId,
            ADT_002: 'ADT_002' as PassengerId,
            CHD_001: 'CHD_001' as PassengerId,
            INF_001: 'INF_001' as PassengerId,
            SENIOR_001_SPECIAL: 'SENIOR_001_SPECIAL' as PassengerId
        },
        PRICES: {
            ADT: { fare: 100, tax: 20, total: 120, ticketingFee: 0, currency: 'EUR' } as TestPrice,
            CHD: { fare: 60, tax: 12, total: 72, ticketingFee: 0, currency: 'EUR' } as TestPrice,
            INF: { fare: 30, tax: 6, total: 36, ticketingFee: 0, currency: 'EUR' } as TestPrice
        },
        TAXES: {
            YQ: { code: 'YQ', amount: 15, description: 'Fuel surcharge', subcode: 'YQ', country: 'ES', carrier: 'IB', currency: 'EUR' } as TestTax,
            YR: { code: 'YR', amount: 5, description: 'Security tax', subcode: 'YR', country: 'ES', carrier: 'IB', currency: 'EUR' } as TestTax
        }
    };

    // Factory methods using typed interfaces to reduce primitive obsession
    const createPrice = (fare: number, tax: number, total: number): TestPrice => ({
        fare,
        tax,
        total,
        currency: TEST_CONSTANTS.CURRENCY,
        ticketingFee: 0
    });

    const createTax = (code: TaxCode, amount: number, description: string): TestTax => ({
        code,
        amount,
        currency: TEST_CONSTANTS.CURRENCY,
        description,
        subcode: code,
        country: 'ES',
        carrier: 'IB'
    });

    const createPassengerPrice = (config: PassengerPriceConfig) => ({
        fareCalculation: config.fareCalculation,
        passengerId: config.passengerId,
        price: config.price,
        segmentPrices: [],
        taxes: config.taxes || [],
        orderItemPaymentInfos: []
    });

    const createOrderItem = (config: OrderItemConfig): OrderItem => ({
        type: 'flight',
        orderItemId: config.orderItemId,
        bookingReferences: [],
        price: config.price,
        sliceIds: [config.sliceId || 'slice-001'],
        passengerPrices: config.passengerPrices
    });

    const validateOfferItemForPassengerType = (config: ValidationConfig): void => {
        const item = config.result.find(r => r.passengerIds.some((id: string) => id.includes(config.passengerIdFragment)));
        expect(item).toBeDefined();
        expect(item!.price).toEqual(config.expectedPrice);
    };

    describe('transformOrderItemToOfferItem', () => {

        describe('Basic functionality', () => {
            it('should return empty array when input is empty', () => {
                const result = IbBookingPriceDetailModalTransformer.transformOrderItemToOfferItem([]);
                
                expect(result).toEqual([]);
            });

            it('should handle OrderItem with no passenger prices', () => {
                const orderItem = createOrderItem({
                    orderItemId: 'order-001',
                    price: TEST_CONSTANTS.PRICES.ADT,
                    passengerPrices: []
                });
                
                const result = IbBookingPriceDetailModalTransformer.transformOrderItemToOfferItem([orderItem]);
                
                expect(result).toEqual([]);
            });
        });

        describe('Single passenger transformations', () => {
            it('should transform OrderItem with one ADT passenger', () => {
                const passengerPrice = createPassengerPrice({
                    passengerId: TEST_CONSTANTS.PASSENGER_IDS.ADT_001,
                    fareCalculation: 'ADT-BASE',
                    price: TEST_CONSTANTS.PRICES.ADT,
                    taxes: [TEST_CONSTANTS.TAXES.YQ, TEST_CONSTANTS.TAXES.YR]
                });
                const orderItem = createOrderItem({
                    orderItemId: 'order-001',
                    price: TEST_CONSTANTS.PRICES.ADT,
                    passengerPrices: [passengerPrice]
                });

                const result = IbBookingPriceDetailModalTransformer.transformOrderItemToOfferItem([orderItem]);

                expect(result.length).toBe(1);
                expect(result[0]).toBeDefined();
                expect(result[0]).toEqual({
                    offerItemId: undefined,
                    price: TEST_CONSTANTS.PRICES.ADT,
                    passengerIds: [TEST_CONSTANTS.PASSENGER_IDS.ADT_001],
                    privateFareInformation: undefined,
                    originCurrencyPrice: undefined,
                    detailedTaxes: [TEST_CONSTANTS.TAXES.YQ, TEST_CONSTANTS.TAXES.YR]
                });
            });

            it('should correctly extract passenger type from complex passengerId', () => {
                const passengerPrice = createPassengerPrice({
                    passengerId: TEST_CONSTANTS.PASSENGER_IDS.SENIOR_001_SPECIAL,
                    fareCalculation: 'ADT-BASE',
                    price: createPrice(90, 18, 108)
                });
                const orderItem = createOrderItem({
                    orderItemId: 'order-001',
                    price: createPrice(90, 18, 108),
                    passengerPrices: [passengerPrice]
                });

                const result = IbBookingPriceDetailModalTransformer.transformOrderItemToOfferItem([orderItem]);

                expect(result.length).toBe(1);
                expect(result[0]).toBeDefined();
                expect(result[0].passengerIds).toEqual([TEST_CONSTANTS.PASSENGER_IDS.SENIOR_001_SPECIAL]);
            });
        });

        describe('Multiple passengers of same type', () => {
            it('should group passengers of same type correctly', () => {
                const passengerPrices = [
                    createPassengerPrice({ passengerId: TEST_CONSTANTS.PASSENGER_IDS.ADT_001, fareCalculation: 'ADT-BASE', price: TEST_CONSTANTS.PRICES.ADT }),
                    createPassengerPrice({ passengerId: TEST_CONSTANTS.PASSENGER_IDS.ADT_002, fareCalculation: 'ADT-BASE', price: TEST_CONSTANTS.PRICES.ADT })
                ];
                const orderItem = createOrderItem({
                    orderItemId: 'order-001',
                    price: createPrice(200, 40, 240),
                    passengerPrices
                });

                const result = IbBookingPriceDetailModalTransformer.transformOrderItemToOfferItem([orderItem]);

                expect(result.length).toBe(1);
                expect(result[0]).toBeDefined();
                expect(result[0].passengerIds).toEqual([TEST_CONSTANTS.PASSENGER_IDS.ADT_001, TEST_CONSTANTS.PASSENGER_IDS.ADT_002]);
                expect(result[0].price).toEqual(TEST_CONSTANTS.PRICES.ADT);
            });
        });

        describe('Multiple passenger types', () => {
            it('should create separate offer items for different passenger types', () => {
                const passengerPrices = [
                    createPassengerPrice({ passengerId: TEST_CONSTANTS.PASSENGER_IDS.ADT_001, fareCalculation: 'ADT-BASE', price: createPrice(150, 30, 180) }),
                    createPassengerPrice({ passengerId: TEST_CONSTANTS.PASSENGER_IDS.CHD_001, fareCalculation: 'CHD-BASE', price: createPrice(120, 24, 144) }),
                    createPassengerPrice({ passengerId: TEST_CONSTANTS.PASSENGER_IDS.INF_001, fareCalculation: 'INF-BASE', price: TEST_CONSTANTS.PRICES.INF })
                ];
                const orderItem = createOrderItem({
                    orderItemId: 'order-001',
                    price: createPrice(300, 60, 360),
                    passengerPrices
                });

                const result = IbBookingPriceDetailModalTransformer.transformOrderItemToOfferItem([orderItem]);

                expect(result.length).toBe(3);
                
                validateOfferItemForPassengerType({ result, passengerIdFragment: 'ADT_001', expectedPrice: createPrice(150, 30, 180) });
                validateOfferItemForPassengerType({ result, passengerIdFragment: 'CHD_001', expectedPrice: createPrice(120, 24, 144) });
                validateOfferItemForPassengerType({ result, passengerIdFragment: 'INF_001', expectedPrice: TEST_CONSTANTS.PRICES.INF });
            });
        });

        describe('Multiple order items', () => {
            it('should consolidate passengers of same type across OrderItems', () => {
                const orderItems = [
                    createOrderItem({
                        orderItemId: 'order-001',
                        price: TEST_CONSTANTS.PRICES.ADT,
                        passengerPrices: [createPassengerPrice({ passengerId: TEST_CONSTANTS.PASSENGER_IDS.ADT_001, fareCalculation: 'ADT-BASE', price: TEST_CONSTANTS.PRICES.ADT })]
                    }),
                    createOrderItem({
                        orderItemId: 'order-002',
                        price: TEST_CONSTANTS.PRICES.ADT,
                        passengerPrices: [createPassengerPrice({ passengerId: TEST_CONSTANTS.PASSENGER_IDS.ADT_002, fareCalculation: 'ADT-BASE', price: TEST_CONSTANTS.PRICES.ADT })],
                        sliceId: 'slice-002'
                    })
                ];

                const result = IbBookingPriceDetailModalTransformer.transformOrderItemToOfferItem(orderItems);
                expect(result.length).toBe(2);
                expect(result[0]).toBeDefined();
                expect(result[0].passengerIds).toEqual([TEST_CONSTANTS.PASSENGER_IDS.ADT_001, TEST_CONSTANTS.PASSENGER_IDS.ADT_002]);
            });

            it('should handle complex scenario with multiple OrderItems and passenger types', () => {
                const orderItems = [
                    createOrderItem({
                        orderItemId: 'order-001',
                        price: createPrice(200, 40, 240),
                        passengerPrices: [
                            createPassengerPrice({ passengerId: TEST_CONSTANTS.PASSENGER_IDS.ADT_001, fareCalculation: 'ADT-BASE', price: TEST_CONSTANTS.PRICES.ADT }),
                            createPassengerPrice({ passengerId: TEST_CONSTANTS.PASSENGER_IDS.CHD_001, fareCalculation: 'CHD-BASE', price: TEST_CONSTANTS.PRICES.CHD })
                        ]
                    }),
                    createOrderItem({
                        orderItemId: 'order-002',
                        price: TEST_CONSTANTS.PRICES.ADT,
                        passengerPrices: [createPassengerPrice({ passengerId: TEST_CONSTANTS.PASSENGER_IDS.ADT_002, fareCalculation: 'ADT-BASE', price: TEST_CONSTANTS.PRICES.ADT })],
                        sliceId: 'slice-002'
                    })
                ];

                const result = IbBookingPriceDetailModalTransformer.transformOrderItemToOfferItem(orderItems);
                expect(result.length).toBe(4);
                
                const adtItem = result.find(item => item.passengerIds.includes(TEST_CONSTANTS.PASSENGER_IDS.ADT_001));
                const chdItem = result.find(item => item.passengerIds.includes(TEST_CONSTANTS.PASSENGER_IDS.CHD_001));
                
                expect(adtItem).toBeDefined();
                expect(chdItem).toBeDefined();
                expect(adtItem!.passengerIds).toEqual([TEST_CONSTANTS.PASSENGER_IDS.ADT_001, TEST_CONSTANTS.PASSENGER_IDS.ADT_002]);
                expect(chdItem!.passengerIds).toEqual([TEST_CONSTANTS.PASSENGER_IDS.CHD_001]);
            });
        });
    });
});
