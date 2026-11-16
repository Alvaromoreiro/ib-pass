import angular from "angular";
import { of } from "rxjs";
describe('CustomizeFlightTabController test', function () {
    var controller, $scope, $rootScope, $controller, localStorageService, DatalayerConstants;

    var fakeAppConstants = {
        'market': 'ES',
        QUADRIGAM: { CUSTOMIZE_FLIGHTS: 'test', MODAL_GASTRONOMIC_PROPOSAL: 'GASTRO_QUADRIGAM' },
        ANCILLARIES_TYPES : {
            SEAT: 'SEAT',
            PREORDER: 'PREORDER'
        }
    };

    var fakeDatalayerUtilsService = {
        updateDatalayerWithQuadrigam: jasmine.createSpy('updateDatalayerWithQuadrigam').and.callFake(angular.noop),
        sendDatalayerEvent: jasmine.createSpy(),
        updateDigitalDataWithQuadrigam: jasmine.createSpy(),
        updateDatalayerViewEvent: jasmine.createSpy(),
        setProcessAndStep: jasmine.createSpy(),
        updateDatalayerEvents: jasmine.createSpy(),
        updateDatalayerInfo: jasmine.createSpy()
    };

    var fakeMmBUtilService = {
        'isUserLogged': jasmine.createSpy('isUserLogged').and.callFake(function () { }),
        'getCompanyLogo': jasmine.createSpy('getCompanyLogo').and.returnValue('fake_logo_url')
    };

    var fakeMmBModalService = {
        showGenericModal: jasmine.createSpy()
    }

    var fakeRedirectionService = {
        externalRedirect: jasmine.createSpy()
    }
    var $filterFake = jasmine.createSpy('$filter').and.callFake(function (filter) {
        var filterFunc = function () {
            return '';
        };
        switch (filter) {
            case 'translate':
                filterFunc = function () {
                    return 'Translated Text';
                };
                break;
            default:
                break;
        }

        return filterFunc;
    });

    var fakeBookingDashboardConstants, fakeAncillariesConstants = {
        DATALAYER_INFO: {
            MODULE_PREORDER: 'test',
            PREORDER_CODE: 'test',
            PREORDER_ACCESS: 'test'
        }
    }
    var fakeDatalayerConstants = {
        DATALAYER_EVENT_TYPES: {
            VIEW: 'TEST_4',
            CLIC: 'clic'
        },
        DIGITAL_DATA_PROCESS: {
            MOANCI: 'test',
            GASTRO_QUADRIGAM: 'quadrigam_test'
        },
        DIGITAL_DATA_STEP: {
            MOANCI: 'test',
            GASTRO_QUADRIGAM: 'step_test'
        },
        GASTRONOMIC_EVENT_CATEGORY_VALUES: {
            GASTRONOMIC_PROPOSAL: 'gastro-proposal-test'
        },
        DatalayerGeneralConstants: {
            EVENT_NAME_INTERACTION: 'interaction'
        }
    };
    var fakeCommonsUtilService = {
        'setTitlePage': jasmine.createSpy('setTitlePage').and.callFake(function () {
            return 'TITULO'
        }),
    };

    var fakeBkiInfo = {
        contextMetadata: {
            language: 'es'
        },
        deepLinkInformation: true,
        order: {
            slices: [
                {
                    type: 'SHUTTLE',
                    segments: [
                        {
                            test: 'test'
                        }
                    ]
                }
            ]
        }
    };

    var fakeOrderAncillariesModules = [
        'UPGRADING_AVIOS_BID',
        'UPGRADING_BID'
    ]

    var $injector;

    var fakeAncillariesService = {};



    var fakeocLazyLoad = {
        'load': jasmine.createSpy(),
    };

    var fakeCommonsModalService = {
        'showGenericDynamicModal': jasmine.createSpy(),
    }

    var fakeBreakdownInfo = {
        "currencies": [
            {
                "code": "EUR",
                "description": "Euro",
                "symbol": "€",
                "alignment": "R",
                "groupingSeparator": ".",
                "decimalSeparator": ",",
                "decimals": 2,
                "recommendedDisplay": "symbol"
            }
        ],
        "context": {
            "issueOffice": "MAD175",
            "locator": "KVF0E",
            "paymentMode": "ONLINE",
            "passengers": [
                {
                    "id": "ADULT_01",
                    "surname": "TEST",
                    "name": "TESTUNO",
                    "ticketPrices": [
                        {
                            "currency": "EUR",
                            "tourCode": null,
                            "number": "0751415045476",
                            "tax": 30.63,
                            "fare": 135,
                            "total": 165.63
                        }
                    ],
                    "birthDate": null,
                    "frequentFlyer": null,
                    "passengerType": "ADULT",
                    "items": [],
                    "title": null,
                    "infant": 'bebeuno test',
                    "resiberId": "1"
                },
                {
                    "id": "INFANT_01",
                    "surname": "TEST",
                    "name": "BEBEUNO",
                    "ticketPrices": [
                        {
                            "currency": "EUR",
                            "tourCode": null,
                            "number": "0751415045477",
                            "tax": 30.63,
                            "fare": 135,
                            "total": 165.63
                        }
                    ],
                    "birthDate": null,
                    "frequentFlyer": null,
                    "passengerType": "INFANT",
                    "items": [],
                    "title": null,
                    "infant": true,
                    "resiberId": "2"
                }
            ],
            "checkinFlowMode": "REGULAR",
            "slices": [
                {
                    "id": "MADBIO20230505072500",
                    "segmentIds": [
                        "IB044820230505"
                    ]
                },
                {
                    "id": "BIOMAD20230512064500",
                    "segmentIds": [
                        "IB044320230512"
                    ]
                }
            ],
            "issueCurrency": "EUR",
            "issueCountry": "ES",
            "segments": [
                {
                    "departureDate": "2023-05-05 07:25",
                    "arrivalDate": "2023-05-05 08:30",
                    "utcDepartureDate": "2023-05-05 05:25",
                    "utcArrivalDate": "2023-05-05 06:30",
                    "departureAirport": "MAD",
                    "arrivalAirport": "BIO",
                    "operatingFlight": {
                        "flightNumber": "0448",
                        "cabin": {
                            "cabinClass": {
                                "type": "ECONOMY",
                                "rbd": "O"
                            },
                            "carrier": "IB"
                        }
                    },
                    "marketingFlight": null,
                    "id": "IB044820230505",
                    "time": "BKI",
                    "passengerCoupons": [
                        {
                            "id": "ADULT_01",
                            "coupon": "1",
                            "farebasis": "OWNNU4",
                            "numberTicket": "0751415045476",
                            "ticketDesignator": "",
                            "issueDate": "2023-03-16",
                            "seat": null,
                            "infantCoupon": null,
                            "eligible": true,
                            "franchisePieces": [],
                            "extraPieces": [],
                            "status": {
                                "message": "CHECKABLE",
                                "code": "CHECKABLE"
                            }
                        },
                        {
                            "id": "ADULT_02",
                            "coupon": "1",
                            "farebasis": "OWNNU4",
                            "numberTicket": "0751415045477",
                            "ticketDesignator": "",
                            "issueDate": "2023-03-16",
                            "seat": null,
                            "infantCoupon": null,
                            "eligible": true,
                            "franchisePieces": [],
                            "extraPieces": [],
                            "status": {
                                "message": "CHECKABLE",
                                "code": "CHECKABLE"
                            }
                        },
                        {
                            "id": "ADULT_03",
                            "coupon": "1",
                            "farebasis": "OWNNU4",
                            "numberTicket": "0751415045478",
                            "ticketDesignator": "",
                            "issueDate": "2023-03-16",
                            "seat": null,
                            "infantCoupon": null,
                            "eligible": true,
                            "franchisePieces": [],
                            "extraPieces": [],
                            "status": {
                                "message": "CHECKABLE",
                                "code": "CHECKABLE"
                            }
                        },
                        {
                            "id": "ADULT_04",
                            "coupon": "1",
                            "farebasis": "OWNNU4",
                            "numberTicket": "0751415045479",
                            "ticketDesignator": "",
                            "issueDate": "2023-03-16",
                            "seat": null,
                            "infantCoupon": null,
                            "eligible": true,
                            "franchisePieces": [],
                            "extraPieces": [],
                            "status": {
                                "message": "CHECKABLE",
                                "code": "CHECKABLE"
                            }
                        }
                    ],
                    "edifact": false,
                    "pricesProvider": "TARIFICATOR",
                    "flown": false,
                    "haul": "DO",
                    "upgAvios": false
                },
                {
                    "departureDate": "2023-05-12 06:45",
                    "arrivalDate": "2023-05-12 07:55",
                    "utcDepartureDate": "2023-05-12 04:45",
                    "utcArrivalDate": "2023-05-12 05:55",
                    "departureAirport": "BIO",
                    "arrivalAirport": "MAD",
                    "operatingFlight": {
                        "flightNumber": "0443",
                        "cabin": {
                            "cabinClass": {
                                "type": "ECONOMY",
                                "rbd": "N"
                            },
                            "carrier": "IB"
                        }
                    },
                    "marketingFlight": null,
                    "id": "IB044320230512",
                    "time": "BKI",
                    "passengerCoupons": [
                        {
                            "id": "ADULT_01",
                            "coupon": "2",
                            "farebasis": "NDNNB4",
                            "numberTicket": "0751415045476",
                            "ticketDesignator": "",
                            "issueDate": "2023-03-16",
                            "seat": {
                                "row": "9",
                                "column": "C"
                            },
                            "infantCoupon": null,
                            "eligible": true,
                            "franchisePieces": [],
                            "extraPieces": [],
                            "status": {
                                "message": "CHECKABLE",
                                "code": "CHECKABLE"
                            }
                        },
                        {
                            "id": "ADULT_02",
                            "coupon": "2",
                            "farebasis": "NDNNB4",
                            "numberTicket": "0751415045477",
                            "ticketDesignator": "",
                            "issueDate": "2023-03-16",
                            "seat": null,
                            "infantCoupon": null,
                            "eligible": true,
                            "franchisePieces": [],
                            "extraPieces": [],
                            "status": {
                                "message": "CHECKABLE",
                                "code": "CHECKABLE"
                            }
                        },
                        {
                            "id": "ADULT_03",
                            "coupon": "2",
                            "farebasis": "NDNNB4",
                            "numberTicket": "0751415045478",
                            "ticketDesignator": "",
                            "issueDate": "2023-03-16",
                            "seat": null,
                            "infantCoupon": null,
                            "eligible": true,
                            "franchisePieces": [],
                            "extraPieces": [],
                            "status": {
                                "message": "CHECKABLE",
                                "code": "CHECKABLE"
                            }
                        },
                        {
                            "id": "ADULT_04",
                            "coupon": "2",
                            "farebasis": "NDNNB4",
                            "numberTicket": "0751415045479",
                            "ticketDesignator": "",
                            "issueDate": "2023-03-16",
                            "seat": null,
                            "infantCoupon": null,
                            "eligible": true,
                            "franchisePieces": [],
                            "extraPieces": [],
                            "status": {
                                "message": "CHECKABLE",
                                "code": "CHECKABLE"
                            }
                        }
                    ],
                    "edifact": false,
                    "pricesProvider": "IBDP",
                    "flown": false,
                    "haul": "DO",
                    "upgAvios": false
                }
            ],
            "flownSegments": false,
            "dynamicPricing": false,
            "bookingDate": "2023-03-07 18:39",
            "offer": null
        },
        "freeItems": [{
            "segments": [
                {
                    "id": "IB880920190902",
                    "passengers": [
                        {
                            "id": "ADULT_04",
                            "eTicket": "0751415045476",
                            "amount": 65,
                            "currency": "EUR",
                            "formOfPayment": "CCVI,XXXXXXXXXXXX9999/0224/J2KQU9/",
                            "emd": "075-5575564928",
                            "coupons": [
                                {
                                    "number": 1,
                                    "status": "USED"
                                }
                            ],
                            'seat': {
                                'column': '10',
                                'row': 'B'
                            }
                        }
                    ]
                }
            ],
            "type": "UPGRADING_WAITING_LIST"
        }],
        "pendingPaymentItems": [
            {
                "total": 12,
                "currency": "EUR",
                "segments": [
                    {
                        "id": "IB880920190901",
                        "passengers": [
                            {
                                "id": "ADULT_03",
                                "seat": {
                                    "row": "12",
                                    "column": "B",
                                    "features": [
                                        "NON_RECLINING",
                                        "EXTRA_SIZE"
                                    ]
                                },
                                "amount": 12,
                                "originalAmount": 0
                            }
                        ]
                    }
                ],
                "type": "SEAT"
            }
        ],
        "pendingIssuanceItems": [],
        "issuedItems": [
            {
                "segments": [
                    {
                        "id": "IB880920190902",
                        "passengers": [
                            {
                                "id": "ADULT_01",
                                "eTicket": "0751415045476",
                                "amount": 65,
                                "currency": "EUR",
                                "formOfPayment": "CCVI,XXXXXXXXXXXX9999/0224/J2KQU9/",
                                "emd": "075-5575564928",
                                "coupons": [
                                    {
                                        "number": 1,
                                        "status": "USED"
                                    }
                                ],
                                'seat': {
                                    'column': '2',
                                    'row': 'A'
                                }
                            },
                            {
                                "id": "ADULT_02",
                                "eTicket": "0751415045477",
                                "amount": 65,
                                "currency": "EUR",
                                "formOfPayment": "CCVI,XXXXXXXXXXXX9999/0224/J2KQU9/",
                                "emd": "075-5575564929",
                                "coupons": [
                                    {
                                        "number": 1,
                                        "status": "USED"
                                    }
                                ],
                                'seat': {
                                    'column': '3',
                                    'row': 'A'
                                }
                            }
                        ]
                    }
                ],
                "type": "SEAT"
            }
        ],
        "voucherDiscount": null
    };

    var fakeModalServiceAncillaries = {
        openBobModal: jasmine.createSpy('openBobModal').and.callFake(function () { }),
    };

    let fakeCommercialData = {
        market: {
            code: 'ES'
        }
    };

    beforeEach(function () {
        angular.mock.module('ib-MmB-customize-flights-tab-module', 'LocalStorageModule', function ($provide) {
            $provide.value('MmBAppConstants', fakeAppConstants);
            $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('MmBUtilService', fakeMmBUtilService);
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('RedirectionService', fakeRedirectionService);
            $provide.value('BookingDashboardConstants', fakeBookingDashboardConstants);
            $provide.value('MMBDatalayerConstants', fakeDatalayerConstants);
            $provide.value('$filter',$filterFake);
            $provide.value('ModalServiceAncillaries', fakeModalServiceAncillaries);
            $provide.value('CommonsUtilService',fakeCommonsUtilService);
            $provide.value('orderAncillariesModules',fakeOrderAncillariesModules);
            $provide.value('AncillariesService', fakeAncillariesService);
            $provide.value('$ocLazyLoad', fakeocLazyLoad);
            $provide.value('AncillariesConstants', fakeAncillariesConstants);
            $provide.value('CommonsModalService', fakeCommonsModalService);
        });
        inject(function (_$controller_, _$rootScope_, _$window_, _localStorageService_, _$injector_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            localStorageService = _localStorageService_;
            $injector = Object.keys(_$injector_).reduce(function (clone, key) {
                clone[key] = _$injector_[key];
                return clone
            } , {});
            DatalayerConstants = $injector.get('MMBDatalayerConstants');
            localStorageService.set('orderAncillariesModules', fakeOrderAncillariesModules);
            localStorageService.set('bookingInfo', fakeBkiInfo);
            localStorageService.set('commercialData', fakeCommercialData);
            localStorageService.set('breakdownInfo', fakeBreakdownInfo);
            localStorageService.set('flightAviosInfo', {currency: {code: 'EUR'}});
            localStorageService.set('flowBob', false);
            controller = $controller('CustomizeFlightTabController', {
                $scope: $scope,
                DatalayerConstants: DatalayerConstants,
                AncillariesConstants: fakeAncillariesConstants
            });
        });
    });

    describe('When the activate function is called', function () {

        beforeEach(function() {
            
            localStorageService.set('ancillariesInfo', {
                ancillaries: [
                    {
                        type: 'THIRD_PARTY_COMPANIES',
                        status: {
                            code: 'AVAILABLE'
                        },
                        companies: [
                            {
                            provider: "IB",
                            deeplinks: [
                                {
                                externalUrl: "http://www.ba.com/ancillaries?code=X4kbeiqTWESR7NQlQStIq2+6eeNgrXdUKl08nIL4j3b8OSPj8cThX8PESkmhncuB",
                                segmentId: "IB044820180623"
                                }
                            ]
                            }
                        ],
                    }
                ]
            });
        });

        it('Should activate Gastronomic Proposal Card when Preorder', function(){
            controller.model = {
                ancillariesAvailable: [
                    'PREORDER'
                ],
                specialMealsInfo: {
                    specialMealNumSelected: 0,
                    passengersInfo: [{
                        adult: true
                    }],
                    specialMealSegments: [{}]
                },
                preorderAncillarieInfo: {
                    info: "test"
                }
            };
            controller.$onInit();
            expect(controller.model.ancillariesAvailable.includes('GASTRONOMIC_PROPOSAL')).toBeTrue();
        })
        it('Should set some variables for deeplink functionality', function(done) {

            controller.model = {
                ancillariesAvailable: [
                    'UPGRADING_AVIOS',
                    'UPGRADING_BID',
                    'PREORDER'
                ],
                specialMealsInfo: {
                    specialMealNumSelected: 0,
                    passengersInfo: [{
                        adult: true
                    }],
                    specialMealSegments: [{}]
                },
                preorderAncillarieInfo: {
                    info: "test"
                }
            };
            localStorageService.set('headerModel', {
                shoppingBasket: {
                    baggages: { amount: 1 },
                    seats: { hasSeats: true }
                }
            });
            // controller.headerModelLocal = { shoppingBasket: {seats:{hasSeats:true}}}
            localStorageService.set('deepLinkParams', true);
            localStorageService.set('bookingInfo',fakeBkiInfo);

            controller.$onInit();
            expect(localStorageService.get('deepLinkData')).toEqual(fakeBkiInfo.deepLinkInformation);
            done();
        });
        it('Update Datalayer in case of not  deeplink', function(done) {
            controller.model = {};
            localStorageService.set('bookingInfo',fakeBkiInfo);
            localStorageService.set('deepLinkParams', false);
            expect(localStorageService.get('deepLinkParams')).toBe(false);
            done();
        });

        it('Should set some variables of model and set Quadrigrams with ancillaries info', function (done) {
            controller.model = {
                baggagesQuanty: 1,
                ancillariesAvailable: [
                    'prueba1',
                    'prueba2',
                    'prueba3'
                ],
                specialMealsInfo: {
                    specialMealNumSelected: 0,
                    passengersInfo: [{
                        adult: true
                    }],
                    specialMealSegments: [{}]
                },
                preorderAncillarieInfo: {
                    info: "test"
                }
            };

            localStorageService.set('headerModel', {
                shoppingBasket: {
                    baggages: { amount: 1 },
                    seats: { hasSeats: true }
                }
            });

            localStorageService.set('bookingInfo', {
                contextMetadata: {
                    language: 'es'
                },
                order: {
                    slices: [{
                        segments: [
                            {
                                id: 'IB044820180623',
                                flight: {
                                    operationalCarrier: {
                                        code: 'IB',
                                        name: 'Iberia'
                                    }
                                },
                                departureCity: {
                                    description: 'test'
                                },
                                arrivalCity: {
                                    description: 'test'
                                }
                            }
                        ]
                    }]
                }
            })
            controller.$onInit();
            expect(controller.model.isSeats).toEqual(true);
            expect(controller.thirdPartyCompanies.flights.length).toEqual(1);
            done();
        });

        xit('Should set some variables of model and set Quadrigrams with ancillaries info and segmentid not found', function (done) {
            var expected;
            expected = [
                {
                    type: 'THIRD_PARTY_COMPANIES',
                    status: {
                        code: 'AVAILABLE'
                    },
                    companies: [
                        {
                        provider: "IB",
                        deeplinks: [
                            {
                            externalUrl: "http://www.ba.com/ancillaries?code=X4kbeiqTWESR7NQlQStIq2+6eeNgrXdUKl08nIL4j3b8OSPj8cThX8PESkmhncuB",
                            segmentId: "IB044820180623"
                            }
                        ]
                        }
                    ],
                    flights : [],
                },
                {}
            ];
            controller.model = {
                baggagesQuanty: 1,
                ancillariesAvailable: [
                    'prueba1',
                    'prueba2',
                    'prueba3'
                ],
                specialMealsInfo: {
                    specialMealNumSelected: 0,
                    passengersInfo: [{
                        adult: true
                    }],
                    specialMealSegments: [{}]
                }
            }
            localStorageService.set('headerModel', {
                shoppingBasket: {
                    baggages: { amount: 1 },
                    seats: { hasSeats: true }
                }
            });
            localStorageService.set('bookingInfo', {
                contextMetadata: {
                    language: 'es'
                },
                order: {
                    slices: [{
                        segments: [{
                            id: 3
                        }]
                    }]
                }
            })
            controller.$onInit();

            expect(angular.toJson(controller.ancillariesData)).toEqual(angular.toJson(expected));
            expect(controller.model.isSeats).toEqual(true);
            expect(controller.model.baggagesQuanty).toEqual(1);
            done();
        });

        xit('Should set some variables of model and set Quadrigrams', function (done) {
            controller.model = {
                baggagesQuanty: 1,
                ancillariesAvailable: [
                    'prueba1',
                    'prueba2',
                    'prueba3'
                ],
                specialMealsInfo: {
                    specialMealNumSelected: 0,
                    passengersInfo: [{
                        adult: true
                    }],
                    specialMealSegments: [{}]
                }
            }
            localStorageService.set('headerModel', {
                shoppingBasket: {
                    baggages: {},
                    seats: { hasSeats: false }
                }
            });
            localStorageService.set('ancillariesInfo', { ancillaries: {} });
            controller.$onInit();

            expect(controller.ancillariesData).toEqual({});
            expect(controller.model.isSeats).toEqual(false);
            expect(controller.model.baggagesQuanty).toEqual(1);
            done();
        });

        xit('Should set some variables of model and set Quadrigrams without baggagesquanty', function (done) {
            controller.model = {
                ancillariesAvailable: [
                    'prueba1',
                    'prueba2',
                    'prueba3'
                ],
                specialMealsInfo: {
                    specialMealNumSelected: 0,
                    passengersInfo: [{
                        adult: true
                    }],
                    specialMealSegments: [{}]
                }
            },
            localStorageService.set('headerModel', {
                shoppingBasket: {
                    baggages: {},
                    seats: { hasSeats: false }
                }
            });
            localStorageService.set('ancillariesInfo', { ancillaries: undefined });
            controller.$onInit();

            expect(controller.ancillariesData).toEqual(null);
            expect(controller.model.isSeats).toEqual(false);
            expect(controller.model.baggagesQuanty).toEqual(undefined);
            done();
        });
    });

    describe('When the redirectModal function is called', function () {
        beforeEach(function(){
            controller.thirdPartyCompanies = {
                flights: [
                    {companyUrl:'testURL',  companyName:'testName'}
                ]
            }
        })
        it('Should open modal and change Quadrigams', function (done) {
            inject(function ($q) {
                fakeMmBModalService.showGenericModal = jasmine.createSpy('showGenericError').and.callFake(function () {
                    return {
                        'result': $q.when([])
                    };
                })
            });
            controller.redirectModal({ preventDefault: function () { } }, 0, {});
            $rootScope.$digest();
            expect(fakeMmBModalService.showGenericModal).toHaveBeenCalled();
            expect(fakeDatalayerUtilsService.updateDatalayerWithQuadrigam).toHaveBeenCalled();
            done();
        });
    });
    
    describe('getBobSelectedSegments and getBobFlightInfo', function() {

        it('should process bobInfo, slices, passengers as in controller real logic', function() {
            const fakeBobInfo = {
                slices: [{ sliceId: 'SLICE1' }]
            };
            const fakeBookingInfoWithSlices = {
                contextMetadata: { language: 'es' },
                order: {
                    slices: [{
                        sliceId: 'SLICE1',
                        type: 'REGULAR',
                        segments: [{
                            id: 'SEG1',
                            flight: { marketingCarrier: { name: 'Iberia', code: 'IB' } },
                            departure: { city: { description: 'BARCELONA', code: 'BCN' }, name: 'Barcelona Airport', code: 'BCN', terminal: 'T1' },
                            arrival: { city: { description: 'MADRID', code: 'MAD' }, name: 'Madrid Airport', code: 'MAD', terminal: 'T4' },
                            departureDateTime: '2026-03-13T10:00:00.000Z',
                            arrivalDateTime: '2026-03-13T12:00:00.000Z',
                            cabin: { code: 'Y', bookingClass: 'ECONOMY', description: 'Economy', fareFamily: 'FF', rbd: 'RBD' }
                        }]
                    }]
                },
                passengers: [
                    { personalInfo: { name: 'Alice', surname: 'Smith' } },
                    { personalInfo: { name: 'Bob', surname: 'Jones' } }
                ]
            };

            controller.bookingInfo = fakeBookingInfoWithSlices;
            localStorageService.set('bobInfo', fakeBobInfo);

            inject(function($q) {
                fakeModalServiceAncillaries.openBobModal = jasmine.createSpy('openBobModal').and.returnValue({
                    result: $q.when([])
                });
            });

            $rootScope.$broadcast('openBobModal');
            $rootScope.$digest();

            const segmentsSelected = localStorageService.get('segmentsSelected');
            expect(segmentsSelected).not.toBeNull();
            expect(Array.isArray(segmentsSelected)).toBeTrue();
            expect(segmentsSelected.length).toBe(1);
            expect(segmentsSelected[0]).toEqual(jasmine.objectContaining({
                generalType: 'REGULAR',
                passengerStatus: [
                    { name: 'Alice', surname: 'Smith' },
                    { name: 'Bob', surname: 'Jones' }
                ],
                id: 'SLICE1',
                segmentId: 'SEG1',
                airlineName: 'Iberia',
                airlineLogo: 'fake_logo_url'
            }));
            expect(segmentsSelected[0].departure.cityCode).toBe('BCN');
            expect(segmentsSelected[0].arrival.cityCode).toBe('MAD');
            expect(segmentsSelected[0].cabinClass.code).toBe('Y');
        });

        it('should getBobFlightInfo return all enriched fields — verified via openBobModal flow', function() {
            const fakeBobInfo = {
                slices: [{ sliceId: 'SLICE_FULL' }]
            };
            const fakeBookingInfoFull = {
                contextMetadata: { language: 'es' },
                order: {
                    slices: [{
                        sliceId: 'SLICE_FULL',
                        type: 'REGULAR',
                        segments: [{
                            id: 'SEG_FULL',
                            flight: { marketingCarrier: { name: 'Iberia', code: 'IB' } },
                            departure: { city: { description: 'BARCELONA', code: 'BCN' }, name: 'Barcelona Airport', code: 'BCN', terminal: 'T1' },
                            arrival: { city: { description: 'MADRID', code: 'MAD' }, name: 'Madrid Airport', code: 'MAD', terminal: 'T4' },
                            departureDateTime: '2026-03-13T10:00:00.000Z',
                            arrivalDateTime: '2026-03-13T12:00:00.000Z',
                            cabin: { code: 'Y', bookingClass: 'ECONOMY', description: 'Clase E', fareFamily: 'Flex', rbd: 'RBD22' }
                        }]
                    }]
                },
                passengers: [
                    { personalInfo: { name: 'Alice', surname: 'Smith' } }
                ]
            };

    
            controller.bookingInfo = fakeBookingInfoFull;
            localStorageService.set('bobInfo', fakeBobInfo);

            inject(function($q) {
                fakeModalServiceAncillaries.openBobModal = jasmine.createSpy('openBobModal').and.returnValue({
                    result: $q.when([])
                });
            });

            $rootScope.$broadcast('openBobModal');
            $rootScope.$digest();

            const segmentsSelected = localStorageService.get('segmentsSelected');
            expect(segmentsSelected).not.toBeNull();
            expect(segmentsSelected.length).toBe(1);

            const seg = segmentsSelected[0];
            expect(seg.departure.cityDescription).toBe('BARCELONA');
            expect(seg.departure.cityCode).toBe('BCN');
            expect(seg.departure.airportCode).toBe('BCN');
            expect(seg.departure.terminal).toBe('T1');
            expect(seg.departure.originalDate).toBe('2026-03-13T10:00:00.000Z');
            expect(seg.arrival.cityDescription).toBe('MADRID');
            expect(seg.arrival.cityCode).toBe('MAD');
            expect(seg.arrival.airportCode).toBe('MAD');
            expect(seg.arrival.terminal).toBe('T4');
            expect(seg.arrival.originalDate).toBe('2026-03-13T12:00:00.000Z');
            expect(seg.cabinClass.code).toBe('Y');
            expect(seg.cabinClass.type).toBe('ECONOMY');
            expect(seg.cabinClass.description).toBe('Clase E');
            expect(seg.cabinClass.fareFamily).toBe('Flex');
            expect(seg.cabinClass.mainClass).toBe('RBD22');
        });

        it('should handle missing slice in bookingInfo gracefully', function() {
            const fakeBobInfo = {
                slices: [{ sliceId: 'NONEXISTENT_SLICE' }]
            };
            const fakeBookingInfoEmpty = {
                contextMetadata: { language: 'es' },
                order: { slices: [] },
                passengers: []
            };

            controller.bookingInfo = fakeBookingInfoEmpty;
            localStorageService.set('bobInfo', fakeBobInfo);

            inject(function($q) {
                fakeModalServiceAncillaries.openBobModal = jasmine.createSpy('openBobModal').and.returnValue({
                    result: $q.when([])
                });
            });


            expect(function() {
                $rootScope.$broadcast('openBobModal');
                $rootScope.$digest();
            }).toThrow();
        });
    });

    describe ('When redirectToCheckin is called', function () {
        beforeEach(function(){
            inject(function ($q) {
                fakeMmBModalService.showGenericModal = jasmine.createSpy('showGenericError').and.callFake(function () {
                    return {
                        'result': $q.when([])
                    };
                });
                fakeRedirectionService.externalRedirect = jasmine.createSpy();
            });
        });
        it('Should open modal and redirect', function(done) {

            controller.redirectToCheckin();
            $rootScope.$digest();
            expect(fakeMmBModalService.showGenericModal).toHaveBeenCalled();
            expect(fakeRedirectionService.externalRedirect).toHaveBeenCalled();
            done();
        })

    })

    describe('When the setDefaultQuadrigam function is called', function () {
        it('Should update Quadrigams', function (done) {
            $rootScope.$broadcast('cancelModalEvent');

            expect(fakeDatalayerUtilsService.updateDatalayerWithQuadrigam).toHaveBeenCalled();
            done();
        });
    });

    describe('When the verifySeats function is called', function () {
        it('Should update model if there is seats', function (done) {
            controller.model = {};
            controller.headerModelLocal = { shoppingBasket: {seats:{hasSeats:true}}}
            $rootScope.$broadcast('acceptSeats');
            expect(controller.model.isSeats).toEqual(true);
            done()
        });
        it('Should update model if there is no seats', function (done) {
            controller.model = {};
            controller.headerModelLocal = { shoppingBasket: {seats:{hasSeats:false}}}
            $rootScope.$broadcast('acceptSeats');
            expect(controller.model.isSeats).toEqual(false);
            done();
        });
    });
    describe('When getBoxCardClassId is called', function(){
        it('Should return a class string', function(done){
            var cStyle = controller.getBoxCardClassId(3);
            expect(cStyle).toEqual('bigs-1');
            done();

        })
    })
    describe('When bobAvailable is called', function(){
        beforeEach(function(){
            $rootScope.appMarket= 'ES';
            $rootScope.appLang = 'en';
        });

        it('Should type order booking info is "SHUTTLE" return false', function(done){
            controller.bookingInfo.order.slices[0].type = 'SHUTTLE';
            expect(controller.bobAvailable()).toBe(false);
            done();
        })
        it('Should return true', function(done){
            controller.bookingInfo.order.slices[0].type = 'other';
            expect(controller.bobAvailable()).toBe(true);
            done();
        })
    });
});
