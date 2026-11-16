// @ts-nocheck
'use strict';
jasmine.getEnv().allowRespy(true);
describe('test for module ib-basket-module - services', function() {

    beforeEach(function() {
        module('ib-web-menus-module', 'ib-commons-utils-module');
    });

    describe('test for ShoppingBasketViewModel', function() {

        var ShoppingBasketViewModel;
        var OthersFeesViewModel;
        var CurrencyService;
        var ibBasketSectionTransformer;
        var $rootScope;
        var $injector;

        beforeEach(function() {
            inject(function(_$injector_) {
                $injector = Object.keys(_$injector_).reduce(function (clone, key) {
                    clone[key] = _$injector_[key]; 
                    return clone
                } , {});
                OthersFeesViewModel = $injector.get('OthersFeesViewModel');
                CurrencyService = $injector.get('CurrencyService');
                ibBasketSectionTransformer = $injector.get('ibBasketSectionTransformer');
                $rootScope = $injector.get('$rootScope');
                ShoppingBasketViewModel = $injector.get('ShoppingBasketViewModel');
            });
        });

        it('ShoppingBasketViewModel should be defined', function() {

            expect(ShoppingBasketViewModel).toBeDefined();
        });


        it('test for ShoppingBasketViewModel.updateOthersFee', function() {
            var currencyData = {
                suffixSymbol: true,
                decimalSeparator: ',',
                code: 'EUR',
                numberDecimals: 2,
                groupingSeparator: '.',
                currencySymbol: '€',
                description: 'Euro',
                symbol: '€',
                recommendedDisplay: 'symbol'
            };
            var headerModel = {
                flightType: 'availabilityFlight',
                redemption: false,
                trips: [
                    {
                        originCode: 'MAD',
                        originCity: 'Madrid',
                        destinyCode: 'BIO',
                        destinyCity: 'Bilbao',
                        dateFlight: '09/02/2021',
                        returnFlight: '12/02/2021',
                        passengers: 1,
                        tripType: '2',
                    }
                ],
                passengers: {
                    numberPassengers: 1,
                    numAdults: 1,
                    numSeniors: 0,
                    numYouth: 0,
                    numTeenager: 0,
                    numChilds: 0,
                    numInfants: 0
                },
                shoppingBasket: {
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
                        hasDiscounts: true,
                        total: 7.95,
                        discounts: {
                            PARTNER: {
                                discountFormatted: '7,95€ ',
                                discount: 7.95,
                                type: 'Cupón de descuento undefined'
                            }
                        }
                    },
                    othersModel: {
                        hasElements: false,
                        others: [],
                        total: {
                            total: 0,
                            totalFormatted: '0,00€ '
                        }
                    },
                    segmentsInfo: [
                        {
                            id: 'IB043220210209',
                            origin: {
                                description: 'Madrid',
                                code: 'MAD'
                            },
                            destination: {
                                description: 'Bilbao',
                                code: 'BIO'
                            }
                        },
                        {
                            id: 'IB042320210212',
                            origin: {
                                description: 'Bilbao',
                                code: 'BIO'
                            },
                            destination: {
                                description: 'Madrid',
                                code: 'MAD'
                            }
                        }
                    ],
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
                        formatted: '71,59€ ',
                        original: 71.59
                    }
                },
                steps: {
                    position: 3,
                    totalSteps: 5
                }
            };
            spyOn(OthersFeesViewModel, 'deleteInfo');
            spyOn(OthersFeesViewModel, 'updateInfo');
            spyOn(CurrencyService, 'formatPrice').withArgs(currencyData,71.59,true).and.returnValue('71,59€ ');

            
            ShoppingBasketViewModel.updateOthersFee(headerModel,'CARD',null);

            expect(ShoppingBasketViewModel.updateOthersFee).toBeDefined();
        });
    });
});