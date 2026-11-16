describe('BookingManagementService test', () => {
    let bookingManagementService, localStorageService, testLocation, testWindow, testCookies, rootScope;


    let fakeBookingManagementTransformer = {
        'transformBookingManagementView': jasmine.createSpy(),
        'generateMinAndMaxSearchDate': jasmine.createSpy()
    };

    let fakeRedirectionService = {
        'externalRedirect': jasmine.createSpy('externalRedirect').and.callFake(angular.noop)
    };

    let fakeMmBAirlinesLogoService = {
        'getAirlinesLogos': jasmine.createSpy()
    };
    let fakeBookingManagementConstants = {
        'SEGMENT_OPTION': {
            'SEAT': 'SEAT',
            'BOARDING': 'BOARDING',
            'CHECKIN': 'CHECKIN',
            'MODIFY': 'MODIFY'
        },
        'SEGMENT_OPTION_STEP': {
            'SEAT': 'DO_SEAT_MAP',
            'BOARDING': 'DO_BOARDING',
            'FLY_NOW_CKI': 'DO_FLY_NOW_CKI',
            'FLY_NOW_MMB': 'DO_FLY_NOW_MMB',
            'FLIGHT_PASSENGER_CKI': 'FLIGHT_PASSENGER_CKI'
        }
    };
    let fakeMmBAppConstants = {
        PAGES_URL: {
            'SEARCH': '/chktrp',
            'BOOKING_MANAGE': '/ibmtdt',
            'CHANGE_FLIGHT': '/tcadvs',
            'FLIGHT_CONFIRMATION': '/tcfrev',
            'BOOKINGS_LIST': '/mytrps',
            'PASSENGERS_INFO': '/moinfo',
            'CHANGE_PASSENGERS_SPECIAL_NEEDS': '/mopmr'
        }, CHECKIN_NEXT_STEP: {
            'SEATS_MAP': 'seatsMap',
            'BOARDING_CARDS': 'boardingCards',
            'FLY_NOW': 'flyNow',
            'FLIGHT_PASSENGER': 'flightPas'
        }, COOKIES: {
            'BOOKING_INFO': 'IBERIACOM_GDR_PA_ACCESS'

        }
    };

    let fakeBookinInfoTransformer = {
        'bookingCode': 'TLHFKV',
        'segments': [
            {
                'id': '1',
                'type': 'CONFIRMED',
                'flown': false,
                'ckiStatus': {
                    'code': 'UNCHECKABLE',
                    'message': 'men'
                },
                'segment': {
                    'company': 'IB',
                }
            }
        ],
        'passengers': [
            {
                'passengerType': 'ADULT',
                'personalInfo': {
                    'name': 'ANTONIO',
                    'surname': 'ALCOCER',
                    'birthDate': null
                },
                'passengerId': '1',
                'contactInfo': {
                    'phone': null,
                    'email': null,
                    'phoneType': 'MOBILE'
                }
            }
        ],
        'optionalInformation': true,
    };

    let fakeBookinInfo = {
        'flowId': 'CHECKID2',
        'order': {
            'orderId': 'ORDER_ID_FIRST',
            'status': 'ISSUED',
            'orderItems': [
                {
                    'type': 'flight',
                    'bookingReferences': [
                        {
                            'provider': 'IB',
                            'reference': 'ABCDE'
                        }
                    ],
                    'sliceIds': [
                        'SHUTTLE'
                    ]
                },
                {
                    'type': 'seat',
                    'passengerId': '1',
                    'row': '15',
                    'column': 'A',
                    'segmentId': 'IB273020170504'
                }
            ],
            'slices': [
                {
                    'sliceId': 'SHUTTLE',
                    'type': 'SHUTTLE',
                    'segments': [
                        {
                            'type': 'CONFIRMED',
                            'ckiStatus': {
                                'code': 'CHECKABLE',
                                'message': null
                            },
                            'cabin': {
                                'rbd': 'Y',
                                'bookingClass': 'ECONOMY',
                                'description': 'Turista',
                                'remainingSeats': 0,
                                'fareFamily': 'TBAESES'
                            },
                            'overnight': false,
                            'id': 'IB273020170504',
                            'departureDateTime': '2017-03-15 13:23',
                            'arrivalDateTime': '2017-03-15 14:23'
                        }
                    ],
                    'overnight': false
                }
            ]
        },
        'passengers': [
            {
                'passengerType': 'ADULT',
                'personalInfo': {
                    'name': 'ADULTO',
                },
                'passengerId': '1',
                'ckiStatus': 'CHECKABLE'

            }
        ]
    };

    let fakeSelectedSegment = {
        'segmentInfo': {
            'id': '1',
            'type': 'OPEN',
            'flown': false,
            'ckiStatus': {
                'code': 'UNCHECKABLE',
                'message': 'El vuelo no está disponible para su facturación en estos momentos. Contacta con Serviberia o tu agencia de viajes para cerrar la fecha del vuelo.'
            },
            'departure': {
                'code': 'MAD',
                'name': 'Madrid',
                'terminal': null,

            },
            'departureDateTime': null,
            'transformedDepartureDate': '2017-1-1',
            'arrival': {
                'code': 'BCN',
                'name': 'Barcelona',
                'terminal': null
            },
            'arrivalCity': {
                'code': 'BCN',
                'description': 'Barcelona',
                'countryCode': 'ES',
                'timeZone': 'Europe/Madrid'
            },
            'arrivalDateTime': null,
            'sliceId': 'SHUTTLE_01',
            'cabinClass': {
                'rbd': 'Y',
                'bookingClass': 'ECONOMY',
                'description': 'Turista'
            },
            'segmentIndex': 0,
            'segmentStatus': {
                'code': 'UNCHECKABLE',
                'message': 'men'
            },
            'seatList': null,
            'segmentOptions': [
                {
                    'id': 'CHECKIN',
                    'description': 'IBCOAC_MMB_WHAT_TO_DO_GO_CHECKIN',
                    'nextStep': 'FLIGHT_PASSENGER_CKI'
                }
            ],
            'savedSuccess': false
        },
        'selectedOption': {
            'id': 'CHECKIN',
            'description': 'IBCOAC_MMB_WHAT_TO_DO_GO_CHECKIN',
            'nextStep': 'FLIGHT_PASSENGER_CKI'
        }
    };

    let fakePassengers = [
        {
            'passengerType': 'ADULT',
            'personalInfo': {
                'name': 'ALESSIO',
                'surname': 'FERRI',
                'birthDate': null
            },
            'passengerId': '1'
        }
    ];


    let fakeLinksFilter = function (id) {
        return id;
    };


    beforeEach(() => {
        angular.mock.module('LocalStorageModule', 'ib-MmB-services-module', 'ib-MmB-booking-management-module', 'ngCookies', 'ib-MmB-filters-module', ($provide) => {
            $provide.value('BookingManagementTransformer', fakeBookingManagementTransformer);
            $provide.value('MmBAirlinesLogoService', fakeMmBAirlinesLogoService);
            $provide.value('BookingManagementConstants', fakeBookingManagementConstants);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('LinksFilterFilter', fakeLinksFilter);
            $provide.value('RedirectionService', fakeRedirectionService);
        });

        inject((_BookingManagementService_, _localStorageService_, $cookies, $rootScope, $location, $window) => {
            bookingManagementService = _BookingManagementService_;
            localStorageService = _localStorageService_;
            testCookies = $cookies;
            rootScope = $rootScope;
            testLocation = $location;
            testWindow = $window;
        });
    });


    describe('when getBookingInfo() is called', () => {
        let errorObject = {
            'errorCode': 'BOOKING_INFO_NOT_FOUND',
            'message': 'REST_SERVICE_ERROR_GENERAL',
            'needsTranslate': true,
            'internalErrorCode': 'BOOKING_INFO_NOT_FOUND'
        };

        it('and no bookingData is provided, promise should be resolved with error', (done) => {
            localStorageService.set('bookingInfo', null);
            bookingManagementService.getBookingInfo().then(angular.noop, (error) => {
                expect(error.errorCode).toEqual(errorObject.errorCode);
                expect(error.needsTranslate).toBe(true);
                done()
            });
            rootScope.$digest();
        });

        describe('and AirLogos service calls', () => {

            it('and getAirlinesLogos has called and resolve promise,should returned data', (done) => {
                inject(($q) => {
                    fakeMmBAirlinesLogoService.getAirlinesLogos = jasmine.createSpy('getAirlinesLogos').and.callFake(() => {
                        let deferred = $q.defer();
                        deferred.resolve('returnData');
                        return deferred.promise;
                    });

                    fakeBookingManagementTransformer.transformBookingManagementView = jasmine.createSpy('transformBookingManagementView').and.callFake(() => {
                        return fakeBookinInfoTransformer;
                    });

                });
                localStorageService.set('bookingInfo', fakeBookinInfo);
                bookingManagementService.getBookingInfo().then((returnedInfo) => {
                    expect(returnedInfo.bookingCode).toEqual(fakeBookinInfoTransformer.bookingCode);
                    localStorageService.clearAll();
                    done();
                });
                rootScope.$digest();
            });

            it('and getAirlinesLogosFinish has called  but reject promise', (done) => {
                inject(($q) => {
                    fakeMmBAirlinesLogoService.getAirlinesLogos = jasmine.createSpy('getAirlinesLogos').and.callFake(() => {
                        let deferred = $q.defer();
                        deferred.reject('returnData');
                        return deferred.promise;
                    });

                    fakeBookingManagementTransformer.transformBookingManagementView = jasmine.createSpy('transformBookingManagementView').and.callFake(() => {
                        return fakeBookinInfoTransformer;
                    });

                });
                localStorageService.set('bookingInfo', fakeBookinInfo);
                bookingManagementService.getBookingInfo().then((returnedInfo) => {
                    expect(returnedInfo.bookingCode).toEqual(fakeBookinInfoTransformer.bookingCode);
                    localStorageService.clearAll();
                    done();
                });
                rootScope.$digest();
            });
            it('and getAirlinesLogosFinish has called  and have checkinSegmentId,should be return data with selectedSegmentInfo ', (done) => {
                inject(($q) => {
                    fakeMmBAirlinesLogoService.getAirlinesLogos = jasmine.createSpy('getAirlinesLogos').and.callFake(() => {
                        let deferred = $q.defer();
                        deferred.reject('returnData');
                        return deferred.promise;
                    });

                    fakeBookingManagementTransformer.transformBookingManagementView = jasmine.createSpy('transformBookingManagementView').and.callFake(() => {
                        return fakeBookinInfoTransformer;
                    });

                });

                localStorageService.set('checkinSegmentId', '1');
                localStorageService.set('bookingInfo', fakeBookinInfo);
                bookingManagementService.getBookingInfo().then(function (returnedInfo) {
                    expect(returnedInfo.bookingCode).toEqual(fakeBookinInfoTransformer.bookingCode);
                    localStorageService.clearAll();
                    done();
                });
                rootScope.$digest();
            });



        });
    });

    describe('When optionSelected() is called', () => {
        let copyFakeSelectedSegment, checkinCookie;
        it('without optionSelected should do nothing', (done) => {
            copyFakeSelectedSegment = angular.copy(fakeSelectedSegment);
            copyFakeSelectedSegment.selectedOption = {};
            localStorageService.set('flowId', 1);
            bookingManagementService.optionSelected(copyFakeSelectedSegment, fakePassengers);
            expect(localStorageService.get('selectedPassengerId')).toEqual([fakePassengers[0].passengerId]);
            copyFakeSelectedSegment = {};
            localStorageService.clearAll();
            done();
        });

        it('and nextStep is FLY_NOW_MMB, should modify location to page CHANGE_FLIGHT', (done) => {
            copyFakeSelectedSegment = angular.copy(fakeSelectedSegment);
            copyFakeSelectedSegment.selectedOption.nextStep = fakeBookingManagementConstants.SEGMENT_OPTION_STEP.FLY_NOW_MMB;
            localStorageService.set('flowId', 1);
            bookingManagementService.optionSelected(copyFakeSelectedSegment, fakePassengers);
            expect(localStorageService.get('selectedPassengerId')).toEqual([fakePassengers[0].passengerId]);
            expect(testLocation.path()).toEqual(fakeMmBAppConstants.PAGES_URL.CHANGE_FLIGHT);
            localStorageService.clearAll();
            done();
        });
        it('and nextStep is SEAT, should modify step to page seatsMap', (done) => {
            copyFakeSelectedSegment = angular.copy(fakeSelectedSegment);
            copyFakeSelectedSegment.selectedOption.nextStep = fakeBookingManagementConstants.SEGMENT_OPTION_STEP.SEAT;
            localStorageService.set('flowId', 1);
            localStorageService.set('checkinSurname', 'surn');
            localStorageService.set('PNR', '1231');
            bookingManagementService.optionSelected(copyFakeSelectedSegment, fakePassengers);
            checkinCookie = {
                'nextStep': fakeMmBAppConstants.CHECKIN_NEXT_STEP.SEATS_MAP,
                'checkinId': localStorageService.get('flowId'),
                'selectedSegment': copyFakeSelectedSegment,
                'selectedPassenger': localStorageService.get('selectedPassengerId')
            };
            expect(checkinCookie.nextStep).toEqual(fakeMmBAppConstants.CHECKIN_NEXT_STEP.SEATS_MAP);
            expect(fakeRedirectionService.externalRedirect).toHaveBeenCalled();
            localStorageService.clearAll();
            done();

        });
        it('and nextStep is BOARDING, should modify step to page boardingCards', (done) => {
            copyFakeSelectedSegment = angular.copy(fakeSelectedSegment);
            copyFakeSelectedSegment.selectedOption.nextStep = fakeBookingManagementConstants.SEGMENT_OPTION_STEP.BOARDING;
            localStorageService.set('flowId', 1);
            localStorageService.set('checkinSurname', 'surn');
            localStorageService.set('PNR', '1231');
            bookingManagementService.optionSelected(copyFakeSelectedSegment, fakePassengers);
            checkinCookie = {
                'nextStep': fakeMmBAppConstants.CHECKIN_NEXT_STEP.BOARDING_CARDS,
                'checkinId': localStorageService.get('flowId'),
                'selectedSegment': copyFakeSelectedSegment,
                'selectedPassenger': localStorageService.get('selectedPassengerId')
            };
            expect(checkinCookie.nextStep).toEqual(fakeMmBAppConstants.CHECKIN_NEXT_STEP.BOARDING_CARDS);
            expect(fakeRedirectionService.externalRedirect).toHaveBeenCalled();
            localStorageService.clearAll();
            done();

        });
        it('and nextStep is FLIGHT_PASSENGER_CKI, should modify step to page flightPas', (done) => {
            copyFakeSelectedSegment = angular.copy(fakeSelectedSegment);
            copyFakeSelectedSegment.selectedOption.nextStep = fakeBookingManagementConstants.SEGMENT_OPTION_STEP.FLIGHT_PASSENGER_CKI;
            localStorageService.set('flowId', 1);
            localStorageService.set('checkinSurname', 'surn');
            localStorageService.set('PNR', '1231');
            bookingManagementService.optionSelected(copyFakeSelectedSegment, fakePassengers);
            checkinCookie = {
                'nextStep': fakeMmBAppConstants.CHECKIN_NEXT_STEP.FLIGHT_PASSENGER,
                'checkinId': localStorageService.get('flowId'),
                'selectedSegment': copyFakeSelectedSegment,
                'selectedPassenger': localStorageService.get('selectedPassengerId')
            };
            expect(checkinCookie.nextStep).toEqual(fakeMmBAppConstants.CHECKIN_NEXT_STEP.FLIGHT_PASSENGER);
            expect(fakeRedirectionService.externalRedirect).toHaveBeenCalled();
            localStorageService.clearAll();
            done();

        });
        it('and nextStep is FLY_NOW_CKI, should modify step to page flyNow', (done) => {
            copyFakeSelectedSegment = angular.copy(fakeSelectedSegment);
            copyFakeSelectedSegment.selectedOption.nextStep = fakeBookingManagementConstants.SEGMENT_OPTION_STEP.FLY_NOW_CKI;
            localStorageService.set('flowId', 1);
            localStorageService.set('checkinSurname', 'surn');
            localStorageService.set('PNR', '1231');
            bookingManagementService.optionSelected(copyFakeSelectedSegment, fakePassengers);
            checkinCookie = {
                'nextStep': fakeMmBAppConstants.CHECKIN_NEXT_STEP.FLY_NOW,
                'checkinId': localStorageService.get('flowId'),
                'selectedSegment': copyFakeSelectedSegment,
                'selectedPassenger': localStorageService.get('selectedPassengerId')
            };
            expect(checkinCookie.nextStep).toEqual(fakeMmBAppConstants.CHECKIN_NEXT_STEP.FLY_NOW);
            expect(fakeRedirectionService.externalRedirect).toHaveBeenCalled();
            localStorageService.clearAll();
            done();
        });
    });

});


