import { TestBed } from '@angular/core/testing';
import { VoluntaryRefundsTabTransformer } from '@src/components/ib-MmB-booking-dashboard/components/ib-MmB-voluntary-refunds-tab/transformers/ib-MmB-voluntary-refunds-tab.transformer';
import { SummaryAncillariesRefund } from '@src/components/ib-MmB-booking-dashboard/components/ib-MmB-voluntary-refunds-tab/models/ib-voluntary-refunds-tab-transformer-model';
import { CurrencyServiceMock } from '@test/unit/utils/CurrencyServiceMocks';
import { StorageServiceMock } from '@test/unit/utils/StorageServiceMock';
import { CurrencyObject, CurrencyResponse } from '@src/components/services/Utils/models/currency-type.model';

const fakeData = require('@test/mocks/responses/voluntary-refunds-data-service-mock.json');
let fakeBookingInfoContextMetadataAndQualifiers = require('@test/mocks/storage/booking-info-context-metadata-and-qualifiers-mock.json');
let fakeCommercialInfoCurrency = require('@test/mocks/storage/commercial-info-currency-mock.json');
let fakeCurrency = require('@test/mocks/storage/currency-mock.json');

export function initSummaryAncillariesRefund(): SummaryAncillariesRefund {
    return {
        serviceType: '',
        slice: []
    }
}

export function createBlankSummaryAncillariesRefund(): SummaryAncillariesRefund {
    const summaryAncillariesRefund = initSummaryAncillariesRefund();

    return summaryAncillariesRefund;
}

describe('transformer: ibMmbVoluntaryRefundsTabTransformer', () => {
    let transformer: VoluntaryRefundsTabTransformer;
    let fakeCommonsSessionStorageService: any = new StorageServiceMock();
    let fakeAJSCurrencyUtilsService: any = new CurrencyServiceMock();


    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [VoluntaryRefundsTabTransformer],
            providers: []
        });
        transformer = new VoluntaryRefundsTabTransformer(fakeCommonsSessionStorageService, fakeAJSCurrencyUtilsService);

        fakeCommonsSessionStorageService.set('bookingInfo', fakeBookingInfoContextMetadataAndQualifiers);
        fakeCommonsSessionStorageService.set('commercialInfo', fakeCommercialInfoCurrency);
        fakeCommonsSessionStorageService.set('currency', fakeCurrency);
    });

    it('should create the component when init', () => {
        expect(transformer).toBeTruthy();
    });

    it('should voluntaryRefundsTransfomedInfo ALL DATA', () => {
        let responseData = {
            less24Hours: true,
            price: {
                currency: 'EUR',
                symbol: '€',
                avios: 0,
                cash: 9210,
                tax: 3443.04,
                ticketingFee: 0,
                totalAvios: 0,
                totalCash: 12653.04,
                totalRefundPrice: 12653.04
            },
            penalty: {
                currency: 'Other',
                symbol: '€',
                avios: 0,
                cash: 0,
                formatPenalty: '0€'
            },
            totalRefund: '12653.04€',
            totalRefundWithoutPenalty: '12653.04€',
            totalBookingPrice: '12653.04€',
            noRefundPrice: '0€',
            summaryRefund: [
                {
                    passengerType: 'ADULT',
                    quantityPassenger: 6,
                    avios: 0,
                    cash: 200,
                    formatCash: '200€',
                    tax: 50,
                    formatTax: '50€',
                    currency: 'EUR',
                    symbol: '€',
                    totalAvios: 0,
                    totalCash: 1500,
                    formatTotalCash: '1500€'
                }
            ],
            summaryAncillariesRefund: [
                {
                    serviceType: "seat",
                    slice: [
                        {
                            "sliceId": "",
                            "segment": [
                                {
                                    "segmentId": "IB044820240219",
                                    "origin": {
                                        "description": "",
                                        "code": ""
                                    },
                                    "destination": {
                                        "description": "",
                                        "code": ""
                                    },
                                    "groupsType": [
                                        {
                                            "subtype": undefined,
                                            "quantity": 2,
                                            "avios": 0,
                                            "cash": 10,
                                            "formatCash": "10€",
                                            "currency": "EUR",
                                            "symbol": "€",
                                            "totalAvios": 0,
                                            "totalCash": 20,
                                            "formatTotalCash": "20€"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    serviceType: 'priorityBoarding',
                    slice: [
                        {
                            "sliceId": "MADBIO20240619072500",
                            "segment": [
                                {
                                    "segmentId": "IB044820240219",
                                    "origin": {
                                        "description": "",
                                        "code": ""
                                    },
                                    "destination": {
                                        "description": "",
                                        "code": ""
                                    },
                                    "groupsType": [
                                        {
                                            "subtype": undefined,
                                            "quantity": 1,
                                            "avios": 0,
                                            "cash": 134,
                                            "formatCash": "134€",
                                            "currency": "EUR",
                                            "symbol": "€",
                                            "totalAvios": 0,
                                            "totalCash": 134,
                                            "formatTotalCash": "134€"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    serviceType: 'baggage',
                    slice: [
                        { sliceId: 'MADBIO20240619072500', segment: [{ segmentId: '', origin: { description: 'Madrid', code: 'MAD' }, destination: { description: 'Bilbao', code: 'BIO' }, groupsType: [{ subtype: 'BAGGAGE_15', quantity: 5, avios: 0, cash: 60, formatCash: '60€', currency: 'EUR', symbol: '€', totalAvios: 0, totalCash: 300, formatTotalCash: '300€' }, { subtype: 'BAGGAGE_32', quantity: 2, avios: 0, cash: 120, formatCash: '120€', currency: 'EUR', symbol: '€', totalAvios: 0, totalCash: 240, formatTotalCash: '240€' }, { subtype: 'BAGGAGE_23', quantity: 3, avios: 0, cash: 75, formatCash: '75€', currency: 'EUR', symbol: '€', totalAvios: 0, totalCash: 225, formatTotalCash: '225€' }] }] },
                        { sliceId: 'BIOMAD20231228174000', segment: [{ segmentId: '', origin: { description: 'Bilbao', code: 'BIO' }, destination: { description: 'Madrid', code: 'MAD' }, groupsType: [{ subtype: 'BAGGAGE_15', quantity: 4, avios: 0, cash: 60, formatCash: '60€', currency: 'EUR', symbol: '€', totalAvios: 0, totalCash: 240, formatTotalCash: '240€' }, { subtype: 'BAGGAGE_32', quantity: 1, avios: 0, cash: 120, formatCash: '120€', currency: 'EUR', symbol: '€', totalAvios: 0, totalCash: 120, formatTotalCash: '120€' }, { subtype: 'BAGGAGE_23', quantity: 1, avios: 0, cash: 75, formatCash: '75€', currency: 'EUR', symbol: '€', totalAvios: 0, totalCash: 75, formatTotalCash: '75€' }] }] }
                    ]
                },

            ],
            summaryAncillariesNotRefund: [
                { serviceType: 'specialEquipment' },
                { serviceType: 'creditCardFee' }
            ],
            summaryAncillariesNotRefundOnline: [
                { serviceType: 'preOrder' },
                { serviceType: 'globickV2' },
                { serviceType: 'insurance' },
                { serviceType: 'wineClub' },
                { serviceType: 'bob' },
                { serviceType: 'stopover' }
            ],
            summaryPenalty: {
                summaryPassengerPenalties: [
                    { passengerType: 'ADULT', quantityPassenger: 6, avios: 0, cash: 0, formatCash: '0€', currency: 'USD', symbol: '$', totalAvios: 0, totalCash: 0, formatTotalCash: '0€' }
                ]
            },
            withPayments: true,
            noPenalty: '0€',
            refundItems: ['seat', 'priorityBoarding', 'baggage', 'TAXES'],
            notRefundItems: ['specialEquipment', 'creditCardFee'],
            notRefundOnlineItems: ['preOrder', 'globickV2', 'insurance', 'wineClub', 'bob', 'stopover'],
            taxes: {
                listTaxedRefundInfo: [
                    {
                        type: "YQ",
                        parcial: false,
                        refundable: false
                    },
                    {
                        type: "OTHER",
                        parcial: false,
                        refundable: false
                    }
                ]
            },
            listFareBasisRefundInfo: [
                {
                    sliceId: 'MADBIO20240619072500',
                    refundable: true,
                    segmentIds: ["IB650120231220"],
                    noShow: true,
                    refundableNoShow: true
                },
                {
                    sliceId: 'BIOMAD20231228174000',
                    refundable: false,
                    segmentIds: ["IB650020231228"],
                    noShow: false,
                    refundableNoShow: false
                },
            ],
            onlyRefundAirportTaxes: false,
            mixRefundNotRefundFare: false,
            refundType: 'TOTAL',
            totalBookingAmountLongCurrency: {
                lgView: false,
                xlView: false
            },
            formatPenaltyLongCurrency: {
                lgView: false,
                xlView: false
            },
            totalRefundLongCurrency: {
                lgView: false,
                xlView: false
            },
            noRefundPriceLongCurrency: {
                lgView: false,
                xlView: false
            },
            longCurrencyLgView: false,
            longCurrencyXlView: false
        }
        expect(transformer.voluntaryRefundsTransfomedInfo(fakeData)).toEqual(responseData);
    });

    it('should createBlankSummaryAncillariesRefund ', () => {
        transformer['createBlankSummaryAncillariesRefund']();
    });

    it('should updateInfoPrice private method', () => {
        let mockData: any = {
            order: {
                price: {
                    currency: 'EUR',
                    fare: 20,
                    tax: 10,
                    ticketingFee: 5,
                    total: 35
                }
            },
            reshopDifferential: {
                refundPrice: {
                    fare: 20
                }
            }
        }
        expect(transformer['updateInfoPrice'](mockData)).toEqual({ currency: 'EUR', symbol: '€', avios: 0, cash: 20, tax: 10, ticketingFee: 5, totalAvios: 0, totalCash: 35, totalRefundPrice: 20 });
    });

    it('should updateInfoPenalty private method', () => {
        let mockDataUpdatePenalty: any = {
            reshopDifferential: {
                penalty: {
                    currency: 'EUR',
                    fare: 50
                }
            }
        }
        expect(transformer['updateInfoPenalty'](mockDataUpdatePenalty)).toEqual({ currency: 'EUR', symbol: '€', avios: 0, cash: 50, formatPenalty: '50€' });
    });

    it('should updateInfoSummaryRefund private method with two Passengers EQUAL TYPE', () => {
        let mockDataSummaryRefund0: any = {
            detailedReshopDifferentials: [{
                type: "flight",
                passengerID: "ADULT_01",
                saleFareDifference: {
                    fare: 30,
                    currency: "EUR"
                },
                saleTaxTotalDifference: {
                    fare: 0,
                    currency: "EUR"
                }
            },
            {
                type: "flight",
                passengerID: "ADULT_02",
                saleFareDifference: {
                    fare: 30,
                    currency: "EUR"
                },
                saleTaxTotalDifference: {
                    fare: 0,
                    currency: "EUR"
                }
            }],
            passengers: [{
                passengerId: 'ADULT_01',
                passengerType: 'ADULT'
            },
            {
                passengerId: 'ADULT_02',
                passengerType: 'ADULT'
            }]
        }
        expect(transformer['updateInfoSummaryRefund'](mockDataSummaryRefund0)).toEqual([{ passengerType: 'ADULT', quantityPassenger: 2, avios: 0, cash: 30, formatCash: '30€', tax: 0, formatTax: '0€', currency: 'EUR', symbol: '€', totalAvios: 0, totalCash: 60, formatTotalCash: '60€' }]);
    });

    it('should updateInfoSummaryRefund private method with two Passengers EQUAL and two diferent passengers types ', () => {
        let mockDataSummaryRefund1: any = {
            detailedReshopDifferentials: [{
                type: "flight",
                passengerID: "ADULT_01",
                saleFareDifference: {
                    fare: 30,
                    currency: "EUR"
                },
                saleTaxTotalDifference: {
                    fare: 0,
                    currency: "EUR"
                }
            },
            {
                type: "flight",
                passengerID: "ADULT_02",
                saleFareDifference: {
                    fare: 30,
                    currency: "EUR"
                },
                saleTaxTotalDifference: {
                    fare: 0,
                    currency: "EUR"
                }
            },
            {
                type: "flight",
                passengerID: "INFANT_01",
                saleFareDifference: {
                    fare: 30,
                    currency: "EUR"
                },
                saleTaxTotalDifference: {
                    fare: 0,
                    currency: "EUR"
                }
            },
            {
                type: "flight",
                passengerID: "INFANT_02",
                saleFareDifference: {
                    fare: 30,
                    currency: "EUR"
                },
                saleTaxTotalDifference: {
                    fare: 0,
                    currency: "EUR"
                }
            }],
            passengers: [{
                passengerId: 'ADULT_01',
                passengerType: 'ADULT'
            },
            {
                passengerId: 'ADULT_02',
                passengerType: 'ADULT'
            },
            {
                passengerId: 'INFANT_01',
                passengerType: 'INFANT'
            },
            {
                passengerId: 'INFANT_02',
                passengerType: 'INFANT'
            }]
        }
        expect(transformer['updateInfoSummaryRefund'](mockDataSummaryRefund1)).toEqual([{ passengerType: 'ADULT', quantityPassenger: 2, avios: 0, cash: 30, formatCash: '30€', tax: 0, formatTax: '0€', currency: 'EUR', symbol: '€', totalAvios: 0, totalCash: 60, formatTotalCash: '60€' }, { passengerType: 'INFANT', quantityPassenger: 2, avios: 0, cash: 30, formatCash: '30€', tax: 0, formatTax: '0€', currency: 'EUR', symbol: '€', totalAvios: 0, totalCash: 60, formatTotalCash: '60€' }]);
    });

    xit('should updateInfoSummaryAncillariesRefund private method two ancillarie without slices', () => {
        let mockDataAncillaries0: any = {
            order: {
                orderItems: [{
                    sliceId: '0123',
                    type: 'baggage',
                    subtype: "BAGGAGE_15",
                    price: {
                        currency: 'EUR',
                        fare: 30,
                        tax: 0,
                        total: 30
                    }
                },
                {
                    sliceId: '01',
                    type: 'baggage',
                    subtype: "BAGGAGE_15",
                    price: {
                        currency: 'EUR',
                        fare: 30,
                        tax: 0,
                        total: 30
                    }
                }],
                slices: [],
            },

            passengers: [{
                passengerId: 'ADULT_01',
                passengerType: 'ADULT'
            }]
        }
        expect(transformer['updateInfoSummaryAncillariesRefund'](mockDataAncillaries0)).toEqual([{ serviceType: 'baggage', slice: [{ sliceId: '0123', segment: [{ segmentId: '', origin: { description: '', code: '' }, destination: { description: '', code: '' }, groupsType: [{ subtype: 'BAGGAGE_15', quantity: 1, avios: 0, cash: 30, formatCash: '30€', currency: 'EUR', symbol: '€', totalAvios: 0, totalCash: 30, formatTotalCash: '30€' }] }] }, { sliceId: '', segment: [{ segmentId: '', origin: { description: '', code: '' }, destination: { description: '', code: '' }, groupsType: [{ subtype: 'BAGGAGE_15', quantity: 1, avios: 0, cash: 30, formatCash: '30€', currency: 'EUR', symbol: '€', totalAvios: 0, totalCash: 30, formatTotalCash: '30€' }] }] }] }]);
    });

    xit('should updateInfoSummaryAncillariesRefund private method two ancillarie without segments', () => {
        let mockDataAncillaries1: any = {
            order: {
                orderItems: [{
                    sliceId: '0123',
                    type: 'baggage',
                    subtype: "BAGGAGE_15",
                    price: {
                        currency: 'EUR',
                        fare: 30,
                        tax: 0,
                        total: 30
                    }
                },
                {
                    sliceId: '01',
                    type: 'baggage',
                    subtype: "BAGGAGE_15",
                    price: {
                        currency: 'EUR',
                        fare: 30,
                        tax: 0,
                        total: 30
                    }
                }],
                slices: [{
                    sliceId: '0123',
                    segments: []
                },
                {
                    sliceId: '01',

                }],
            },

            passengers: [{
                passengerId: 'ADULT_01',
                passengerType: 'ADULT'
            }]
        }
        expect(transformer['updateInfoSummaryAncillariesRefund'](mockDataAncillaries1)).toEqual([{ serviceType: 'baggage', slice: [{ sliceId: '0123', segment: [{ segmentId: '', origin: { description: '', code: '' }, destination: { description: '', code: '' }, groupsType: [{ subtype: 'BAGGAGE_15', quantity: 1, avios: 0, cash: 30, formatCash: '30€', currency: 'EUR', symbol: '€', totalAvios: 0, totalCash: 30, formatTotalCash: '30€' }] }] }, { sliceId: '', segment: [{ segmentId: '', origin: { description: '', code: '' }, destination: { description: '', code: '' }, groupsType: [{ subtype: 'BAGGAGE_15', quantity: 1, avios: 0, cash: 30, formatCash: '30€', currency: 'EUR', symbol: '€', totalAvios: 0, totalCash: 30, formatTotalCash: '30€' }] }] }] }]);
    });

    xit('should updateInfoSummaryAncillariesRefund private method two ancillarie', () => {
        let mockDataAncillaries2: any = {
            order: {
                orderItems: [{
                    sliceId: '0123',
                    type: 'baggage',
                    subtype: 'BAGGAGE_15',
                    price: {
                        currency: 'EUR',
                        fare: 30,
                        tax: 0,
                        total: 30
                    }
                },
                {
                    sliceId: '0123',
                    type: 'baggage',
                    subtype: 'BAGGAGE_23',
                    price: {
                        currency: 'EUR',
                        fare: 30,
                        tax: 0,
                        total: 30
                    }
                },
                {
                    sliceId: '01',
                    type: 'baggage',
                    subtype: 'BAGGAGE_15',
                    price: {
                        currency: 'EUR',
                        fare: 30,
                        tax: 0,
                        total: 30
                    }
                },
                {
                    sliceId: '01',
                    type: 'baggage',
                    subtype: 'BAGGAGE_32',
                    price: {
                        currency: 'EUR',
                        fare: 30,
                        tax: 0,
                        total: 30
                    }
                }],
                slices: [{
                    sliceId: '0123',
                    segments: [{
                        id: '3',
                        arrival: {
                            city: {
                                description: 'Madrid',
                                code: 'MAD'
                            }
                        },
                        departure: {
                            city: {
                                description: 'Bilbao',
                                code: 'BIO'
                            }
                        }
                    }]
                },
                {
                    sliceId: '01',
                    segments: [{
                        id: '4',
                        arrival: {
                            city: {
                                description: 'Barcelona',
                                code: 'BCN'
                            }
                        },
                        departure: {
                            city: {
                                description: 'A Coruña',
                                code: 'LCG'
                            }
                        }
                    }]
                }]
            },

            passengers: [{
                passengerId: 'ADULT_01',
                passengerType: 'ADULT'
            },
            {
                passengerId: 'ADULT_02',
                passengerType: 'ADULT'
            }]
        }
        expect(transformer['updateInfoSummaryAncillariesRefund'](mockDataAncillaries2)).toEqual([
            {
                serviceType: 'baggage',
                slice: [
                    {
                        sliceId: '0123',
                        segment: [{
                            segmentId: '',
                            origin: {
                                description: 'Madrid',
                                code: 'MAD'
                            },
                            destination: {
                                description: 'Bilbao',
                                code: 'BIO'
                            },
                            groupsType: [
                                {
                                    subtype: 'BAGGAGE_15',
                                    quantity: 2,
                                    avios: 0,
                                    cash: 30,
                                    formatCash: '30€',
                                    currency: 'EUR',
                                    symbol: '€',
                                    totalAvios: 0,
                                    totalCash: 60,
                                    formatTotalCash: '60€'
                                }
                            ]
                        }]
                    },
                    {
                        sliceId: '',
                        segment: [
                            {
                                segmentId: '',
                                origin: {
                                    description: 'Barcelona',
                                    code: 'BCN'
                                },
                                destination: {
                                    description: 'A Coruña',
                                    code: 'LCG'
                                },
                                groupsType: [
                                    {
                                        subtype: 'BAGGAGE_15',
                                        quantity: 1,
                                        avios: 0,
                                        cash: 30,
                                        formatCash: '30€',
                                        currency: 'EUR',
                                        symbol: '€',
                                        totalAvios: 0,
                                        totalCash: 30,
                                        formatTotalCash: '30€'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]);
    });


    it('should updateInfoSummaryPenalty private method', () => {
        let mockDataSummaryPenalty: any = {
            detailedReshopDifferentials: [{
                type: 'flight',
                passengerID: 'ADULT_01',
                penalty: {
                    currency: "EUR",
                    fare: 30.00
                },
            },
            {
                type: 'flight',
                passengerID: 'ADULT_02',
                penalty: {
                    currency: "EUR",
                    fare: 30.00
                },
            }
            ],
            passengers: [{
                passengerId: 'ADULT_01',
                passengerType: 'ADULT'
            },
            {
                passengerId: 'ADULT_02',
                passengerType: 'ADULT'
            }]
        }
        expect(transformer['updateInfoSummaryPenalty'](mockDataSummaryPenalty)).toEqual({ summaryPassengerPenalties: [{ passengerType: 'ADULT', quantityPassenger: 2, avios: 0, cash: 30.00, formatCash: '30€', currency: 'EUR', symbol: '€', totalAvios: 0, totalCash: 60.00, formatTotalCash: '60€' }] });
    });

    it('should getSymbol private method with EUR currency', () => {
        let currency = 'EUR';
        expect(transformer['getSymbol'](currency)).toEqual('€');
    });

    it('should getSymbol private method with USD currency', () => {
        let currency = 'USD';
        expect(transformer['getSymbol'](currency)).toEqual('$');
    });
    it('should getSymbol private method with default currency', () => {
        let currency = 'Other';
        expect(transformer['getSymbol'](currency)).toEqual('€');
    });


    it('should getCurrencyObj private method with bookingInfo', () => {
        let responseCurrency: CurrencyResponse = {
            "description": "Euro",
            "currencySymbol": "€",
            "alignment": "R",
            "groupingSeparator": ".",
            "decimalSeparator": ",",
            "suffixSymbol": false,
            "numberDecimals": 2
        }
        expect(transformer['getCurrencyObj']()).toEqual(responseCurrency);
    });
    it('should getCurrencyObj private method without bookingInfo', () => {
        let responseCurrencyCommercial: CurrencyResponse = {
            "description": "Euro",
            "currencySymbol": "€",
            "alignment": "R",
            "groupingSeparator": ".",
            "decimalSeparator": ",",
            "suffixSymbol": false,
            "numberDecimals": 2
        }
        fakeCommonsSessionStorageService.set('bookingInfo', false);
        expect(transformer['getCurrencyObj']()).toEqual(responseCurrencyCommercial);
    });

    it('when updateInfoSummaryAncillariesNotRefund private method called mixRefundNotRefundFare is true', () => {
        let mockData = {
            order: {
                orderItems: [{
                    sliceId: '0123',
                    type: 'baggage',
                    subtype: "BAGGAGE_15",
                    price: {
                        currency: 'EUR',
                        fare: 30,
                        tax: 0,
                        total: 30
                    }
                }],
                slices: [],
            },
            passengers: [{
                passengerId: 'ADULT_01',
                passengerType: 'ADULT'
            }],
            listFareBasisRefundInfo: [
                {
                    sliceId: 'MADSDQ20231220115000',
                    refundable: true,
                    segmentIds: ["IB650120231220"],
                    noShow: true,
                    refundableNoShow: true
                },
                {
                    sliceId: 'SDQMAD20231228174000',
                    refundable: false,
                    segmentIds: ["IB650020231228"],
                    noShow: false,
                    refundableNoShow: false
                },
            ],
            less24Hours: false
        };
        //@ts-ignore
        transformer['updateInfoSummaryAncillariesNotRefund'](mockData);
        expect(transformer.mixRefundNotRefundFare).toBe(true);
        expect(transformer.onlyRefundAirportTaxes).toBe(false);
    });

    it('when updateInfoSummaryAncillariesNotRefund private method called onlyRefundAirportTaxes is true', () => {
        let mockData = {
            order: {
                orderItems: [{
                    sliceId: '0123',
                    type: 'baggage',
                    subtype: "BAGGAGE_15",
                    price: {
                        currency: 'EUR',
                        fare: 30,
                        tax: 0,
                        total: 30
                    }
                }],
                slices: [],
            },
            passengers: [{
                passengerId: 'ADULT_01',
                passengerType: 'ADULT'
            }],
            listFareBasisRefundInfo: [
                {
                    sliceId: 'MADSDQ20231220115000',
                    refundable: false,
                    segmentIds: ["IB650120231220"],
                    noShow: true,
                    refundableNoShow: false
                },
                {
                    sliceId: 'SDQMAD20231228174000',
                    refundable: false,
                    segmentIds: ["IB650020231228"],
                    noShow: false,
                    refundableNoShow: false
                },
            ],
            less24Hours: false
        };
        //@ts-ignore
        transformer['updateInfoSummaryAncillariesNotRefund'](mockData);
        expect(transformer.onlyRefundAirportTaxes).toBe(true);
        expect(transformer.mixRefundNotRefundFare).toBe(false);
    });

    it('should return lgView true for value longer than minLengthLgView', () => {
        const result = (transformer)['verifyFigureLength']('1234567890', 9, 12);
        expect(result.lgView).toBe(true);
        expect(result.xlView).toBe(false);
    });
    
    it('should return lgView true for value longer than minLengthLgView', () => {
        const result = (transformer)['verifyFigureLength']('1234567890123', 9, 12);
        expect(result.lgView).toBe(true);
        expect(result.xlView).toBe(true);
    });

    it('should return both lgView and xlView false for value shorter than minLengthLgView', () => {
        const result = (transformer)['verifyFigureLength']('12345', 9, 12);
        expect(result.lgView).toBe(false);
        expect(result.xlView).toBe(false);
    });

    it('should return lgView false and xlView true for value equal to minLengthXlView', () => {
        const result = (transformer)['verifyFigureLength']('12345678901', 9, 12);
        expect(result.lgView).toBe(true); 
        expect(result.xlView).toBe(false); 
    });

});
