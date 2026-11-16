// @ts-nocheck
'use strict';
jasmine.getEnv().allowRespy(true);
describe('test for module ib-newMain-header-module - services', function() {

    beforeEach(function() {
        module('ib-web-menus-module', 'ib-commons-utils-module', function($provide) {
            
        });
    });

    describe('test for NewMainHeaderService', function() {

        var NewMainHeaderService;
        var ibGreyBarTransformer;
        var HeaderTransformer;
        var StepsTransformer;
        var ShoppingBasketViewModel;
        var $injector;

        beforeEach(function() {
            inject(function(_$injector_) {
                $injector = Object.keys(_$injector_).reduce(function (clone, key) {
                    clone[key] = _$injector_[key]; 
                    return clone
                } , {});
                ibGreyBarTransformer = $injector.get('ibGreyBarTransformer');
                HeaderTransformer = $injector.get('HeaderTransformer');
                StepsTransformer = $injector.get('StepsTransformer');
                ShoppingBasketViewModel = $injector.get('ShoppingBasketViewModel');
                NewMainHeaderService = $injector.get('NewMainHeaderService');
            });
        });

        it('NewMainHeaderService should be defined', function() {

            expect(NewMainHeaderService).toBeDefined();
        });


        it('test for NewMainHeaderService.initHeader', function() {

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
            var object8 = {
                flightType: 'availabilityFlight',
                redemption: false,
                trips: [
                    {
                        originCode: 'MAD',
                        originCity: 'Madrid',
                        destinyCode: 'BIO',
                        destinyCity: 'Bilbao',
                        dateFlight: '15/10/2020',
                        returnFlight: '21/10/2020',
                        passengers: 1,
                        tripType: '2'
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
                    showBasket: false,
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
                }
            };
            

            var headerModel = {
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
            var stepsModel = {
                hasSteps: true,
                steps: 'DEFAULT_STEPS',
                position: 'availability'
            };
            var greyBarModel = {
                onLogin: jasmine.createSpy('function1'),
                onError: jasmine.createSpy('function2'),
                afterLogin: jasmine.createSpy('function3'),
                userLogged: false
            };
            spyOn(HeaderTransformer, 'initHeader').withArgs(model).and.returnValue(object8);
            NewMainHeaderService.initHeader(headerModel,stepsModel,greyBarModel);

            expect(NewMainHeaderService.initHeader).toBeDefined();
        });

        it('test for NewMainHeaderService.updateBasketDiscounts', function() {

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
                },
                steps: {
                    position: 2,
                    totalSteps: 5
                }
            };
            var modelDiscount = {
                discount: '7,95€ ',
                originalDiscount: 7.95,
                type: 'PARTNER'
            };
            spyOn(HeaderTransformer, 'updateBasketDiscounts');
            NewMainHeaderService.updateBasketDiscounts(headerModel,'PARTNER',modelDiscount);

            expect(NewMainHeaderService.updateBasketDiscounts).toBeDefined();
        });

        it('test for NewMainHeaderService.updateBasketOthers', function() {

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
            spyOn(ShoppingBasketViewModel, 'updateOthersFee');
            NewMainHeaderService.updateBasketOthers(headerModel,'CARD',null);

            expect(NewMainHeaderService.updateBasketOthers).toBeDefined();
        });
    });
});