// @ts-nocheck
'use strict';
jasmine.getEnv().allowRespy(true);
describe('test for module ib-header-module - factories', function() {

    beforeEach(function() {
        module('ib-web-menus-module', 'ib-commons-utils-module');
    });

    describe('test for HeaderTransformer', function() {

        var HeaderTransformer;
        var NewMainHeaderConstants;
        var DiscountsViewModel;
        var CurrencyService;
        var OthersFeesViewModel;
        var $injector;

        beforeEach(function() {
            inject(function(_$injector_) {
                $injector = Object.keys(_$injector_).reduce(function (clone, key) {
                    clone[key] = _$injector_[key]; 
                    return clone
                } , {});
                NewMainHeaderConstants = $injector.get('NewMainHeaderConstants');
                DiscountsViewModel = $injector.get('DiscountsViewModel');
                CurrencyService = $injector.get('CurrencyService');
                OthersFeesViewModel = $injector.get('OthersFeesViewModel');
                HeaderTransformer = $injector.get('HeaderTransformer');
            });
        });

        it('HeaderTransformer should be defined', function() {

            expect(HeaderTransformer).toBeDefined();
        });


        it('test for HeaderTransformer.addSteps', function() {

            var stepsModel = {
                steps: [
                    {
                        index: 1,
                        position: 'availability',
                        text: 'HEADER_STEPS_FLIGHT_SELECT'
                    },
                    {
                        index: 2,
                        position: 'ibairp',
                        text: 'HEADER_STEPS_PASSENGER_DATA'
                    },
                    {
                        index: 3,
                        position: 'ibcmtv',
                        text: 'HEADER_STEPS_CUSTOM_COMPLETE'
                    },
                    {
                        index: 4,
                        position: 'ibpurc',
                        text: 'HEADER_STEPS_PAYMENT'
                    },
                    {
                        index: 5,
                        position: 'confirmation',
                        text: 'HEADER_STEPS_CONFIRMATION'
                    }
                ],
                position: 'availability'
            };
            var ret = HeaderTransformer.addSteps(stepsModel);

            expect(HeaderTransformer.addSteps).toBeDefined();
        });

        it('test for HeaderTransformer.initHeader', function() {

            var model = {
                originDestination: {
                    originCity: {
                        code: 'MAD',
                        description: 'Madrid',
                        timezone: 'Europe/Madrid',
                        country: {
                            code: 'ES',
                            description: 'España'
                        }
                    },
                    destinationCity: {
                        code: 'BIO',
                        description: 'Bilbao',
                        timezone: 'Europe/Madrid',
                        country: {
                            code: 'ES',
                            description: 'España'
                        }
                    },
                    dates: {
                        outboundFlight: '2020-10-15',
                        formatedOutboundFlight: '2020-10-15T00:00:00.000Z',
                        returnFlight: '2020-10-21',
                        formatedReturnFlight: '2020-10-21T00:00:00.000Z'
                    },
                    passengers: 1,
                    numAdults: 1,
                    numSeniors: 0,
                    numYoung: 0,
                    numTeenager: 0,
                    numInfant: 0,
                    numChilds: 0,
                    numberPassengrsWithoutInfant: 1
                },
                redemption: false,
                flightType: 'availabilityFlight',
                currency: {
                    suffixSymbol: true,
                    decimalSeparator: ',',
                    code: 'EUR',
                    numberDecimals: 2,
                    groupingSeparator: '.',
                    currencySymbol: '€',
                    description: 'Euro',
                    symbol: '€',
                    recommendedDisplay: 'symbol'
                }
            };
            var ret = HeaderTransformer.initHeader(model);

            expect(HeaderTransformer.initHeader).toBeDefined();
        });

        it('test for HeaderTransformer.updateBasketDiscounts', function() {

            var modelDiscount = {
                discount: '7,95€ ',
                originalDiscount: 7.95,
                type: 'PARTNER'
            };
            var object1 = {
                discountFormatted: '7,95€ ',
                discount: 7.95,
                type: 'Cupón de descuento undefined'
            };

            var shoppingBasket = {
                baggages: {
                    segments: [],
                    hasBaggage: false
                },
                seats: {
                    segments: [],
                    hasSeats: false
                },
                insurance: {
                    info: null,
                    hasInsurance: false
                },
                flexibilization: {
                    info: null,
                    hasFlexibilization: false
                },
                upgrading: {
                    segments: [],
                    hasUpgrading: false
                },
                speqs: {
                    segments: [],
                    hasSpeqs: false
                },
                discountsModel: {
                    hasDiscounts: false,
                    total: 0,
                    discounts: {}
                },
                othersModel: {
                    hasElements: false,
                    others: [],
                    total: {
                        total: 0,
                        totalFormatted: '0,00€ '
                    }
                },
                segmentsInfo: [],
                showBasket: true,
                currency: {
                    suffixSymbol: true,
                    decimalSeparator: ',',
                    code: 'EUR',
                    numberDecimals: 2,
                    groupingSeparator: '.',
                    currencySymbol: '€',
                    description: 'Euro',
                    symbol: '€',
                    recommendedDisplay: 'symbol'
                },
                trips: {
                    trips: [
                        {
                            scales: false,
                            segments: [
                                null,
                                null
                            ],
                            passengers: [
                                null
                            ],
                        }
                    ],
                    total: {
                        totalPrice: 79.54,
                        formatted: '79,54€ ',
                        original: 79.54
                    }
                },
                total: {
                    totalPrice: 79.54,
                    formatted: '79,54€ ',
                    original: 79.54
                }
            };
            var modelDiscount1 = {
                discount: '7,95€ ',
                originalDiscount: 7.95,
                type: 'PARTNER'
            };
            spyOn(DiscountsViewModel, 'getDiscountModel').withArgs(modelDiscount,'PARTNER',79.54).and.returnValue(object1);
            HeaderTransformer.updateBasketDiscounts(shoppingBasket,'PARTNER',modelDiscount1);

            expect(HeaderTransformer.updateBasketDiscounts).toBeDefined();
        });
    });
});