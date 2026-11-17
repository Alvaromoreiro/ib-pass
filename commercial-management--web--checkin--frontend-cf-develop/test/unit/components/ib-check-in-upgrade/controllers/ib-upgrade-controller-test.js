import dayjs from 'dayjs';

describe('UpgradeController test', function () {

    var scope, timeout, rootScope, $q, controller;

    var fakeUpgradeService = {
        searchUpgradeInformation: jasmine.createSpy(),
        updateUpgradeInformation: jasmine.createSpy(),
        generateUpgradeModel: jasmine.createSpy(),
        calculatePrice: jasmine.createSpy(),
        updateDataToService: jasmine.createSpy(),
        updateUpgradeView: jasmine.createSpy(),
        getCombinedOffer: jasmine.createSpy(),
        openOfferCondition: jasmine.createSpy(),
        initRenacen3dScript: jasmine.createSpy()
    };
    var fakeDatalayerUtilsService = {
        updateDatalayerWithQuadrigam: jasmine.createSpy().and.callFake(angular.noop),
        sendDatalayerEvent: jasmine.createSpy().and.callFake(angular.noop),
        updateDatalayerForUpgrade: jasmine.createSpy().and.callFake(angular.noop),
        updateAircraft: jasmine.createSpy().and.callFake(angular.noop),
        addDigitalDataInfo: jasmine.createSpy().and.callFake(angular.noop),
        updateDigitalDataWithQuadrigam: jasmine.createSpy().and.callFake(angular.noop),
        updateDatalayerViewEvent: jasmine.createSpy().and.callFake(angular.noop)
    };

    var fakeIbPassengerBookingUtilsService = {
        setAircraftDatalayer: jasmine.createSpy()
    };

    var fakeIbUtilsService = {
        setTitlePage: jasmine.createSpy()
    };

    var fakeIbSessionConfigService = {
        isUserLogged: jasmine.createSpy()
    };

    var fakeIbAncillariesPaymentUtilsService = {
        getHeaderUpgradingInfo: jasmine.createSpy()
    };

    var fakeMonetateUtilsService = {
        updateMonetateWithQuadrigam: jasmine.createSpy()
    };

    var fakeCurrencyService = {
        formatPrice: jasmine.createSpy()
    };

    var fakeCheckinAppConstants = {
        QUADRIGAM: 'test',
        imagesRoute: '/iberia-web-content/imagenes',
        TITLE_PAGE: {
            UPGRADE: 'CKI_TITLE_PAGE_CKIANCUPP'
        }
    };

    var fakeModalService = {
        openCkiUpgradingKnowMore: jasmine.createSpy()
    };
    var fakeCheckinFlowService = {
        warnUserOnBackPressed: jasmine.createSpy('warnUserOnBackPressed'),
        checkConfirmationPNR: jasmine.createSpy('checkConfirmationPNR')
    };

    var fakeCkiDatalayerConstants = require('test/constants/datalayer-cki-constants.json');

    var fakeMonetateConstants = {
        MONETATE_INFO: {
            SETPAGETYPE: 'testPageType'
        }
    };

    var mockTransformedData = {
        'segments_toShow': 'test',
        'selected_offer': [{
            'id': 'FIFTH',
            'totalAmount': 10,
            'offerSegmentClasses': [
                {
                    'segment': 1
                }
            ]
        }],
        'posOfferPrice': 'test',
        'totalPosPrice': 'test',
        'totalAmount': 'test',
        'posOfferbox': 'test',
        'combined_offers_segments': [[1]],
        'currency': 'test',
        'offers': [{
            'id': 'FIFTH',
            'totalAmount': 10,
            'offerSegmentClasses': [1, 2]
        }, {
            'id': 'COMBINED',
            'totalAmount': 470.92
        }],
        'slices': [
            {   
                "segments": [
                    {
                        "actualClass": {
                            "type": "ECONOMY",
                            "description": "Turista"
                        },
                        "offers": [
                            {
                                "id": "FIRST",
                                "offerSegmentClasses": [
                                    {
                                        "segment": 3,
                                        "cabinClass": {
                                            "code": "U",
                                            "type": "BUSINESS",
                                            "description": "Business"
                                        }
                                    }
                                ],
                                "amountPerPassenger": 644,
                                "cabinLayout": "BUSINESS_PLUS",
                                "totalAmount": 1288,
                                "cabinLayoutDescription": "Business Plus",
                                "totalAmountFormmated": "1.288€",
                                "amountPerPassengerFormmated": "644€",
                                "isSelected": false,
                                "conditions": {
                                    "onLand": [
                                        "UPGRADING_BUSINESS_PLUS_ON_LAND_TEXT_1",
                                        "UPGRADING_BUSINESS_PLUS_ON_LAND_TEXT_2",
                                        "UPGRADING_BUSINESS_PLUS_ON_LAND_TEXT_3"
                                    ],
                                    "onBoard": [
                                        "UPGRADING_BUSINESS_PLUS_ON_BOARD_TEXT_1",
                                        "UPGRADING_BUSINESS_PLUS_ON_BOARD_TEXT_2"
                                    ]
                                },
                                "images": [
                                    "/iberia-web-content/imagenes/upgrade/info_business-plus/Carrusel_01.png",
                                    "/iberia-web-content/imagenes/upgrade/info_business-plus/Carrusel_02.png",
                                    "/iberia-web-content/imagenes/upgrade/info_business-plus/Carrusel_03.png"
                                ]
                            },
                            {
                                "id": "SECOND",
                                "offerSegmentClasses": [
                                    {
                                        "segment": 3,
                                        "cabinClass": {
                                            "code": "P",
                                            "type": "PREMIUMTOURIST",
                                            "description": "Turista Premium"
                                        }
                                    }
                                ],
                                "amountPerPassenger": 244,
                                "cabinLayout": "PREMIUM_ECONOMY",
                                "totalAmount": 488,
                                "cabinLayoutDescription": "Turista Premium",
                                "totalAmountFormmated": "488€",
                                "amountPerPassengerFormmated": "244€",
                                "isSelected": false,
                                "conditions": {
                                    "onLand": [
                                        "UPGRADING_PREMIUM_TOURIST_ON_LAND_TEXT_1",
                                        "UPGRADING_PREMIUM_TOURIST_ON_LAND_TEXT_2"
                                    ],
                                    "onBoard": [
                                        "UPGRADING_PREMIUM_TOURIST_ON_BOARD_TEXT_1",
                                        "UPGRADING_PREMIUM_TOURIST_ON_BOARD_TEXT_2"
                                    ]
                                },
                                "images": [
                                    "/iberia-web-content/imagenes/upgrade/info_turista-premium/Carrusel_01.png",
                                    "/iberia-web-content/imagenes/upgrade/info_turista-premium/Carrusel_02.png",
                                    "/iberia-web-content/imagenes/upgrade/info_turista-premium/Carrusel_03.png"
                                ]
                            }
                        ],
                        "offerSelected": false
                    }
                ],
            }
        ]
    };

    var mockUpgradeControllerModelWithShowPriceCombinated = {
        'totalPrice': null,
        'showPriceCombinated': true,
        'haveCombinedOffers': true,
        'combinedOffersSegments': [{
            'id': 'COMBINED',
            'segments': [
                { 'segmentId': 5, 'cabinClassCode': 'P' },
                { 'segmentId': 6, 'cabinClassCode': 'B' }
            ]
        }],
        'totalPriceFormatted': '0.00�',
        'totalPriceCombined': 470.92,
        'showTotal': false,
        'showOffersPopUp': true,
        'currency': {
            'suffixSymbol': true,
            'decimalSeparator': '.',
            'code': 'EUR',
            'numberDecimals': 2,
            'groupingSeparator': ',',
            'symbol': '�',
            'recommendedDisplay': 'symbol'
        },
        'slices': [
            {
                'segments': [
                    {
                        'id': 'not-selected',
                        'actualClass': {
                            'type': 'PREMIUMTOURIST',
                            'description': 'Premium Economy'
                        },
                        'offers': [
                            {
                                'id': 'SEGMENT_5',
                                'isSelected': true,
                                'totalAmount': 200,
                                'offerSegmentClasses': [
                                    {
                                        'segment': 5,
                                        'cabinClass': {
                                            'code': 'P',
                                            'type': 'PREMIUMTOURIST',
                                            'description': 'Premium Economy'
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        'id': 'SECOND_SEGMENT',
                        'offers': [{
                            'id': 'SEGMENT_6',
                            'isSelected': true,
                            'totalAmount': 270.92,
                            'offerSegmentClasses': [{
                                'segment': 6,
                                'cabinClass': { 'code': 'B', 'type': 'BUSINESS' }
                            }]
                        }]
                    }
                ],
                'actualClass': {
                    'type': 'PREMIUMTOURIST',
                    'description': 'Premium Economy'
                },
                'time': '2019-10-10 20:50',
                '$$hashKey': 'object:1950'
            }
        ]
    };

    var mockTimeSession = {
        'startTime': dayjs(),
        'openedModal': false,
        'failedKeepAliveService': false,
        'timerActivate': true
    };

    const fakeDigitalDataInfo = require('test/constants/datalayer-general-constants.json');
    const fakeDatalayerCKIService = {
        setProcessAndStep: jasmine.createSpy().and.callFake(angular.noop)
    };
    const fakeNewMainHeaderFacade = {
        initHeaderModel: jasmine.createSpy('initHeaderModel')
    };

    var $fakeFilter = jasmine.createSpy('$filter').and.callFake(function (filter){
        var filterFunc = function () {
            return [];
        };
        switch (filter) {
            case 'translate':
                filterFunc = function (label) {
                    return label;
                };
                break;
            case 'literalFormatter':
                filterFunc = function (label) {
                    return label;
                };
                break;
            default:
                break;
        }
        return filterFunc;
    });

    beforeEach(function () {
        angular.mock.module('ib-check-in-upgrade-module', 'LocalStorageModule', function ($provide) {
            $provide.value('UpgradeService', fakeUpgradeService);
            $provide.value('CkiDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('CkiDatalayerConstants', fakeCkiDatalayerConstants);
            $provide.value('IbPassengerBookingUtilsService', fakeIbPassengerBookingUtilsService);
            $provide.value('CheckinAppConstants', fakeCheckinAppConstants);
            $provide.value('CurrencyService', fakeCurrencyService);
            $provide.value('MonetateUtilsService', fakeMonetateUtilsService);
            $provide.value('MonetateConstants', fakeMonetateConstants);
            $provide.value('ModalService', fakeModalService);
            $provide.value('DigitalDataInfo', fakeDigitalDataInfo);
            $provide.value('CkiDataLayerService', fakeDatalayerCKIService);
            $provide.value('NewMainHeaderFacade', fakeNewMainHeaderFacade);
            $provide.value('$filter', $fakeFilter);
            $provide.value('IbSessionConfigService', fakeIbSessionConfigService);
            $provide.value('IbAncillariesPaymentUtilsService', fakeIbAncillariesPaymentUtilsService);
            $provide.value('IbUtilsService', fakeIbUtilsService);
            $provide.value('CheckinFlowService', fakeCheckinFlowService);
        });
        inject(function ($rootScope, $controller, $timeout, _$q_, _localStorageService_) {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            rootScope.timeSession = mockTimeSession;
            timeout = $timeout;
            $q = _$q_;
            _localStorageService_.remove('upgSlices');

            fakeCheckinFlowService.checkConfirmationPNR.and.callFake(function () {
                return false;
            });

            fakeUpgradeService.generateUpgradeModel = jasmine.createSpy('generateUpgradeModel').and.callFake(function () {
                var defer = $q.defer();
                defer.resolve(mockTransformedData)
                return defer.promise;
            });

            controller = $controller('UpgradeController', {
                '$scope': scope,
                '$rootScope': rootScope,
                '$timeout': timeout,
            });
            scope.$digest();
        });
    });

    describe('When activate() is called,', function () {
        it('checkConfirmationPNR should have been called and returned false', function (done) {
            expect(fakeCheckinFlowService.checkConfirmationPNR).toHaveBeenCalled();
            done();
        });

        it('CkiDatalayerUtilsService updateDatalayerWithQuadrigam and sendDatalayerEvent should be called', function (done) {
            timeout.flush();
            expect(fakeDatalayerUtilsService.updateDatalayerWithQuadrigam).toHaveBeenCalled();
            expect(fakeDatalayerUtilsService.sendDatalayerEvent).toHaveBeenCalled();
            expect(fakeDatalayerUtilsService.updateAircraft).toHaveBeenCalled();
            done();
        });

        it('generateUpgradeModel should be called and set data to controller model', function (done) {
            expect(controller.model.segments_toShow).toEqual(mockTransformedData.segments_toShow);
            expect(controller.model.currency).toEqual(mockTransformedData.currency);
            expect(controller.model.slices).toEqual(mockTransformedData.slices);
            expect(controller.model.selectedOffer).toEqual(mockTransformedData.selectedOffer);
            expect(controller.model.posOfferPrice).toEqual(mockTransformedData.posOfferPrice);
            expect(controller.model.totalPriceCombined).toEqual(mockTransformedData.totalPriceCombined);
            expect(controller.model.posOfferbox).toEqual(mockTransformedData.posOfferbox);
            expect(controller.model.posOfferPriceFormatted).toEqual(mockTransformedData.posOfferPriceFormatted);
            expect(controller.model.haveCombinedOffers).toEqual(mockTransformedData.haveCombinedOffers);
            expect(controller.model.totalPriceFormatted).toEqual(mockTransformedData.totalPriceFormatted);
            done();
        });
    });

    describe('When calculatePrice() is called,', function () {
        var mockOffersSelected = 'test', upgradeServiceOffersSelected;
        beforeEach(
            inject(
                function ($controller, _$q_) {
                    $q = _$q_;

                    controller = $controller('UpgradeController', {
                        '$scope': scope,
                        UpgradeService: fakeUpgradeService,
                        CkiDatalayerUtilsService: fakeDatalayerUtilsService
                    });

                    upgradeServiceOffersSelected = fakeUpgradeService.getCombinedOffer = jasmine.createSpy('getCombinedOffer').and.callFake(function () {
                        return mockOffersSelected;
                    });

                    scope.$digest();
                }));

        it('model total price should be 470.92', function (done) {
            inject(function () {
                    controller.model = angular.copy(mockUpgradeControllerModelWithShowPriceCombinated);
            })
                controller.calculatePrice({ id: 'not-selected' }, { isSelected: false });
            expect(controller.model.totalPrice).toEqual(470.92);
            done();
        });

        it('and showPriceCombinated and haveCombinedOffers are true', function (done) {
            controller.model = angular.copy(mockUpgradeControllerModelWithShowPriceCombinated);
            controller.calculatePrice({ id: 'not-selected' }, { isSelected: false });
            expect(controller.model.totalPrice).toEqual(470.92);
            done();
        });
    });

    describe('When updateUpgradeView() is called,', function () {
        var mockAccepted = 'test';
        beforeEach(
            inject(
                function ($controller) {
                    controller = $controller('UpgradeController', {
                        '$scope': scope,
                        UpgradeService: fakeUpgradeService
                    });
                    scope.$digest();
                }));

        it('and updateUpgradeInformation is called inside', function (done) {
            controller.updateUpgradeView(mockAccepted);
            expect(fakeUpgradeService.updateUpgradeInformation).toHaveBeenCalled();
            done();
        });
    });

    describe('When getOfferImage() is called,', function () {
        var mockOfferClassPE = 'PREMIUM_ECONOMY', mockOfferClassBP = 'BUSINESS_PLUS', mockOfferClassBC = 'BUSINESS_CLUB', mockOfferClassB = 'BUSINESS', mockOfferClassPT = 'PREMIUMTOURIST', mockOfferClassBCC = 'BUSINESS_CLASS', mockOfferClassBAN = 'BUSINESS_AIR_NOSTRUM', mockOfferClassBIE = 'BUSINESS_IBERIA_EXPRESS', getOfferImageReturnedValue = '';
        beforeEach(
            inject(
                function ($controller, _localStorageService_) {
                    _localStorageService_.set('newUpgradeInterfaz', true);
                    controller = $controller('UpgradeController', {
                        '$scope': scope,
                        UpgradeService: fakeUpgradeService,
                        CheckinAppConstants: fakeCheckinAppConstants
                    });
                    scope.$digest();
                }));

        it('case PREMIUM_ECONOMY', function (done) {
            getOfferImageReturnedValue = controller.getOfferImage({ cabinLayout: mockOfferClassPE });
            expect(getOfferImageReturnedValue).toEqual('/iberia-web-content/imagenes/upgrade/turista_premium-sin_mascara.png');
            done();
        });

        it('case BUSINESS_PLUS', function (done) {
            getOfferImageReturnedValue = controller.getOfferImage({ cabinLayout: mockOfferClassBP });
            expect(getOfferImageReturnedValue).toEqual('/iberia-web-content/imagenes/upgrade/business_plus-sin_mascara.png');
            done();
        });

        it('case BUSINESS_CLUB', function (done) {
            getOfferImageReturnedValue = controller.getOfferImage({ cabinLayout: mockOfferClassBC });
            expect(getOfferImageReturnedValue).toEqual('/iberia-web-content/imagenes/upgrade/business_plus-sin_mascara.png');
            done();
        });

        it('case BUSINESS', function (done) {
            getOfferImageReturnedValue = controller.getOfferImage({ cabinLayout: mockOfferClassB });
            expect(getOfferImageReturnedValue).toEqual('/iberia-web-content/imagenes/upgrade/business_class-sin-mascara.png');
            done();
        });
    });

    describe('When getOfferTitle() is called,', function () {
        var mockOfferClassPT = 'PREMIUMTOURIST', mockOfferClassBP = 'BUSINESS_PLUS', mockOfferClassBC = 'BUSINESS_CLUB', mockOfferClassB = 'BUSINESS', mockOfferClassPE = 'PREMIUM_ECONOMY', mockOfferClassBCC = 'BUSINESS_CLASS', mockOfferClassBAN = 'BUSINESS_AIR_NOSTRUM', mockOfferClassBIE = 'BUSINESS_IBERIA_EXPRESS', getOfferTitleReturnedValue;
        beforeEach(
            inject(
                function ($controller) {
                    controller = $controller('UpgradeController', {
                        '$scope': scope,
                        UpgradeService: fakeUpgradeService
                    });
                    getOfferTitleReturnedValue = '';
                    scope.$digest();
                }));

        it('case PREMIUMTOURIST', function (done) {
            getOfferTitleReturnedValue = controller.getOfferTitle(mockOfferClassPT);
            expect(getOfferTitleReturnedValue).toEqual('CKIANCUPP_PREMIUM_ECONOMY');
            done();
        });

        it('case BUSINESS_PLUS', function (done) {
            getOfferTitleReturnedValue = controller.getOfferTitle(mockOfferClassBP);
            expect(getOfferTitleReturnedValue).toEqual('CKIANCUPP_BUSINESS_CLASS');
            done();
        });

        it('case BUSINESS_CLUB', function (done) {
            getOfferTitleReturnedValue = controller.getOfferTitle(mockOfferClassBC);
            expect(getOfferTitleReturnedValue).toEqual('CKIANCUPP_BUSINESS_CLASS');
            done();
        });

        it('case BUSINESS', function (done) {
            getOfferTitleReturnedValue = controller.getOfferTitle(mockOfferClassB);
            expect(getOfferTitleReturnedValue).toEqual('CKIANCUPP_BUSINESS_CLASS');
            done();
        });
    });
});
