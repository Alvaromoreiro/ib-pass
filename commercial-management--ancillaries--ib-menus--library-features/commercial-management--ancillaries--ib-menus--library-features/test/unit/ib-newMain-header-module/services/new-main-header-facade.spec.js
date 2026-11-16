// @ts-nocheck
'use strict';
jasmine.getEnv().allowRespy(true);
describe('test for module ib-newMain-header-module - services', function () {


    beforeEach(function () {
        module('ib-web-menus-module', 'ib-commons-utils-module', function ($provide) {
        });
    });

    describe('test for NewMainHeaderFacade', function () {

        var NewMainHeaderFacade;
        var NewMainHeaderService;
        var $injector;

        beforeEach(function () {
            inject(function (_$injector_) {
                $injector = Object.keys(_$injector_).reduce(function (clone, key) {
                    clone[key] = _$injector_[key]; return clone
                }, {});
                NewMainHeaderFacade = $injector.get('NewMainHeaderFacade');
                NewMainHeaderService = $injector.get('NewMainHeaderService');
            });
        });

        it('NewMainHeaderFacade should be defined', function () {

            expect(NewMainHeaderFacade).toBeDefined();
        });


        it('test for NewMainHeaderFacade.setAPIFunctions', function () {
            var functions = {};
            NewMainHeaderFacade.setAPIFunctions(functions);

            expect(NewMainHeaderFacade.setAPIFunctions).toBeDefined();
        });

        it('test for NewMainHeaderFacade.initializeHeader', function () {

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
                onLogin: jasmine.any(Function),
                onError: jasmine.any(Function),
                afterLogin: jasmine.any(Function),
                userLogged: false
            };
            var object8 = {
                headerModel: {
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
                    },
                    steps: {
                        position: 1,
                        totalSteps: 5
                    }
                },
                greyBarModel: {
                    login: {
                        onLogin: jasmine.createSpy('function4'),
                        afterLogin: jasmine.createSpy('function5'),
                        onError: jasmine.createSpy('function6')
                    },
                    loggedData: {},
                    userLogged: false,
                    isONB: false,
                    isLogged: false,
                    show: true
                },
                stepsModel: {
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
                }
            };
            NewMainHeaderFacade.setAPIFunctions({
                'initializeHeader': jasmine.createSpy('initializeHeader')
            });
            NewMainHeaderFacade.initHeader(headerModel, stepsModel, greyBarModel);
            expect(NewMainHeaderFacade.initializeHeader).toHaveBeenCalled();
        });

        it('test for NewMainHeaderFacade.updateTrips', function () {

            NewMainHeaderFacade.setAPIFunctions({
                'updateTripsBasket': jasmine.createSpy('updateTripsBasket'),
            });

            NewMainHeaderFacade.updateTrips();

            expect(NewMainHeaderFacade.updateTripsBasket).toHaveBeenCalled();
        });

        it('test for NewMainHeaderFacade.updateTripsFromOrder', function () {

            NewMainHeaderFacade.setAPIFunctions({
                'updateTripsBasketFromOrder': jasmine.createSpy('updateTripsBasketFromOrder'),
            });

            NewMainHeaderFacade.updateTripsFromOrder();

            expect(NewMainHeaderFacade.updateTripsBasketFromOrder).toHaveBeenCalled();
        });

        it('test for NewMainHeaderFacade.updateSteps', function () {

            NewMainHeaderFacade.setAPIFunctions({
                'updateStepsModel': jasmine.createSpy('updateStepsModel'),
            });

            NewMainHeaderFacade.updateSteps();

            expect(NewMainHeaderFacade.updateStepsModel).toHaveBeenCalled();
        });

        it('test for NewMainHeaderFacade.updateBasketDiscounts', function () {

            NewMainHeaderFacade.setAPIFunctions({
                'updateDiscounts': jasmine.createSpy('updateDiscounts'),
            });

            NewMainHeaderFacade.updateBasketDiscounts();

            expect(NewMainHeaderFacade.updateDiscounts).toHaveBeenCalled();
        });

        it('test for NewMainHeaderFacade.setLogin', function () {

            NewMainHeaderFacade.setAPIFunctions({
                'setLogin': jasmine.createSpy('setLogin'),
            });

            NewMainHeaderFacade.setLogin();

            expect(NewMainHeaderFacade.setLogin).toHaveBeenCalled();
        });

        it('test for NewMainHeaderFacade.updateBasketDiscounts', function () {

            NewMainHeaderFacade.setAPIFunctions({
                'updateDiscounts': jasmine.createSpy('updateDiscounts'),
            });

            NewMainHeaderFacade.updateBasketDiscounts();

            expect(NewMainHeaderFacade.updateDiscounts).toHaveBeenCalled();
        });

        it('test for NewMainHeaderFacade.updateBasketOthers', function () {

            NewMainHeaderFacade.setAPIFunctions({
                'updateBasketOthers': jasmine.createSpy('updateBasketOthers'),
            });

            NewMainHeaderFacade.updateBasketOthers();

            expect(NewMainHeaderFacade.updateBasketOthers).toHaveBeenCalled();
        });

        it('test for NewMainHeaderFacade.updateSteps', function () {

            NewMainHeaderFacade.setAPIFunctions({
                'updateStepsModel': jasmine.createSpy('updateStepsModel'),
            });

            NewMainHeaderFacade.updateSteps();

            expect(NewMainHeaderFacade.updateStepsModel).toHaveBeenCalled();
        });

        it('test for NewMainHeaderFacade.showLogin', function () {

            NewMainHeaderFacade.setAPIFunctions({
                'showLogin': jasmine.createSpy('showLogin'),
            });

            NewMainHeaderFacade.showLogin();

            expect(NewMainHeaderFacade.showLogin).toHaveBeenCalled();
        });
    });
});