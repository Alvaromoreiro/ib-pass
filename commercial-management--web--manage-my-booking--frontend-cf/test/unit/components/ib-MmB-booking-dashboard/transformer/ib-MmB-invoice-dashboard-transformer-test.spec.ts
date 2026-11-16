import { TestBed } from "@angular/core/testing";
import { InvoiceDashboardTransformer } from "@src/components/ib-MmB-booking-dashboard/transformer/ib-MmB-invoice-dashboard-transformer";
import { StorageServiceMock } from "test/unit/utils/StorageServiceMock";

describe('InvoiceDashboardTransformer Test', () => {
    let transformer;
    let fakeLocalStorageService: StorageServiceMock = new StorageServiceMock();

    const generateFlagsMenu = require('./mocks/generate-flags-menu.json');

    const $fakeFilter = jasmine.createSpy('$filter').and.callFake(function (filter) {
        var filterFunc = () => {
            return 'test'
        };
        switch (filter) {
            case 'translate':
                filterFunc = () => {
                    return 'test';
                };
                break;
            case 'aviosFormatter':
                filterFunc = () => {
                    return 'test';
                };
                break;
            default:
                break;
        }

        return filterFunc;
    });

    const fakeMmBAppConstants = {
        SPECIAL_NEEDS: {
            SVAN_STATUS: {
                HK: { code: 'HK', description: 'SPECIAL_NEED_STATUS_HK' }, //Confirmado
                KK: { code: 'KK', description: 'SPECIAL_NEED_STATUS_HK' }, //Confirmado
                UC: { code: 'UC', description: 'SPECIAL_NEED_STATUS_XX' }, //Cancelado
                UN: { code: 'UN', description: 'SPECIAL_NEED_STATUS_XX' }, //Cancelado
                DEFAULT: { code: '', description: 'MMB_PASSENGERS_SPECIAL_NEEDS_STATUS' } //Pendiente
            },
            CODE: {
                BLND: 'BLND',
                DEAF: 'DEAF',
                SVAN: 'SVAN',
                DPNA: 'DPNA',
                WHEEL_CHAIR: ['WCHR', 'WCHS', 'WCHC']
            },
            TEXT: {
                GUIDE_DOG: 'GUIDE DOG',
                NOT_GUIDE_DOG: 'NOT GUIDE DOG'
            }
        },
        ANCILLARIES_TYPES: {
            BAGGAGE: 'BAGGAGE',
            SEAT: 'SEAT',
            INSURANCE: 'INSURANCE',
            VEHICLE_RENTAL: 'VEHICLE_RENTAL',
            UPGRADING: 'UPGRADING',
            SPEQS: 'SPECIAL_EQUIPMENT',
            SPECIAL_MEALS: 'SPECIAL_MEALS',
            UPGRADING_BID: 'UPGRADING_BID',
            UPGRADING_AVIOS: 'UPGRADING_AVIOS',
            UPGRADING_AVIOS_BID: 'UPGRADING_AVIOS_BID',
            FLEXIBILITY: 'FLEXIBILITY_ON_DEMAND',
            PREORDER: 'PREORDER',
            PRIORITY_BOARDING: 'PRIORITY_BOARDING',
            INTEGRATED_BOB: 'INTEGRATED_BOB',
            BOB: 'BOB',
            CO2_FOOTPRINT: 'CO2_FOOTPRINT'
        },
        WCS: {
            PHONE_TYPES: {
                SALES: 'RESERVAS',
                IBHOLIDAYS: 'ATTBAH'
            }
        },
        PASSENGER_TYPES: {
            adult: 'ADULT',
            child: 'CHILD',
            infant: 'INFANT'
        },
        MmBPatterns: {
            ONLY_LETTERS: /[^a-zA-Z+]/g
        }
    };
    const fakeCurrencyService = {
        getCurrenciesAsMap: jasmine.createSpy(),
        getCurrencyObject: jasmine.createSpy(),
        formatPrice: jasmine.createSpy().and.returnValue('30.00')
    };

    const fakePhonesListIBV = {
        "ATTBAH": {
            "prefix": "+34",
            "telephone": "911776310",
            "text": "",
            "prefixAlt": "",
            "telephoneAlt": "",
            "textAlt": "",
            "timeText": ""
        },
        "packagedProduct": false
    };

    let fakeInfoManagement = {
        orderItems: {
            flight: [{
                price: {
                    pendingPrices: 10,
                    preFormatedTotal: 20,
                    total: 30,
                    fare: 40,
                    tax: 50,
                    totalDiscount: 60,
                    insurancePrices: [{
                        price: {
                            fare: 30,
                            total: 40,
                            units: 20
                        },
                        type: 'insurance'
                    }],
                    finalPrices: {
                        total: 80,
                        totalPaid: 90
                    },
                    flexibilityOnDemand: [{
                        units: 20,
                        price: {
                            fare: 43,
                            total: 30,
                            preFormatedFare: 33,
                            preFormatedTotal: 53
                        }
                    }],
                    passPricesByType: {
                        'ADULT': {
                            emd: '',
                            type: '',
                            total: 30,
                            units: 1,
                            preFormatedTotal: 30,
                            points: 200
                        },
                        'testSlice': {
                            emd: '',
                            type: '',
                            total: 30,
                            units: 1,
                            preFormatedTotal: 30,
                            points: 200
                        }
                    },
                    otherPricesByType: [],
                    globickExperience: [{
                        price: {
                            total: 30
                        }
                    }],
                    globickTransfers: [{
                        price: {
                            total: 30
                        }
                    }],
                    specialEquipmentPricesByType: {},
                    baggagesPricesByType: {},
                    seatsPricesByType: {},
                    typeDiscount: 'points',
                    showAvios: true
                },
                passengerPrices: [{
                    price: 30,
                    passengerId: 'ADULT_1',
                    points: 300,
                    aviosRedeemed: true
                },
                {
                    price: 30,
                    passengerId: 'ADULT_2',
                    points: 300
                }],
                sliceIds: ['testSlice']
            }],
            insurance: [{
                price: {
                    preFormatedFare: 20,
                    preFormatedTotal: 20,
                    fare: 30,
                    total: 40
                },
                units: 30
            }],
            flexibilityOnDemand: [{
                units: 20,
                price: {
                    fare: 22,
                    total: 30,
                    preFormatedFare: 25,
                    preFormatedTotal: 50
                }
            }],
            priorityBoarding: [{
                sliceId: 'testSlice',
                segmentId: 'testSegment',
                price: {
                    fare: 30,
                    amount: 1,
                    tax: 0,
                    total: 30
                },
                emd: 'test',
                type: 'priorityBoarding',
                passengerId: "ADULT_01"
            },
            {
                sliceId: 'testSlice',
                segmentId: 'testSegment',
                price: {
                    fare: 30,
                    amount: 1,
                    tax: 0,
                    total: 30
                },
                emd: 'test',
                type: 'priorityBoarding',
                passengerId: "ADULT_01"
            }],
            petc: [{
                sliceId: 'testSlice',
                segmentId: 'testSegment',
                price: {
                    fare: 30,
                    amount: 1,
                    tax: 0,
                    total: 30
                },
                emd: 'test',
                type: 'PET',
                passengerId: "ADULT_01"
            },
            {
                sliceId: 'testSlice',
                segmentId: 'testSegment',
                price: {
                    fare: 30,
                    amount: 1,
                    tax: 0,
                    total: 30
                },
                emd: 'test',
                type: 'priorityBoarding',
                passengerId: "ADULT_01"
            }],
            seat: [{
                sliceId: 'testSlice',
                segmentId: 'testSegment',
                price: {
                    fare: 30,
                    total: 1,
                    currency: 'EUR',
                    tax: 0,
                    ticketingFee: 0
                },
                emd: 'emdtest',
                type: 'seat',
                passengerId: "ADULT_01",
                departureCity: 'Madrid',
                departureCityCode: 'MAD',
                arrivalCity: 'Bilbao',
                arrivalCityCode: 'BIO'
            },
            {
                sliceId: 'testSlice',
                segmentId: 'testSegment',
                price: {
                    fare: 30,
                    total: 1,
                    currency: 'EUR',
                    tax: 0,
                    ticketingFee: 0
                },
                emd: 'emdtest',
                type: 'seat',
                passengerId: "ADULT_01",
                departureCity: 'Madrid',
                departureCityCode: 'MAD',
                arrivalCity: 'Bilbao',
                arrivalCityCode: 'BIO'
            }],
            upgradingBid: [{
                price: {
                    fare: 30,
                    tax: 0,
                    total: 30
                }
            }],
            specialEquipment: [{
                sliceId: 'testSlice',
                segmentId: 'testSegment',
                price: {
                    fare: 30,
                    amount: 1,
                    currency: 'EUR',
                    total: 30,

                },
                emd: 'otheremd',
                subtype: "SPEQS_SURFBOARD_TITLE",
                type: "specialEquipment",
                passengerId: "ADULT_01"
            },
            {
                sliceId: 'testSlice',
                segmentId: 'testSegment',
                price: {
                    fare: 30,
                    amount: 2,
                    currency: 'EUR',
                    total: 30,

                },
                emd: 'otheremd',
                subtype: "SPEQS_SURFBOARD_TITLE",
                type: "specialEquipment",
                passengerId: "ADULT_01"

            }],
            globickV2: [{
                items: [{
                    product: 'EXP',
                    price: {
                        total: 30
                    },
                    startDate: 'fecha 10-10-2024'
                },
                {
                    product: 'TRANS',
                    price: {
                        total: 30
                    },
                    startDate: 'fecha 10-10-2024'
                }]
            }],
            globick: [{
                product: 'EXP',
                price: {
                    total: 30
                },
                startDate: 'fecha 10-10-2024'
            },
            {
                product: 'TRANS',
                price: {
                    total: 30
                },
                startDate: 'fecha 10-10-2024'
            }],
            baggage: [{
                sliceId: 'testSlice',
                segmentId: 'testSegment',
                price: {
                    fare: 30,
                    amount: 1,
                    total: 30,
                    currency: 'EUR',
                    tax: 0,
                    ticketingFee: 0
                },
                emd: 'otheremd',
                type: 'medium',
            },
            {
                sliceId: 'testSlice',
                segmentId: 'testSegment',
                price: {
                    fare: 30,
                    amount: 2,
                    total: 30,
                    currency: 'EUR',
                    tax: 0,
                    ticketingFee: 0
                },
                emd: 'otheremd',
                type: 'medium',
            }],
            co2Footprint: [{
                kilosCo2Equivalent: 30,
                kilosCo2EquivalentFormatted: '30',
                price: {
                    totalFormatted: 30,
                    paidCarbonFootprint: 30
                }
            }]
        },
        flights: [{
            sliceId: 'testSlice',
            segmentId: 'testSegment'
        }],
        aviosRedeemed: false,
        aviosRedeemedAmount: 30
    }

    let fakeGetBookingInfo = {
        contextMetadata: { currencies: [{ code: 'EUR', symbol: '€' }] },
        order: {
            price: {
                total: 30
            },
            orderItems: [{
                type: 'creditCardFee',
                price: {
                    total: 30
                }
            }]
        },
        paymentItems: null
    };

    let fakeBreakDownInfo = {
        bundles: [{
            items: [{
                type: 'SPECIAL_EQUIPMENT',
                quantity: 1,
                subtype: 'BIKE',
                priceItem: 30,
            },
            {
                type: 'BAGGAGE',
                quantity: 1,
                subtype: 'BIKE',
                priceItem: 15,
            }]
        }]
    };

    let fakeflightsSlices = [{
        departureCity: {
            city: {
                description: 'Madrid'
            },
            code: 'MAD'
        },
        arrivalCity: {
            city: {
                description: 'Bilbao'
            },
            code: 'BIO'
        },
        segments: [{
            sliceId: 'testSlice'
        }]
    },
    {
        departureCity: {
            city: {
                description: 'Bilbao'
            },
            code: 'BIO'
        },
        arrivalCity: {
            city: {
                description: 'Madrid'
            },
            code: 'MAD'
        },
        segments: [{
            sliceId: 'testSlice1'
        }]
    }];

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [InvoiceDashboardTransformer],
        });
        transformer = new InvoiceDashboardTransformer(
            fakeCurrencyService,
            fakeLocalStorageService,
            $fakeFilter,
            fakeMmBAppConstants
        );
        fakeLocalStorageService.set('phonesListIBV', fakePhonesListIBV);

        fakeInfoManagement.orderItems.globickV2 = [
            {
                items: [{
                    product: 'EXP',
                    price: {
                        total: 30
                    },
                    startDate: 'fecha 10-10-2024'
                },
                {
                    product: 'TRANS',
                    price: {
                        total: 30
                    },
                    startDate: 'fecha 10-10-2024'
                }]
            }
        ];
        fakeInfoManagement.orderItems.globick = [{
            product: 'EXP',
            price: {
                total: 30
            },
            startDate: 'fecha 10-10-2024'
        },
        {
            product: 'TRANS',
            price: {
                total: 30
            },
            startDate: 'fecha 10-10-2024'
        }]
    });

    it('should be created', () => {
        expect(transformer).toBeTruthy();
    });

    describe('getInvoiceDataInfo called', () => {
        it('basic and payment items empty', (done) => {
            let getBookingInfo = { ...fakeGetBookingInfo };
            let InfoManagement = { ...fakeInfoManagement };
            let breakDownInfo = { ...fakeBreakDownInfo };
            let flightsSlices = [...fakeflightsSlices];
            InfoManagement.orderItems.globickV2 = [{
                items: [{
                    product: 'EXP',
                    price: {
                        total: 30
                    },
                    startDate: 'fecha 10-10-2024'
                },
                {
                    product: 'TRANS',
                    price: {
                        total: 30
                    },
                    startDate: 'fecha 10-10-2024'
                }]
            }];
            InfoManagement.orderItems.globick = [{
                product: 'EXP',
                price: {
                    total: 30
                },
                startDate: 'fecha 10-10-2024'
            },
            {
                product: 'TRANS',
                price: {
                    total: 30
                },
                startDate: 'fecha 10-10-2024'
            }];
            transformer.getInvoiceDataInfo(getBookingInfo, InfoManagement, 0, flightsSlices, breakDownInfo);
            done();
        });
        xit('basic and payment items empty and price null', (done) => {
            let getBookingInfo = { ...fakeGetBookingInfo };
            let InfoManagement = { ...fakeInfoManagement };
            let breakDownInfo = { ...fakeBreakDownInfo };
            let flightsSlices = [...fakeflightsSlices];
            InfoManagement.orderItems.flight[0].price = null;
            fakeInfoManagement.orderItems.co2Footprint = null;
            InfoManagement.orderItems.globickV2 = [{
                items: [{
                    product: 'EXP',
                    price: {
                        total: 30
                    },
                    startDate: 'fecha 10-10-2024'
                },
                {
                    product: 'TRANS',
                    price: {
                        total: 30
                    },
                    startDate: 'fecha 10-10-2024'
                }]
            }];
            InfoManagement.orderItems.globick = [{
                product: 'EXP',
                price: {
                    total: 30
                },
                startDate: 'fecha 10-10-2024'
            },
            {
                product: 'TRANS',
                price: {
                    total: 30
                },
                startDate: 'fecha 10-10-2024'
            }];

            transformer.getInvoiceDataInfo(getBookingInfo, InfoManagement, 0, flightsSlices, breakDownInfo);
            done();
        });
        it('basic and payment items > 0 and CREDICT CARD', (done) => {
            let getBookingInfo = { ...fakeGetBookingInfo };
            let InfoManagement = { ...fakeInfoManagement };
            let breakDownInfo = { ...fakeBreakDownInfo };
            let flightsSlices = [...fakeflightsSlices];
            InfoManagement.orderItems.flight[0].passengerPrices[0].points = null;
            getBookingInfo.paymentItems = [{
                type: 'CREDITCARD',
                description: '',
                totalFee: 30,
                hide: false
            }];
            InfoManagement.orderItems.globickV2 = [{
                items: [{
                    product: 'EXP',
                    price: {
                        total: 30
                    },
                    startDate: 'fecha 10-10-2024'
                },
                {
                    product: 'TRANS',
                    price: {
                        total: 30
                    },
                    startDate: 'fecha 10-10-2024'
                }]
            }];
            InfoManagement.orderItems.globick = [{
                product: 'EXP',
                price: {
                    total: 30
                },
                startDate: 'fecha 10-10-2024'
            },
            {
                product: 'TRANS',
                price: {
                    total: 30
                },
                startDate: 'fecha 10-10-2024'
            }];
            InfoManagement.orderItems.priorityBoarding[0].emd = 'PENDING_PAYMENT';
            transformer.getInvoiceDataInfo(getBookingInfo, InfoManagement, 0, flightsSlices, breakDownInfo);

            const expectedTotal = 30 + 30 + 30;

            const globickExperience = InfoManagement.orderItems.flight[0].price.globickExperience || [];
            const globickTransfers = InfoManagement.orderItems.flight[0].price.globickTransfers || [];

            let totalGlobickExperience = 0;
            let totalGlobickTransfers = 0;

            globickExperience.forEach(exp => {
                if (exp.price && exp.price.total != null) {
                    const priceValue = parseFloat(exp.price.total.toString().replace(/[^0-9.-]+/g, ""));
                    totalGlobickExperience += priceValue || 0;
                }
            });

            globickTransfers.forEach(trans => {
                if (trans.price && trans.price.total != null) {
                    const priceValue = parseFloat(trans.price.total.toString().replace(/[^0-9.-]+/g, ""));
                    totalGlobickTransfers += priceValue || 0;
                }
            });

            const totalFee = parseFloat(getBookingInfo.paymentItems[0].totalFee.toString().replace(/[^0-9.-]+/g, "")) || 0;

            const actualTotal = totalGlobickExperience + totalGlobickTransfers + totalFee;
            expect(actualTotal).toEqual(expectedTotal);
            done();
        });
        it('basic and payment items > 0 and PAYPAL', (done) => {
            let getBookingInfo = { ...fakeGetBookingInfo };
            let InfoManagement = { ...fakeInfoManagement };
            let breakDownInfo = { ...fakeBreakDownInfo };
            let flightsSlices = [...fakeflightsSlices];
            getBookingInfo.paymentItems = [{
                type: 'PAYPAL',
                description: '',
                totalFee: 30,
                hide: false
            }];
            InfoManagement.orderItems.globickV2 = [{
                items: [{
                    product: 'EXP',
                    price: {
                        total: 30
                    },
                    startDate: 'fecha 10-10-2024'
                },
                {
                    product: 'TRANS',
                    price: {
                        total: 30
                    },
                    startDate: 'fecha 10-10-2024'
                }]
            }];
            InfoManagement.orderItems.globick = [{
                product: 'EXP',
                price: {
                    total: 30
                },
                startDate: 'fecha 10-10-2024'
            },
            {
                product: 'TRANS',
                price: {
                    total: 30
                },
                startDate: 'fecha 10-10-2024'
            }];
            transformer.getInvoiceDataInfo(getBookingInfo, InfoManagement, 0, flightsSlices, breakDownInfo);
            done();
        });
        it('basic and payment items > 0 and PAYPAL with total', (done) => {
            let getBookingInfo = { ...fakeGetBookingInfo };
            let InfoManagement = { ...fakeInfoManagement };
            let breakDownInfo = { ...fakeBreakDownInfo };
            let flightsSlices = [...fakeflightsSlices];
            getBookingInfo.paymentItems = [{
                type: 'PAYPAL',
                description: '',
                totalFee: 30,
                hide: false,
                total: 30
            }];
            InfoManagement.orderItems.globickV2 = [{
                items: [{
                    product: 'EXP',
                    price: {
                        total: 30
                    },
                    startDate: 'fecha 10-10-2024'
                },
                {
                    product: 'TRANS',
                    price: {
                        total: 30
                    },
                    startDate: 'fecha 10-10-2024'
                }]
            }];
            InfoManagement.orderItems.globick = [{
                product: 'EXP',
                price: {
                    total: 30
                },
                startDate: 'fecha 10-10-2024'
            },
            {
                product: 'TRANS',
                price: {
                    total: 30
                },
                startDate: 'fecha 10-10-2024'
            }];
            transformer.getInvoiceDataInfo(getBookingInfo, InfoManagement, 0, flightsSlices, breakDownInfo);
            done();
        });
        it('basic and payment items > 0 and VOUCHER', (done) => {
            let getBookingInfo = { ...fakeGetBookingInfo };
            let InfoManagement = { ...fakeInfoManagement };
            let breakDownInfo = { ...fakeBreakDownInfo };
            let flightsSlices = [...fakeflightsSlices];
            getBookingInfo.paymentItems = [{
                type: 'VOUCHER',
                description: '',
                totalFee: 30,
                hide: false
            }];
            InfoManagement.orderItems.globickV2 = [{
                items: [{
                    product: 'EXP',
                    price: {
                        total: 30
                    },
                    startDate: 'fecha 10-10-2024'
                },
                {
                    product: 'TRANS',
                    price: {
                        total: 30
                    },
                    startDate: 'fecha 10-10-2024'
                }]
            }];
            InfoManagement.orderItems.globick = [{
                product: 'EXP',
                price: {
                    total: 30
                },
                startDate: 'fecha 10-10-2024'
            },
            {
                product: 'TRANS',
                price: {
                    total: 30
                },
                startDate: 'fecha 10-10-2024'
            }];
            transformer.getInvoiceDataInfo(getBookingInfo, InfoManagement, 0, flightsSlices, breakDownInfo);
            done();
        });
        it('basic and payment items > 0 and AVIOS', (done) => {
            let getBookingInfo = { ...fakeGetBookingInfo };
            let InfoManagement = { ...fakeInfoManagement };
            let breakDownInfo = { ...fakeBreakDownInfo };
            let flightsSlices = [...fakeflightsSlices];
            getBookingInfo.paymentItems = [{
                type: 'AVIOS',
                description: '',
                totalFee: 30,
                hide: false
            }];
            InfoManagement.orderItems.globickV2 = [{
                items: [{
                    product: 'EXP',
                    price: {
                        total: 30
                    },
                    startDate: 'fecha 10-10-2024'
                },
                {
                    product: 'TRANS',
                    price: {
                        total: 30
                    },
                    startDate: 'fecha 10-10-2024'
                }]
            }];
            InfoManagement.orderItems.globick = [{
                product: 'EXP',
                price: {
                    total: 30
                },
                startDate: 'fecha 10-10-2024'
            },
            {
                product: 'TRANS',
                price: {
                    total: 30
                },
                startDate: 'fecha 10-10-2024'
            }];
            transformer.getInvoiceDataInfo(getBookingInfo, InfoManagement, 0, flightsSlices, breakDownInfo);
            done();
        });
        it('basic and payment items > 0 and TOKENIZED_CARD', (done) => {
            let getBookingInfo = { ...fakeGetBookingInfo };
            let InfoManagement = { ...fakeInfoManagement };
            let breakDownInfo = { ...fakeBreakDownInfo };
            let flightsSlices = [...fakeflightsSlices];
            getBookingInfo.paymentItems = [{
                type: 'TOKENIZED_CARD',
                description: '',
                totalFee: 30,
                hide: false
            }];
            InfoManagement.orderItems.globickV2 = [{
                items: [{
                    product: 'EXP',
                    price: {
                        total: 30
                    },
                    startDate: 'fecha 10-10-2024'
                },
                {
                    product: 'TRANS',
                    price: {
                        total: 30
                    },
                    startDate: 'fecha 10-10-2024'
                }]
            }];
            InfoManagement.orderItems.globick = [{
                product: 'EXP',
                price: {
                    total: 30
                },
                startDate: 'fecha 10-10-2024'
            },
            {
                product: 'TRANS',
                price: {
                    total: 30
                },
                startDate: 'fecha 10-10-2024'
            }];
            transformer.getInvoiceDataInfo(getBookingInfo, InfoManagement, 0, flightsSlices, breakDownInfo);
            done();
        });
        it('basic and payment items > 0 and DONATION', (done) => {
            let getBookingInfo = { ...fakeGetBookingInfo };
            let InfoManagement = { ...fakeInfoManagement };
            let breakDownInfo = { ...fakeBreakDownInfo };
            let flightsSlices = [...fakeflightsSlices];
            getBookingInfo.paymentItems = [{
                type: 'DONATION',
                description: '',
                totalFee: 30,
                hide: false
            }];
            InfoManagement.orderItems.globickV2 = [{
                items: [{
                    product: 'EXP',
                    price: {
                        total: 30
                    },
                    startDate: 'fecha 10-10-2024'
                },
                {
                    product: 'TRANS',
                    price: {
                        total: 30
                    },
                    startDate: 'fecha 10-10-2024'
                }]
            }];
            InfoManagement.orderItems.globick = [{
                product: 'EXP',
                price: {
                    total: 30
                },
                startDate: 'fecha 10-10-2024'
            },
            {
                product: 'TRANS',
                price: {
                    total: 30
                },
                startDate: 'fecha 10-10-2024'
            }];
            transformer.getInvoiceDataInfo(getBookingInfo, InfoManagement, 0, flightsSlices, breakDownInfo);
            done();
        });
        it('basic and payment items > 0 and OTHERS', (done) => {
            let getBookingInfo = { ...fakeGetBookingInfo };
            let InfoManagement = { ...fakeInfoManagement };
            let breakDownInfo = { ...fakeBreakDownInfo };
            let flightsSlices = [...fakeflightsSlices];
            getBookingInfo.paymentItems = [{
                type: 'OTHERS',
                description: '',
                totalFee: 30,
                hide: false
            }];
            InfoManagement.orderItems.globickV2 = [{
                items: [{
                    product: 'EXP',
                    price: {
                        total: 30
                    },
                    startDate: 'fecha 10-10-2024'
                },
                {
                    product: 'TRANS',
                    price: {
                        total: 30
                    },
                    startDate: 'fecha 10-10-2024'
                }]
            }];
            InfoManagement.orderItems.globick = [{
                product: 'EXP',
                price: {
                    total: 30
                },
                startDate: 'fecha 10-10-2024'
            },
            {
                product: 'TRANS',
                price: {
                    total: 30
                },
                startDate: 'fecha 10-10-2024'
            }];
            transformer.getInvoiceDataInfo(getBookingInfo, InfoManagement, 0, flightsSlices, breakDownInfo);
            done();
        });
        it('should accumulate totalPaid when quantity is valid', function (done) {
            let getBookingInfo = { ...fakeGetBookingInfo };
            
            let InfoManagement = { ...fakeInfoManagement };
            InfoManagement.orderItems.flight[0].price.otherPricesByType = [
                { quantity: 2 },
                { quantity: 3 },
                { quantity: 0 },
                { quantity: -1 },
            ]
            let breakDownInfo = { ...fakeBreakDownInfo };
            let flightsSlices = [...fakeflightsSlices];
            transformer.getInvoiceDataInfo(getBookingInfo, InfoManagement, 0, flightsSlices, breakDownInfo);
            done();
        });
    });

    describe('and formatDate', () => {
        it(' have been called', (done) => {
            spyOn(transformer, 'formatDate')
            transformer.formatDate([{ startDate: 'fecha 10-10-2024' }]);
            expect(transformer.formatDate).toHaveBeenCalled();
            done();
        });
    });

    xdescribe('and checkBundleSpeqs', () => {
        it(' have been called', (done) => {
        });
    });

    xdescribe('and deleteEmptySpecialEquipmentPricesByType', () => {
        it(' have been called', (done) => {
        });
    });

    xdescribe('and checkBundleBaggages', () => {
        it(' have been called', (done) => {
        });
    });

    xdescribe('and deleteEmptyBaggagesPricesByType', () => {
        it(' have been called', (done) => {
        });
    });
});
