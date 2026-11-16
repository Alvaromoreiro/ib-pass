import { BookingAppConstants } from "@src/app/core/constants/ib-booking-constants";
class FakeLocation {
    static currentPath = '';
    path = jasmine.createSpy().and.callFake((value) => {
        FakeLocation.currentPath = value ?? FakeLocation.currentPath;
        return FakeLocation.currentPath;
    });
}

const fakeIbBookingPriceDetailModalService = {
    sendAnalyticsEvent: jasmine.createSpy('sendAnalyticsEvent'),
    preparePriceDetails: jasmine.createSpy('preparePriceDetails').and.returnValue({}),
    openPriceDetailModal: jasmine.createSpy('openPriceDetailModal'),
    checkShouldShowCTA: jasmine.createSpy('checkShouldShowCTA').and.returnValue(true),
    initPriceModalData: jasmine.createSpy('initPriceModalData')
};

const fakeRedemptionPrice = {
                'fareAviosPerPassenger': 100,
                'fareCashPerPassenger': 100,
                'formatAvios': '100',
                'formatOldAvios': '100',
                'formatOldPrice': '50',
                'formatPrice': '100',
                'redemptionOptionId': 'id',
                'selected': true,
                'price': {
                    'totalAvios': 100
                },
                'oldPriceWithoutDiscount': {
                    'totalAvios': 1,
                    'totalCash': 1
                }
            }

describe('IbShuttleTotalPriceDetailController test', function () {
    let fakeLocation;

    var $controller, $rootScope, $scope, controller, localStorageService;

    var CurrencyService;

    var fakeBookingModalService = {
        showGenericModal: jasmine.createSpy(),
        showWaitingModal: jasmine.createSpy()
    };

    var fakeComodel;

    var fakeEvent = {
        'preventDefault': function () {},
        'stopPropagation': function () {}
    }

    var fakeOffers = [{
        'formatAvios': '1',
        'formatPrice': '1'
    }];

    var fakemodel = {
        offers: {
            fareRate: [
                {
                    selected: true,
                    formatAvios: '1 Avios',
                    formatPrice: '1 Euro'
                }
            ]
        },
        priceInfo: {
            totalAvios: 0,
            totalCash: 0
        }
    };
    var data = {
        'totalPoints': {
            'fare': 0
        },
        'totalCash': {
            'fare': 0
        },
        'redemptionOptionId': 0
    };

    var fakeDatalayerBKIService = {
        getDigitalDataEcommerce: jasmine.createSpy('getDigitalDataEcommerce'),
    }
    var fakeDatalayerUtilsService = {
        updateDatalayerEvent: jasmine.createSpy('updateDatalayerEvent')
    }
    beforeEach(function () {
        fakeLocation = new FakeLocation();
        angular.mock.module('ib-shuttle-module', 'LocalStorageModule', 'ib-commons-utils-module', function ($provide) {
            $provide.value('BookingModalService', fakeBookingModalService);
            $provide.value('CurrencyService', {
                'formatPrice': function (data) {
                    return data;
                },
                'getCurrencyObject': function (data) {
                    return data;
                }
            });
            $provide.value('$location', fakeLocation);
            $provide.value('DatalayerBKIService', fakeDatalayerBKIService);
            $provide.value('BookingAppConstants', BookingAppConstants);
            $provide.value('IbBookingPriceDetailModalService', fakeIbBookingPriceDetailModalService);
        });
        inject(function (_$controller_, _$rootScope_, _localStorageService_, _CurrencyService_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            localStorageService = _localStorageService_;
            CurrencyService = _CurrencyService_;
            controller = $controller('IbShuttleTotalPriceDetailController', { $scope: $scope, $rootScope: $rootScope, localStorageService: localStorageService, CurrencyService: CurrencyService });
            controller.model = {};
            controller.offerSelected = {};
            controller.model.priceInfo = {
                totalFare: 0,
                totalCurrency: 0
            };
            controller.redemptionPrice = fakeRedemptionPrice;
            controller.fareDataAux = {};
            controller.fareDataAux.offers = {};
            localStorageService.set('fareData', {
                'contextMetadata': {
                    'language': 'es',
                    'country': 'ES',
                    'currencies': [
                        { 'code': 'EUR', 'description': 'Euro', 'symbol': '€', 'alignment': 'R', 'groupingSeparator': '.', 'decimalSeparator': ',', 'decimals': 2 }
                    ]
                },
                'offers': [
                    {
                        'redemptionOptions': {},
                        'promotion': {
                            'discountedRedemptionOptions': {}
                        }
                    }
                ]
            })
        });
        fakeBookingModalService.showGenericModal = jasmine.createSpy();
    });

    describe('when activate() is called', function () {

        it('Should be called with flowApp equal to PAREONB and model exist', function () {
            localStorageService.set('flowApp', 'PAREONB');
            controller.model = fakemodel;
            controller.model.priceInfo = {
                totalAvios: '',
                totalCash: ''
            }
            controller.$onInit();
            expect(angular.toJson(controller.model)).toEqual(angular.toJson({
                'offers': {
                    'fareRate': [
                        {
                            'selected': true,
                            'formatAvios': '1 Avios',
                            'formatPrice': '1 Euro'
                        }
                    ]
                },
                'priceInfo': {
                    'totalAvios': 100,
                    "oldTotalAvios": 1,
                    "oldTotalCash": 1
                }
            }))
        });

        it('Should be called with flowApp equal to PAREONB and model exist but offer not selected', function () {
            localStorageService.set('flowApp', 'PAREONB');
            controller.model = angular.copy(fakemodel);
            controller.model.offers.fareRate[0].selected = false;
            controller.$onInit();
        });

        it('Should be called with flowApp distint of PAREONB', function () {
            localStorageService.set('flowApp', 'PARE');
            controller.model = angular.copy(fakemodel);
            controller.model.offers = fakeOffers;
            controller.$onInit();
        });

    });

    describe('when goNextPage() event  is called', function () {

        it('with flow PARE and localStorage info of fareData should set info correctly on local storage and redirect new path', function () {
            controller.flowApp = 'PARE';
            controller.offerSelected = {
                fareCashPerPassenger: 1,
                fareAviosPerPassenger: 1,
                formatPrice: '1 Euro',
                formatAvios: '1 Avios',
                redemptionOptionId: '1A'
            };
            localStorageService.set('fareData', {
                'offers': [],
                'contextMetadata': {
                    'currencies': [
                        {}
                    ]
                }
            });
            controller.goNextPage(null);
            expect(fakeLocation.path()).toBe('/ibairp');
            expect(angular.toJson(localStorageService.get('selectedFareRedemptionData'))).toEqual(angular.toJson({
                'fareCashPerPassenger': 1,
                'fareAviosPerPassenger': 1,
                'price': {
                    'totalCash': '1 Euro',
                    'totalAvios': '1 Avios',
                    'redemptionOptionId': '1A'
                }
            }))
            expect(fakeDatalayerBKIService.getDigitalDataEcommerce).toHaveBeenCalled()
        })

        it('with flow PAREONB and localStorage info of fareData should set info correctly on local storage and redirect new path', function () {
            controller.flowApp = 'PAREONB';
            controller.offerSelected = {
                fareCashPerPassenger: 1,
                farePointsPerPassenger: 1,
                formatPrice: '1 Euro',
                formatAvios: '1 Avios',
                redemptionOptionId: '1A'
            };
            localStorageService.set('fareData', {
                'offers': [],
                'contextMetadata': {
                    'currencies': [
                        {}
                    ]
                }
            });
            controller.goNextPage(null);
            expect(fakeLocation.path()).toBe('/ibairp');
            expect(angular.toJson(localStorageService.get('selectedFareRedemptionData'))).toEqual(angular.toJson({
                'fareCashPerPassenger': 1,
                'farePointsPerPassenger': 1,
                'price': {
                    'totalCash': '1 Euro',
                    'totalPoints': '1 Avios',
                    'redemptionOptionId': '1A'
                }
            }))
        })

        it('with flow distint of PAREONB and PARE', function () {
            controller.flowApp = 'PAR';
            controller.offerSelected = undefined;
            localStorageService.set('fareData', {
                'offers': [],
                'contextMetadata': {
                    'currencies': [
                        {}
                    ]
                }
            });
            controller.goNextPage(null);
            expect(fakeLocation.path()).toBe('/ibairp');
        })

    });

    describe('when event selectOffer is called', function () {
        it('should call getOfferSelected and set value model correctly if exist model', function () {
            controller.getOfferSelected(null, data);
            expect(angular.toJson(controller.model)).toEqual(angular.toJson({ 'priceInfo': { 'totalFare': 0, 'totalCurrency': 0 } }))
        });
        it('should call getOfferSelected and set value model correctly if exist model', function () {
            controller.model = undefined;
            controller.getOfferSelected(null, data);
            expect(angular.toJson(controller.model)).toEqual(angular.toJson({ 'priceInfo': {} }))
        });
    });
});
 