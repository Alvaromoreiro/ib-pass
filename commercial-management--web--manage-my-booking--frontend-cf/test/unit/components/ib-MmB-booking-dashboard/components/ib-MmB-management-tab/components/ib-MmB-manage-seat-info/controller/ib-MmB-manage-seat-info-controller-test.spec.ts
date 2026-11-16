import angular from "angular";

describe('MmbManageSeatInfoController test', function () {
    let controller, $rootScope, $injector, $controller, localStorageService, $timeout;
    var fakeMmBModalService = { showGenericModal: {} }

    var fakeDatalayerUtilsService = {
        'updateDatalayerWithQuadrigam': jasmine.createSpy(),
        'sendDatalayerEvent': jasmine.createSpy(),
        'updateDigitalDataWithQuadrigam': jasmine.createSpy(),
        'updateDatalayerViewEvent': jasmine.createSpy(),
        'removeDatalayerModalAttrs': jasmine.createSpy().and.callFake(function () {
            return 'removeDatalayer'
        }),
        'setProcessAndStep': jasmine.createSpy(),
        'updateDatalayerInfo': jasmine.createSpy()
    };

    var fakeMmBAppConstants = {
        'QUADRIGAM': {
            'MODAL_INFO_SEATS': 'MODSEA'
        }
    }
    var fakeDatalayerConstants = {
        DATALAYER_EVENT_TYPES: {
            'VIEW': 'TEST'
        },
        DIGITAL_DATA_PROCESS: {
            MODSEA: 'test'
        },
        DIGITAL_DATA_STEP: {
            MODSEA: 'test'
        }
    };

        let fakeMmBAncillariesUtilsService = {
        'getTypeAndDescription': jasmine.createSpy().and.callFake(function () {
            return { 'description': 'XL' }
        })
    };


    let controllerDependencies = {
        'MmBModalService': fakeMmBModalService,
        'DatalayerUtilsService': fakeDatalayerUtilsService,
        'MmBAppConstants': fakeMmBAppConstants,
        'MmBAncillariesUtilsService': fakeMmBAncillariesUtilsService,
        'MMBDatalayerConstants': fakeDatalayerConstants,
        $timeout: $timeout,
    };

    var fakeModel = {
        'flights': [
            {
                'segmentStatus': 'pending',
                'segmentId': 'IB880920190901',
                'seats': [{ code: '17C', price: 8 }, { code: '20A', price: 0}],
                "updatedSeats":[]
            },
            {
                'segmentStatus': 'pending',
                'segmentId': 'IB880920190902',
                'seats': [{ code: '2A', price: 0, selected: true },],
                "updatedSeats":[ { code: '2B', price: 5 }]
            }
        ]
    };

    var fakeEvent = {
        'preventDefault': function () {

        }
    }

    var fakeSeatsAvailableSegments = ['IB880920190901', 'IB880920190902'];

    var fakeUpdateSeatFlights = [
        {
            "seats": [
                {
                    "code": "20A",
                    "codeInitial": "20A",
                    "rowInitial": "20",
                    "columnInitial": "A",
                    "codeCurrent": "20A",
                    "rowCurrent": "20",
                    "columnCurrent": "A",
                    "id": "ADULT_01",
                    "name": "testdos test",
                    "userName": "testdos",
                    "userSurname": "test",
                    "price": 5,
                    "selected": true,
                    "isShow": true
                },
                {
                    "code": "20B",
                    "codeInitial": "",
                    "rowInitial": "",
                    "columnInitial": "",
                    "codeCurrent": "20B",
                    "rowCurrent": "20",
                    "columnCurrent": "B",
                    "id": "ADULT_02",
                    "name": "testuno test",
                    "userName": "testuno",
                    "userSurname": "test",
                    "price": 0,
                    "selected": true,
                    "isShow": true
                }
            ],
            "segmentId": "IB880920190901",
            "status": "pending"
        },
        {
            "seats": [
                {
                    "code": "2A",
                    "codeInitial": "2",
                    "rowInitial": "2",
                    "columnInitial": "A",
                    "codeCurrent": "2",
                    "rowCurrent": "2",
                    "columnCurrent": "A",
                    "id": "ADULT_01",
                    "name": "testdos test",
                    "userName": "testdos",
                    "userSurname": "test",
                    "price": 5,
                    "selected": true,
                    "isShow": true
                },
                {
                    "code": "2B",
                    "codeInitial": "",
                    "rowInitial": "",
                    "columnInitial": "",
                    "codeCurrent": "2",
                    "rowCurrent": "2",
                    "columnCurrent": "B",
                    "id": "ADULT_02",
                    "name": "testuno test",
                    "userName": "testuno",
                    "userSurname": "test",
                    "price": 5,
                    "selected": true,
                    "isShow": true
                }
            ],
            "segmentId": "IB880920190902",
            "status": "pending"
        }
    ];

    var fakeHeaderModel = {
        'headerModel': {
            'shoppingBasket': {
                'seats': {
                    'hasSeats': true,
                    'segments': [
                        {
                            'segmentId': 'IB880920190901',
                            'code': '20B',
                            'selected': true,
                            'total': 8,
                            'segmentStatus': 'pending'
                        }
                    ]
                }
            }
        }
    }



    var fakeBreakdownInfoWithAll = {
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
            "type": "SEAT"
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

    var fakeSegmentSeats = {
        segmentId: 'IB880920190901',
        seats: [{ code: '10C', price: 16 },{ code: '10B', price: 0 }],
        updatedSeats: [{ code: '12B', price: 16 }],
    }
    var fakeSegmentSeatsEmpty = {
        segmentId: 'IB880920190901',
        seats: [],
        updatedSeats: [],
    }

    var fakePassengers = [
        {
            passengerId: 'ADULT_01',
            passengerType: "ADULT",
            relatedPassengerId: '',
            externalPersonalInfo: {
                "name": "testuno",
                "firstSurname": "test",
                "lastSurname": ""
            }
        },
        {
            passengerId: 'ADULT_02',
            passengerType: "ADULT",
            relatedPassengerId: '',
            externalPersonalInfo: {
                "name": "testdos",
                "firstSurname": "test",
                "lastSurname": ""
            }
        },
        {
            passengerId: 'ADULT_03',
            passengerType: "ADULT",
            relatedPassengerId: '',
            externalPersonalInfo: {
                "name": "testtres",
                "firstSurname": "test",
                "lastSurname": ""
            }
        },
        {
            passengerId: 'ADULT_04',
            passengerType: "ADULT",
            relatedPassengerId: '',
            externalPersonalInfo: {
                "name": "testcuatro",
                "firstSurname": "test",
                "lastSurname": ""
            }
        },
        {
            passengerId: 'INFANT_01',
            passengerType: "INFANT",
            relatedPassengerId: 'ADULT_01',
            externalPersonalInfo: {
                "name": "bebeuno",
                "firstSurname": "test",
                "lastSurname": ""
            }
        }
    ];

    var fakeSeatsSelectedInfoData = {
        IB880920190901: {
            id: 'IB880920190901',
            passengers: [],
            passengersInfo: [{
                currentSeat: {
                    row: '12',
                    column: 'B',
                    seatType: 'XL',
                    amount: 16
                }
            }],
            segmentId: 'IB880920190901'
        }
    }

    let localStorageGetSpy;

    var fakeCommonsUtilService = {
        'setTitlePage': jasmine.createSpy(),
    };

    beforeEach(function () {
        angular.mock.module('ib-MmB-manage-seat-info-module', 'LocalStorageModule', function ($provide) {
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('MmBAncillariesUtilsService', fakeMmBAncillariesUtilsService);
            $provide.value('CommonsUtilService', fakeCommonsUtilService);
            $provide.value('MMBDatalayerConstants', fakeDatalayerConstants);
        });

        inject(function (_$rootScope_,_$controller_, _$injector_, _localStorageService_, _$timeout_) {
            $rootScope = _$rootScope_;
            $controller = _$controller_;
            $timeout = _$timeout_;
            $injector = Object.keys(_$injector_).reduce(function (clone, key) {
                clone[key] = _$injector_[key];
                return clone
            } , {});
            localStorageService = _localStorageService_;
            controller = $controller('MmbManageSeatInfoController', controllerDependencies);

            fakeMmBModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.callFake(function () {
                return {
                    'result': {
                        'then': function () { }
                    }
                };
            });

            localStorageGetSpy = spyOn(localStorageService, 'get');

            spyOn(localStorageService, 'set');
            localStorageGetSpy.withArgs('breakdownInfo').and.returnValue(fakeBreakdownInfoWithAll);
            localStorageGetSpy.withArgs('passengers').and.returnValue(fakePassengers);
            localStorageGetSpy.withArgs('seatsAvailableSegments').and.returnValue(fakeSeatsAvailableSegments);
            localStorageGetSpy.withArgs('updateSeatFlights').and.returnValue(fakeUpdateSeatFlights);
            localStorageGetSpy.withArgs('headerModel').and.returnValue(fakeHeaderModel);
            localStorageGetSpy.withArgs('seatsSelectedInfoData').and.returnValue(fakeSeatsSelectedInfoData);
            localStorageGetSpy.withArgs('bookingInfoLight').and.returnValue({
                order: {
                    slices: [
                        { segments: [{ segmentId: 'IB042620250817' }] },
                        { segments: [{ segmentId: 'IB040520250621' }] }
                    ]
                }
            });

            controller.ancillariesInfo = {
                isPnrGroup: false
            }
            controller.model = fakeModel;
        });
    });

    describe('init component', function () {
        it('its create correctly', function (done) {
            expect(controller.$onInit).toBeDefined();
            done();
        });
    });

    describe('updateFlights to null', function () {
        beforeEach(inject(function(_$timeout_) {
            localStorageGetSpy.withArgs('updateSeatFlights').and.returnValue(null);
        }));

        it('LocalStorage updateSeatflight empty and ancillaries basket is empty', function (done) {

            controller.$onInit();
            // expect(angular.toJson(controller.model)).toEqual(angular.toJson(fakeOutEmpty));
            done();
        });
    });

    describe('seatsSelectedInfoData to null', function () {
        beforeEach(inject(function(_$timeout_) {
            localStorageGetSpy.withArgs('seatsSelectedInfoData').and.returnValue(null);
        }));

        it('LocalStorage seatsSelectedInfoData empty', function (done) {

            controller.$onInit();
            done();
        });
    });

    describe('eject functions', function () {
        it('isActiveLink function', function (done) {
            controller.isActiveLink(fakeSeatsAvailableSegments[0]);
            done();
        });
        it('emitGoToPaymentPage function', function (done) {
            controller.emitGoToPaymentPage();
            done();
        });
        it('isFirstElement function ', function (done) {
            controller.isFirstElement();
            done();
        });
        it('resetElement function', function (done) {
            controller.resetElement();
            done();
        });
    });


    describe('function openModalConditions', function () {
        it('showGenericModal and updateDatalayerInfo have been called', function (done) {
            controller.openModalConditions(fakeEvent, fakeSegmentSeats);
            expect(fakeMmBModalService.showGenericModal).toHaveBeenCalled();
            expect(fakeDatalayerUtilsService.updateDatalayerInfo).toHaveBeenCalled();
            done();
        });
        it('sendDatalayerEvent have been called', function (done) {
            controller.openModalConditions(fakeEvent, fakeSegmentSeatsEmpty);
            done();
        });
    });
    describe('function openDisruptedSeatsModal', function () {
        it('openDisruptedSeatsModal have been called', function (done) {
            controller.openDisruptedSeatsModal();
            done();
        });
    });

    describe('eject event functions', function () {
        var event = false;
        var seatsDeleted = {seats: []};
        seatsDeleted.seats = [];
        seatsDeleted.seats.push({segments: []});
        seatsDeleted.seats[0].segments.push({id: 'IB880920190901'});

        it('acceptSeats function', function (done) {
            spyOn($rootScope,'$broadcast');
            $rootScope.$broadcast('acceptSeats');
            done();
        });

        xit('deleteSeats function', function (done) {
            spyOn($rootScope,'$broadcast');
            $rootScope.$emit('deleteSeats', event, seatsDeleted);
            done();
        });

        it('deleteAllPendingAncillaries function', function (done) {
            $rootScope.$broadcast('deleteAllPendingAncillaries');
            done();
        });
        it('deleteAllBasket function', function (done) {
            $rootScope.$broadcast('deleteAllBasket');
            done();
        });
        it('updateBasket function', function (done) {
            $rootScope.$broadcast('updateBasket');
            done();
        });
    });

    describe('getAllSegments', () => {

        it('should return all segments from all slices', (done) => {
             localStorageGetSpy.withArgs('bookingInfoLight').and.returnValue({
                order: {
                    slices: [
                        { segments: [{ segmentId: 'IB042620250817' }] },
                        { segments: [{ segmentId: 'IB040520250621' }] }
                    ]
                }
            });
            const result = controller.getAllSegments();

            const expectedSegmentIds = [
                'IB042620250817',
                'IB040520250621'
            ];
            const allSegmentIds = result.map(seg => seg.segmentId);

            expect(allSegmentIds).toEqual(expectedSegmentIds);
            done();
        });
        it('should return empty array when service not found in localStorage', (done) => {
            localStorageGetSpy.withArgs('bookingInfoLight').and.returnValue(null);
            const result = controller.getAllSegments();

            const expectedSegmentIds = [
            ];
            const allSegmentIds = result.map(seg => seg.segmentId);

            expect(allSegmentIds).toEqual(expectedSegmentIds);
            done();
        });
    });


    // xdescribe('new seats in updatedSeats object',()=>{
    //     it('Should insert updated new seats in updatedSeats object', function (done) {
    //         controller.model = fakeModel;
    //         localStorageService.set('updateSeatFlights', seatsUpdateLocalStorage);
    //         localStorageService.set('headerModel', fakeHeaderModel2);
    //         controller.$onInit();
    //         expect(fakeMmBUtilService.getTypeAndDescription).toHaveBeenCalled();
    //         expect(angular.toJson(controller.model)).toEqual(angular.toJson({
    //             "flights": [{"segmentStatus":"","segmentId":"IB880920190901","seats":[],"updatedSeats":[],"activeLink":true,"passengersWithoutSeats":[{"personalInfo":{"name":"test","surname":"test"},"contactInfo":{"email":"test@ab.com","phone":"123456789"}}]},{"segmentStatus":"","segmentId":"IB880920190902","seats":[],"updatedSeats":[],"activeLink":false,"passengersWithoutSeats":[{"personalInfo":{"name":"test","surname":"test"},"contactInfo":{"email":"test@ab.com","phone":"123456789"}}]}]
    //         }));
    //         done();
    //     });
    // });


    // xdescribe('function activate', function () {

    //     xit('Status free', function (done) {
    //         controller.model = fakeModel ;
    //         localStorageService.set('updateSeatFlights', seatsLocalStorageFree);
    //         controller.$onInit();
    //         expect(angular.toJson(controller.model)).toEqual(angular.toJson({
    //             'flights': [{"segmentStatus":"","segmentId":"IB880920190901","seats":[],"updatedSeats":[]},{"segmentStatus":"","segmentId":"IB880920190902","seats":[{"code":"2A","selected":true,"isShow":true}],"updatedSeats":[]}]
    //         }));
    //         done();
    //     });
    // });

    // xdescribe('function resetElement', function () {
    //     it('Should countSelected to 0', function (done) {
    //         controller.resetElement();
    //         expect(controller.countSelected).toEqual(0);
    //         done();
    //     });
    // });

    // xdescribe('function isFirstElement', function () {
    //     it('Should return true if is first element', function (done) {
    //         controller.isFirstElement();
    //         expect(controller.countSelected).toEqual(1);
    //         done();
    //     });
    // });

    // xdescribe('function openModalConditions', function () {
    //     it('showGenericModal have been called', function (done) {
    //         var fakeSeatsAvailableSegments = ['IB880920190901'];
    //         localStorageService.set('seatsAvailableSegments', fakeSeatsAvailableSegments);
    //         spyOn($rootScope, '$emit');
    //         controller.openModalConditions(fakeEvent, fakeSegmentSeats);
    //         expect(fakeMmBModalService.showGenericModal).toHaveBeenCalled();
    //         $rootScope.$digest();
    //         done();
    //     });
    //     it('updateDatalayerWithQuadrigam have been called', function (done) {
    //         controller.openModalConditions(fakeEvent, fakeSegmentSeats);
    //         expect(fakeMmBUtilService.isUserLogged).toHaveBeenCalled();
    //         expect(fakeDatalayerUtilsService.updateDatalayerWithQuadrigam).toHaveBeenCalled();
    //         done();
    //     });
    //     it('sendDatalayerEvent have been called', function (done) {
    //         controller.openModalConditions(fakeEvent, fakeSegmentSeats);
    //         expect(fakeDatalayerUtilsService.sendDatalayerEvent).toHaveBeenCalled();
    //         done();
    //     });
    // });

    // xdescribe('When function isActiveLink is called', function () {
    //     it('Should return true', function (done) {
    //         var segmentId = 'IB880920190901';
    //         var activeLink;
    //         var fakeSeatsAvailableSegments = ['IB880920190901'];
    //         controller.ancillariesInfo = {
    //             isPnrGroup: false
    //         }
    //         localStorageService.set('seatsAvailableSegments', fakeSeatsAvailableSegments);
    //         activeLink = controller.isActiveLink(segmentId);
    //         expect(activeLink).toBe(true);
    //         done();
    //     });

    //     it('Should return false', function (done) {
    //         var segmentId = 'IB880920190901';
    //         var activeLink;
    //         var fakeSeatsAvailableSegments = ['PRUEBAKO'];
    //         localStorageService.set('seatsAvailableSegments', fakeSeatsAvailableSegments);
    //         activeLink = controller.isActiveLink(segmentId);
    //         expect(activeLink).toBe(false);
    //         done();
    //     });
    // });



    // xdescribe('When emit paymnet', function () {
    //     it('emitGoToPaymentPage() is Called', function (done) {
    //         controller.emitGoToPaymentPage();
    //         expect(controller).toBeDefined();
    //         done();
    //     });
    // });

});
