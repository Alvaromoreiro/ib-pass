import { IbShuttleController } from '../../../../../src/app/pages/ib-shuttle/controller/ib-shuttle-controller';
import angular from 'angular';
import { StorageServiceMock } from '../../../../mocks/Services/StorageServiceMock';
import { fakeAsync, tick } from '@angular/core/testing';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { BookingUserActivityServiceMock } from 'test/mocks/Services/BookingUserActivityServiceMock';

class IbBookingPriceDetailModalServiceMock {
    initPriceModalData = jasmine.createSpy('initPriceModalData')
};

describe('IbShuttleController test', () => {

    let fakeSessionStorage = new StorageServiceMock();

    let controller: IbShuttleController, scope;
    let controllerDependencies = {

        location:{},
        scope: {},
        rootScope:''
    };

    let bindings = {
    };

    let transformedShuttleData = {
        passengerInfo: {
            "adults": 1,
            "childs": 0,
            "infants": 0
        },
        currencies: [{
            'data': 'data'
        }],
        'slices': [
            {
                'destinationCityCode': 'MAD',
                'cabin': 'cabin',
                'originCityCode': 'BAR',
                'segmentsTotal': 2,
                'flights':
                {
                    'aircraft': 'AIRCRAFT',
                    'marketingCarrier': {
                        'code': 'IB',
                        'name': 'Iberia'
                    },
                    'departure': {
                        'code': 'MAD',
                        'name': 'Madrid Adolfo Suarez-Barajas',
                        'terminal': '4',
                        'city': {
                            'code': 'MAD',
                            'description': 'Madrid',
                            'countryCode': 'ES',
                            'country': {
                                'code': 'ES',
                                'description': 'España'
                            }
                        }
                    },
                    'arrival': {
                        'code': 'BCN',
                        'name': 'Barcelona',
                        'terminal': '1',
                        'city': {
                            'code': 'BCN',
                            'description': 'Barcelona',
                            'countryCode': 'ES',
                            'country': {
                                'code': 'ES',
                                'description': 'España'
                            }
                        }
                    },
                    'flight': {
                        'marketingCarrier': {
                            'code': 'IB',
                            'name': 'Iberia'
                        },
                        'operationalCarrier': {
                            'code': 'IB',
                            'name': 'Iberia'
                        },
                        'marketingFlightNumber': 'OPEN',
                        'operationalFlightNumber': 'OPEN',
                        'operationalDisclosure': 'IB',
                        'aircraft': null
                    },
                    'cabin': {
                        'rbd': 'Y',
                        'bookingCode': null,
                        'bookingClass': 'TOURIST',
                        'remainingSeats': 0,
                        'fareFamily': 'YPA',
                        'fareBasis': 'YDRT',
                        'seatDisplays': null,
                        'extendedFareCode': '',
                        'cabinDescription': 'Turista'
                    },
                    'overnight': false,
                    'id': 'GoUvPmCMvNGxK7l-',
                    'duration': null,
                    'waitingTime': 0,
                    'providerId': '',
                    'ticketDesignator': '',
                    'accrualQuote': null,
                    'delayInformation': null,
                    'stop': null,
                    'departureDateTime': null,
                    'arrivalDateTime': null
                },
                'overnight': false
            }
        ],
        priceInfo: {
            fareAviosPerPassenger:5,
            farePointsPerPassenger: 5,
            fareCashPerPassenger:5,
            redemptionOptionId:0,
            totalAvios:10,
            totalCash:50
        },
        fareFamilyConditions: '',
        offers:
            {

                'offerId': 'IB4eb460fbba284556989d048c47626933OP',
                'price': {
                    'fare': 420,
                    'tax': 41.79,
                    'total': 461.79,
                    'currency': 'EUR',
                    'ticketingFee': 0
                },
                'slices': [
                    {
                        'sliceId': '1MADBCN',
                        'departureDateTime': null,
                        'arrivalDateTime': null,
                        'duration': null,
                        'stopsNumber': 0,
                        'price': {
                            'fare': 165,
                            'tax': 21.46,
                            'total': 186.46,
                            'currency': 'EUR',
                            'ticketingFee': 0
                        },
                        'detailedPrices': [
                            {
                                'fare': 165,
                                'tax': 21.46,
                                'total': 186.46,
                                'currency': 'EUR',
                                'passengerIds': [
                                    'ADULT_01'
                                ],
                                'segmentPrices': null,
                                'ticketingFee': 0
                            }
                        ],
                        'segments': [
                            {
                                'departure': {
                                    'code': 'MAD',
                                    'name': 'Madrid Adolfo Suarez-Barajas',
                                    'terminal': '4',
                                    'city': {
                                        'code': 'MAD',
                                        'description': 'Madrid',
                                        'countryCode': 'ES',
                                        'country': {
                                            'code': 'ES',
                                            'description': 'España'
                                        }
                                    }
                                },
                                'arrival': {
                                    'code': 'BCN',
                                    'name': 'Barcelona',
                                    'terminal': '1',
                                    'city': {
                                        'code': 'BCN',
                                        'description': 'Barcelona',
                                        'countryCode': 'ES',
                                        'country': {
                                            'code': 'ES',
                                            'description': 'España'
                                        }
                                    }
                                },
                                'flight': {
                                    'marketingCarrier': {
                                        'code': 'IB',
                                        'name': 'Iberia'
                                    },
                                    'operationalCarrier': {
                                        'code': 'IB',
                                        'name': 'Iberia'
                                    },
                                    'marketingFlightNumber': 'OPEN',
                                    'operationalFlightNumber': 'OPEN',
                                    'operationalDisclosure': 'IB',
                                    'aircraft': null
                                },
                                'cabin': {
                                    'rbd': 'Y',
                                    'bookingCode': null,
                                    'bookingClass': 'TOURIST',
                                    'remainingSeats': 0,
                                    'fareFamily': 'YPA',
                                    'fareBasis': 'YDRT',
                                    'seatDisplays': null,
                                    'extendedFareCode': '',
                                    'cabinDescription': 'Turista'
                                },
                                'overnight': false,
                                'id': 'GoUvPmCMvNGxK7l-',
                                'duration': null,
                                'waitingTime': 0,
                                'providerId': '',
                                'ticketDesignator': '',
                                'accrualQuote': null,
                                'delayInformation': null,
                                'stop': null,
                                'departureDateTime': null,
                                'arrivalDateTime': null
                            }
                        ],
                        'overnight': false
                    },
                    {
                        'sliceId': '2BCNMAD',
                        'departureDateTime': null,
                        'arrivalDateTime': null,
                        'duration': null,
                        'stopsNumber': 0,
                        'price': {
                            'fare': 255,
                            'tax': 20.33,
                            'total': 275.33,
                            'currency': 'EUR',
                            'ticketingFee': 0
                        },
                        'detailedPrices': [
                            {
                                'fare': 255,
                                'tax': 20.33,
                                'total': 275.33,
                                'currency': 'EUR',
                                'passengerIds': [
                                    'ADULT_01'
                                ],
                                'segmentPrices': null,
                                'ticketingFee': 0
                            }
                        ],
                        'segments': [
                            {
                                'departure': {
                                    'code': 'BCN',
                                    'name': 'Barcelona',
                                    'terminal': '1',
                                    'city': {
                                        'code': 'BCN',
                                        'description': 'Barcelona',
                                        'countryCode': 'ES',
                                        'country': {
                                            'code': 'ES',
                                            'description': 'España'
                                        }
                                    }
                                },
                                'arrival': {
                                    'code': 'MAD',
                                    'name': 'Madrid Adolfo Suarez-Barajas',
                                    'terminal': '4',
                                    'city': {
                                        'code': 'MAD',
                                        'description': 'Madrid',
                                        'countryCode': 'ES',
                                        'country': {
                                            'code': 'ES',
                                            'description': 'España'
                                        }
                                    }
                                },
                                'flight': {
                                    'marketingCarrier': {
                                        'code': 'IB',
                                        'name': 'Iberia'
                                    },
                                    'operationalCarrier': {
                                        'code': 'IB',
                                        'name': 'Iberia'
                                    },
                                    'marketingFlightNumber': 'OPEN',
                                    'operationalFlightNumber': 'OPEN',
                                    'operationalDisclosure': 'IB',
                                    'aircraft': null
                                },
                                'cabin': {
                                    'rbd': 'J',
                                    'bookingCode': null,
                                    'bookingClass': 'BUSINESS',
                                    'remainingSeats': 0,
                                    'fareFamily': 'BPA',
                                    'fareBasis': 'JDRT',
                                    'seatDisplays': null,
                                    'extendedFareCode': '',
                                    'cabinDescription': 'Business'
                                },
                                'overnight': false,
                                'id': 'GyQwPV2Kgy8KSsVY',
                                'duration': null,
                                'waitingTime': 0,
                                'providerId': '',
                                'ticketDesignator': '',
                                'accrualQuote': null,
                                'delayInformation': null,
                                'stop': null,
                                'departureDateTime': null,
                                'arrivalDateTime': null
                            }
                        ],
                        'overnight': false
                    }
                ],
                'offerExpiration': '2019-09-23T17:02:08.298+02:00',
                'onHoldOptions': [],
                'cashAviosPossibilities': [],
                'carryOnBaggageAllowances': [
                    {
                        'totalQuantity': 1,
                        'segmentIds': [
                            'GoUvPmCMvNGxK7l-',
                            'GyQwPV2Kgy8KSsVY'
                        ]
                    }
                ],
                'checkedBagAllowances': [
                    {
                        'totalQuantity': 1,
                        'pieceAllowances': [
                            {
                                'totalQuantity': 1,
                                'commercialName': 'UP TO 23 KG AND 158 LCM',
                                'descriptions': [],
                                'type': 'PIECE'
                            }
                        ],
                        'segmentIds': [
                            'GoUvPmCMvNGxK7l-'
                        ]
                    },
                    {
                        'totalQuantity': 2,
                        'pieceAllowances': [
                            {
                                'totalQuantity': 2,
                                'commercialName': 'UP TO 23 KG AND 158 LCM',
                                'descriptions': [],
                                'type': 'PIECE'
                            }
                        ],
                        'segmentIds': [
                            'GyQwPV2Kgy8KSsVY'
                        ]
                    }
                ],
                'availableServices': [],
                'selectedServices': [],
                'specialDiscountsApplied': [],
                'accrualQuote': {
                    'redemptionPoints': null,
                    'qualificationPoints': null
                },
                'offerItems': [
                    {
                        'offerItemId': 'IB4eb460fbba284556989d048c47626933OP_01',
                        'passengerIds': [
                            'ADULT_01'
                        ],
                        'price': {
                            'fare': 420,
                            'tax': 41.79,
                            'total': 461.79,
                            'currency': 'EUR',
                            'ticketingFee': 0
                        },
                        'detailedTaxes': [
                            {
                                'code': 'QV',
                                'amount': 7.7,
                                'currency': 'EUR',
                                'description': 'Seguridad'
                            },
                            {
                                'code': 'OG',
                                'amount': 1.34,
                                'currency': 'EUR',
                                'description': 'Tasa de seguridad'
                            },
                            {
                                'code': 'JD',
                                'amount': 32.75,
                                'currency': 'EUR',
                                'description': 'Cargo por salida'
                            }
                        ],
                        'fareCalculation': null,
                        'fareComponents': []
                    }
                ],
                'type': 'SHUTTLE',
                fareRate:[{
                    selected: true,
                    fareAviosPerPassenger:5,
                    farePointsPerPassenger: 5,
                    fareCashPerPassenger:5,
                    redemptionOptionId:0,
                    totalAvios:10,
                    totalCash:50,
                    offerItems:[{
                        price:{
                            tax:5
                        }
                    }]
                }]


            }
    };

    let fakeIbShuttleService = {
        'initShuttleFlow': jasmine.createSpy('initShuttleFlow'),
        'getInitialParameters': jasmine.createSpy('getInitialParameters').and.callFake(function () {
            return fareResponse
        }),
        // 'initShuttleFlow': jasmine.createSpy(),
        'getFareData': jasmine.createSpy()
    };
    let fareResponse = {
      data: require('./../../../../mocks/Responses/Shuttle-mock.json')
    }

    let fakeBookingModalService = {
        'showWaitingModal': jasmine.createSpy(),
        'finishWaiting': jasmine.createSpy(),
        'showLoginErrorModal': jasmine.createSpy()
    };

    let fakeNewMainHeaderFacade = {
        initHeader: jasmine.createSpy(),
        updateTrips: jasmine.createSpy()
    };

    let fakeBookingUtilService = {
        isUserLogged: function () {
            return false;
        }
    };
    let fakeDatalayerBKIService = {
        getDigitalDataEcommerce: jasmine.createSpy('getDigitalDataEcommerce')
    }

    let fakeDatalayerUtilsService = {
        'updateDatalayerWithQuadrigam': jasmine.createSpy('updateDatalayerWithQuadrigam').and.callFake(function () { }),
        'sendDatalayerEvent': jasmine.createSpy('sendDatalayerEvent').and.callFake(function () { }),
        'addShuttleDatalayer': jasmine.createSpy('addShuttleDatalayer').and.callFake(function () { }),
        'addShuttleDigitalData': jasmine.createSpy('addShuttleDigitalData').and.callFake(function () { }),
        'updateDigitalDataWithQuadrigam': jasmine.createSpy('updateDigitalDataWithQuadrigam').and.callFake(function () { }),
        'updateDatalayerViewEvent': jasmine.createSpy('updateDatalayerViewEvent').and.callFake(function () { }),
    };
    
    let fakeDigitalDataUtilsService = {
        'updateDigitalDataWithQuadrigam': jasmine.createSpy('updateDigitalDataWithQuadrigam').and.callFake(function () { }),
    }


    let fakeCurrencyService = {
        formatPrice: jasmine.createSpy('formatPrice').and.returnValue('125.05'),
        getCurrencyObject: jasmine.createSpy('getCurrencyObject'),
        formatAvios: jasmine.createSpy('formatAvios').and.returnValue('5,000'),
    };

    let fakeTranslate = {
        'onReady': jasmine.createSpy().and.returnValue(Promise.resolve({}))
    };

    let fakeDatalayerConstants = {
        DATALAYER_EVENT_TYPES: {
            'VIEW': 'view',
            'LINK': 'link'
        }
    };

    let fakeCommonsUtilService = {
        'setTitlePage': jasmine.createSpy()
    };
    let fakePageUtilsService = {
        setPageTitle: jasmine.createSpy('setPageTitle')
    }

    let fakeBookingUserActivityService = new BookingUserActivityServiceMock();
    let fakeIbBookingPriceDetailModalService = new IbBookingPriceDetailModalServiceMock();

    beforeEach(() =>{
        angular.mock.module('ib-shuttle-module', 'LocalStorageModule', ($provide) => {
            $provide.value('$translate', fakeTranslate);
            $provide.value('BookingUtilService', fakeBookingUtilService);
            $provide.value('BookingAppConstants', BookingAppConstants);
            $provide.value('IbShuttleService', fakeIbShuttleService);
            $provide.value('BookingModalService', fakeBookingModalService);
            $provide.value('DatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('DigitalDataUtilsService', fakeDigitalDataUtilsService);
            $provide.value('DatalayerConstants', fakeDatalayerConstants);
            $provide.value('NewMainHeaderFacade', fakeNewMainHeaderFacade);
            $provide.value('CurrencyService', fakeCurrencyService);
            $provide.value('CommonsUtilService', fakeCommonsUtilService);
            $provide.value('DatalayerBKIService', fakeDatalayerBKIService);
            $provide.value('localStorageService', fakeSessionStorage);
            $provide.value('BookingPageUtilsService',fakePageUtilsService );
            $provide.value('BookingUserActivityService', fakeBookingUserActivityService);
            $provide.value('IbBookingPriceDetailModalService', fakeIbBookingPriceDetailModalService);
        });
        inject((_$componentController_,$rootScope, _$location_) =>{
            scope = $rootScope.$new();
            controllerDependencies.location = _$location_;
            controllerDependencies.scope = scope;
            controllerDependencies.rootScope = $rootScope;
            controller = _$componentController_('ibShuttle', controllerDependencies, bindings);
            $rootScope.$digest();
            scope.$apply();
            // controllerDependencies.scope.$apply();
        });

    });

    describe('When controller is called ', () =>{
        beforeEach(() =>{
            fakeIbShuttleService.initShuttleFlow = jasmine.createSpy('initShuttleFlow').and.callFake(function () {
                return Promise.resolve(transformedShuttleData)
            })
        })
        it(', it will be defined', () =>{
            controller.$onInit();
            expect(controller).toBeDefined();
            expect(fakeBookingModalService.showWaitingModal).toHaveBeenCalled();
        });
        it(', it will be defined and initShuttleFlow rejects', () =>{

            fakeIbShuttleService.initShuttleFlow = jasmine.createSpy('initShuttleFlow').and.callFake(function () {
                return Promise.reject({errorCode:400})
            })
            controller.$onInit();
        });
        it('If flow is PAOB should set quadrigam correctly', fakeAsync( () =>{
            inject(function () {
                fakeSessionStorage.set('flowApp', 'PAOB');
                fakeSessionStorage.set('confirmationDatalayerInfo', {});
            });
            controller.$onInit();
            tick();
            expect(fakeDatalayerBKIService.getDigitalDataEcommerce).toHaveBeenCalled();
        }));
        it('If flow is PARE should set quadrigam correctly', fakeAsync(()=>{
            inject(function () {
                fakeSessionStorage.set('flowApp', 'PARE');
                fakeSessionStorage.set('confirmationDatalayerInfo', {});
            });
            controller.$onInit();
            tick();
            expect(fakeDatalayerBKIService.getDigitalDataEcommerce).toHaveBeenCalled();
        }));
        it('If flow is PAOBONB should set quadrigam correctly', fakeAsync( ()=> {
            inject(function () {
                fakeSessionStorage.set('flowApp', 'PAOBONB');
                fakeSessionStorage.set('confirmationDatalayerInfo', {});
            });
            controller.$onInit();
            tick();
            expect(fakeDatalayerBKIService.getDigitalDataEcommerce).toHaveBeenCalled();
        }));
        it('If flow is PAREONB should set quadrigam correctly', fakeAsync( ()=> {
            inject(function () {
                fakeSessionStorage.set('flowApp', 'PAREONB');
                fakeSessionStorage.set('confirmationDatalayerInfo', {});
            });
            controller.$onInit();
            tick();
            expect(fakeDatalayerBKIService.getDigitalDataEcommerce).toHaveBeenCalled();
        }));
    });
    describe('changeToObtention', function(){
        beforeEach(()=>{
            fakeSessionStorage.remove('flowApp');
            fakeIbShuttleService.initShuttleFlow = jasmine.createSpy('initShuttleFlow').and.callFake(function () {
                return Promise.resolve(transformedShuttleData)
            })
        })
        it('', function() {
            inject(function($q){
            });
            controller.changeToObtention();
            expect(fakeSessionStorage.get('flowApp')).toEqual('PAOB');
        });
    });
    describe('changeToObtentionONB', function(){
        beforeEach(()=>{
            fakeSessionStorage.remove('flowApp');
            fakeIbShuttleService.initShuttleFlow = jasmine.createSpy('initShuttleFlow').and.callFake(function () {
                return Promise.resolve(transformedShuttleData)
            })
        })
        it('', function() {
            inject(function($q){

            });
            controller.changeToObtentionONB();
            expect(fakeSessionStorage.get('flowApp')).toEqual('PAOBONB');
        });
    });
    describe('showAviosAndMoney', function(){
        beforeEach(()=>{
            controller.withAvios=true;
            controller.model.fareShuttleModel = {
                offers:{}
            }
        })
        it('', function() {
            inject(function($rootScope){
                $rootScope.isRedemptionFlow = true;
            });
            let returnValue = controller.showAviosAndMoney();
            expect(returnValue).toEqual({});
        });
    });
    describe('showTotalPrice', function(){
        beforeEach(()=>{
            controller.withAvios=true;
            controller.model = {
                fareShuttleModel: {
                offers:{}
            },
            fareData:{withoutAviosMoney:false}
        }
        })
        it('', function() {
            inject(function($rootScope){
                $rootScope.isRedemptionFlow = true;
            });
            let returnValue = controller.showTotalPrice();
            expect(returnValue).toBeTrue();
        });
    });
    describe('showWithoutPoints', function(){
        beforeEach(()=>{
            controller.withAvios=true;
            controller.model = {
                fareShuttleModel: {
                offers:{}
            },
            fareData:{withoutAviosMoney:false}
        }
        })
        it('', function() {
            inject(function($rootScope){
                $rootScope.isRedemptionFlow = true;
            });
            let returnValue = controller.showWithoutPoints();
            expect(returnValue).toBeFalse();
        });
    });
    describe('updateBasket', function(){
        beforeEach(()=>{
            controller.dataAux = {
                priceInfo: {
                    fareAviosPerPassenger: 0,
                    fareCashPerPassenger: 0,
                    redemptionOptionId: 0,
                    totalAvios: 0,
                    totalCash: 0
                },
                passengerInfo: {
                    "adults": 1,
                    "childs": 0,
                    "infants": 0
                }
            };
            controller.infoAvios = {
                totalPrice: {
                    fareAviosPerPassenger: 0,
                    fareCashPerPassenger: 0,
                    redemptionOptionId: 0,
                    price: {
                        redemptionOptionId: 0,
                        totalAvios: 0,
                        totalCash: 0
                    }
                },
                summaryInfo:{passengers:{generalData:[]}}
            }
        })
        it('', function() {
            inject(function(){
            });
            controller.updateBasket(null, {
                fareAviosPerPassenger: 1000,
                fareCashPerPassenger: 1000,
                redemptionOptionId: 123456,
                avios: {
                    fare: 2500
                },
                cash: {
                    fare: 2500
                },
                offerItems:[{price:{tax:0}}]
            });
            expect(fakeNewMainHeaderFacade.updateTrips).toHaveBeenCalled();
        });
    });
    describe('When setCoupon() is called', function() {
        beforeEach(function () {
            fakeSessionStorage.set('commercialData',{currency:{groupingSeparator:''}})
        });
        it('and coupon exists, model is setted with coupon info', function() {
            controller.model =
                {
                    fareData: {
                        fareRate: [{
                            avios: {
                                fare: 0
                            },
                            cash: {
                                fare: 0
                            },
                            formatPrice: '',
                            formatAvios: '',
                            redemptionOptionId: '',
                            aviosWithoutDiscount: {
                                fare: 0
                            },
                            cashWithoutDiscount: {
                                fare: 0
                            }
                        }],
                        totalPrice: {
                            tax: 0,
                            couponApplied: false,
                            redemptionOptionId: 0
                        }
                    }
                };
            var couponTest = {
                offerList: [{
                    discountedPrice: {
                        totalPoints: {
                            fare: 1000
                        },
                        totalCash: {
                            fare: 1000
                        }
                    },
                    optionId: 120,
                    basePrice: {
                        totalPoints: {
                            fare: 1200
                        },
                        totalCash: {
                            fare: 1200
                        }
                    }
                }]
            };
            // rootScope.$broadcast('setShuttleCoupon', couponTest);
            controller.setCoupon({},couponTest)
            expect(controller.coupon).toEqual({ offerList: [{ discountedPrice: { totalPoints: { fare: 1000 }, totalCash: { fare: 1000 } }, optionId: 120, basePrice: { totalPoints: { fare: 1200 }, totalCash: { fare: 1200 } } } ] });
        });
        it('and coupon is null, set controller coupon to null too', function() {
            controller.model =
                {
                    fareData: {
                        fareRate: [{
                            avios: {
                                fare: 0
                            },
                            cash: {
                                fare: 0
                            },
                            formatPrice: '',
                            formatAvios: '',
                            redemptionOptionId: '',
                            aviosWithoutDiscount: {
                                fare: 0
                            },
                            cashWithoutDiscount: {
                                fare: 0
                            }
                        }],
                        totalPrice: {
                            tax: 0,
                            couponApplied: false,
                            redemptionOptionId: 0
                        }
                    }
                };
            // $rootScope.$broadcast('setShuttleCoupon', null);
            controller.setCoupon({},null)
            expect(controller.coupon).toBe(null);
        });
    });
    describe('When onLogin() is called', function() {
        beforeEach(function () {
        });
        it(', it will call showWaitingModal()', function() {
            controller.onLogin()
            expect(fakeBookingModalService.showWaitingModal).toHaveBeenCalled();
        });
    });
    describe('When onError() is called', function() {
        beforeEach(function () {
        });
        it(', it will call showLoginErrorModal()', function() {
            controller.onError({stateUserLogged:false})
            expect(fakeBookingModalService.showLoginErrorModal).toHaveBeenCalled();
        });
    });
});
