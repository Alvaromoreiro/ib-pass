describe('ChangeFlightTransformer test', function () {
    var localStorageService, changeFlightTransformer, filter;

    var fakeChangeFlightConstants = {
        FILTERS: {
            'AVAILABILITY_FILTER_ALL_TIMEZONES': { 'id': 'AVAILABILITY_FILTER_ALL_TIMEZONES', 'title': 'AVAILABILITY_FILTER_ALL_TIMEZONES_TITLE' },
            'AVAILABILITY_FILTER_MORNING_TIMEZONE': { 'id': 'AVAILABILITY_FILTER_MORNING_TIMEZONE', 'title': 'AVAILABILITY_FILTER_MORNING_TIMEZONE_TITLE' },
            'AVAILABILITY_FILTER_AFTERNOON_TIMEZONE': { 'id': 'AVAILABILITY_FILTER_AFTERNOON_TIMEZONE', 'title': 'AVAILABILITY_FILTER_AFTERNOON_TIMEZONE_TITLE' }
        }
    };

    var fakeMmBAppConstants = {
        market: 'ES',
        SEGMENT_TYPES: {
            'OPEN': 'OPEN',
            'CONFIRMED': 'CONFIRMED',
        }
    };

    var fakeDateFormatFilter = function (inputDate) {
        return inputDate;
    }

    var fakeDate = function (inputDate) {
        return inputDate;
    }

    var fakeMmBUtilService = {
        'getCompanyLogo': jasmine.createSpy('getCompanyLogo').and.callFake(function () {
            return 'logo';
        }),
        'getFormatedDate': jasmine.createSpy('getFormatedDate').and.callFake(function () {
            return { 'formatedDate': '12/12/2012', 'dateFormatByLanguage': {} };
        })
    };

    var fakeCommercialInfo = {
        'maxSearchTime': 330,
        'minSearchTime': 0
    };

    var fakeSegmentSelected = {

        'id': '1',
        'type': 'CONFIRMED',
        'flown': false,
        'ckiStatus': {},
        'departure': {},
        'departureCity': {},
        'departureDateTime': '2017-06-13 06:30',
        'transformedDepartureDate': {},
        'arrival': {},
        'arrivalCity': {
            'code': 'BCN',
            'description': 'Barcelona',
            'countryCode': 'ES',
            'timeZone': 'Europe/Madrid'
        },
        'arrivalDateTime': '2017-06-13 07:40',
        'sliceId': 'SHUTTLE_01',
        'transformedArrivalDate': {
            'dateTime': '07:40',
            'weekDay': 'WEEKDAY_TUESDAY',
            'day': 13,
            'monthNumber': 6,
            'month': 'MONTH_JUNE',
            'year': 2017,
            'originalDate': '2017-06-13T05:40:00.000Z'
        },
        'segment': {
            'company': 'IB',
            'companyName': 'IBERIA AEROLINEAS',
            'number': '2712',
            'companyURL': '../../content-mmb/iconos/aerolineas/logo_pos_IB.svg',
            'companyDisabledURL': '../../content-mmb/iconos/aerolineas/logo_desact_IB.svg'
        },
        'cabinClass': {
            'rbd': 'Y',
            'bookingClass': 'ECONOMY',
            'description': 'Turista',
            'remainingSeats': 0,
            'fareFamily': 'TFLESEU'
        },
        'segmentIndex': 0,
        'segmentStatus': {
            'code': 'UNCHECKABLE',
            'message': 'El vuelo no está disponible para su facturación en estos momentos. Inténtalo más tarde o acude al aeropuerto para obtener tu tarjeta de embarque.'
        },
        'seatList': null,
        'segmentOptions': [
            {
                'id': 'MODIFY',
                'description': 'IBCOAC_MMB_WHAT_TO_DO_MODIFY',
                'nextStep': 'DO_FLY_NOW_MMB'
            }
        ],
        'savedSuccess': false

    };

    var fakeSameDaySegmentSelected = {

        'id': '1',
        'type': 'CONFIRMED',
        'flown': false,
        'ckiStatus': {},
        'departure': {},
        'departureCity': {},
        'departureDateTime': new Date(),
        'transformedDepartureDate': {},
        'arrival': {},
        'arrivalCity': {
            'code': 'BCN',
            'description': 'Barcelona',
            'countryCode': 'ES',
            'timeZone': 'Europe/Madrid'
        },
        'arrivalDateTime': '2017-06-13 07:40',
        'sliceId': 'SHUTTLE_01',
        'transformedArrivalDate': {
            'dateTime': '07:40',
            'weekDay': 'WEEKDAY_TUESDAY',
            'day': 13,
            'monthNumber': 6,
            'month': 'MONTH_JUNE',
            'year': 2017,
            'originalDate': new Date()
        },
        'segment': {
            'company': 'IB',
            'companyName': 'IBERIA AEROLINEAS',
            'number': '2712',
            'companyURL': '../../content-mmb/iconos/aerolineas/logo_pos_IB.svg',
            'companyDisabledURL': '../../content-mmb/iconos/aerolineas/logo_desact_IB.svg'
        },
        'cabinClass': {
            'rbd': 'Y',
            'bookingClass': 'ECONOMY',
            'description': 'Turista',
            'remainingSeats': 0,
            'fareFamily': 'TFLESEU'
        },
        'segmentIndex': 0,
        'segmentStatus': {
            'code': 'UNCHECKABLE',
            'message': 'El vuelo no está disponible para su facturación en estos momentos. Inténtalo más tarde o acude al aeropuerto para obtener tu tarjeta de embarque.'
        },
        'seatList': null,
        'segmentOptions': [
            {
                'id': 'MODIFY',
                'description': 'IBCOAC_MMB_WHAT_TO_DO_MODIFY',
                'nextStep': 'DO_FLY_NOW_MMB'
            }
        ],
        'savedSuccess': false

    };

    var fakePassengers = [{
        'passengerType': 'ADULT', 'personalInfo': { 'name': 'HIULAMMRS', 'surname': 'CHENG', 'birthDate': null },
        'passengerId': '1',
        'contactInfo': { 'phone': null, 'email': null, 'phoneType': 'MOBILE' },
        'ckiStatus': 'CHECKABLE', 'emergencyContactInfo': { 'name': null, 'phone': null },
        'optionalInformation': { 'contactData': true, 'emergency': true, 'ffInfo': true, 'specialNeed': true }
    }];

    var fakeSearchDate = {
        'minSearchDate': null, 'maxSearchDate': null
    };

    var fakeCurrentModel = {
        'availabilityInfo': {},
        'hasAvailability': false,
        'searchEngineModel': {
            'daySelected': new Date(),
            'maxDate': new Date('2017/06/13'),
            'minDate': new Date('2017/06/13'),
            'selectedDate': new Date('2017/06/13'),
            'selectedTimeZone': fakeChangeFlightConstants.FILTERS.AVAILABILITY_FILTER_ALL_TIMEZONES,
            'timeZoneSelected': fakeChangeFlightConstants.FILTERS.AVAILABILITY_FILTER_ALL_TIMEZONES
        },
        'selectedSegmentInfo': {
            'departure': {
                'code': 'MAD',
                'name': 'MADRID',
                'terminal': null
            }, 'arrival': {
                'code': 'BAC',
                'name': 'BARCELONA',
                'terminal': null
            },
            'cabinClass': {
                'bookingClass': 'ECONOMY',
                'description': 'Turista',
                'fareFamily': 'TFLESEU',
                'rbd': 'y',
                'remainingSeats': 0
            }
        }
    };

    var fakeAvailabilityData = {
        'offers': [
            {
                'offerId': 'ad65d0c323874fa09b26b584e4014197',
                'price': null,
                'offerItems': [
                    {
                        'offerItemId': 'ad65d0c323874fa09b26b584e4014197_01',
                        'price': null,
                        'passengerIds': [
                            'ADULT_01'
                        ]
                    }
                ],
                'originDestinations': [
                    {
                        'totalPrice': null,
                        'adultPrice': null,
                        'perPassengerPrice': null,
                        'originDestinationId': 'OD1',
                        'applicableSlices': [
                            {
                                'sliceId': '5',
                                'remainingSeats': 9,
                                'segments': [
                                    {
                                        'segmentId': 'IB180020170616',
                                        'fareFamily': 'TFLESEU',
                                        'bookingCode': null,
                                        'bookingClass': null,
                                        'rbd': 'Y',
                                        'remainingSeats': 9,
                                        'seatDisplays': null
                                    }
                                ]
                            }
                        ]
                    }
                ],
                'timeLimits': '2017-06-13T19:28:58.904'
            },
            {
                'offerId': 'e1f804dd58a74c4290ee0a8d532e33c0',
                'price': null,
                'offerItems': [
                    {
                        'offerItemId': 'e1f804dd58a74c4290ee0a8d532e33c0_01',
                        'price': null,
                        'passengerIds': [
                            'ADULT_01'
                        ]
                    }
                ],
                'originDestinations': [
                    {
                        'totalPrice': null,
                        'adultPrice': null,
                        'perPassengerPrice': null,
                        'originDestinationId': 'OD1',
                        'applicableSlices': [
                            {
                                'sliceId': '2',
                                'remainingSeats': 4,
                                'segments': [
                                    {
                                        'segmentId': 'IB508820170616',
                                        'fareFamily': 'TFLESEU',
                                        'bookingCode': null,
                                        'bookingClass': null,
                                        'rbd': 'Y',
                                        'remainingSeats': 4,
                                        'seatDisplays': null
                                    }
                                ]
                            }
                        ]
                    }
                ],
                'timeLimits': '2017-06-13T19:28:58.904'
            },
            {
                'offerId': 'c6e67efb15a147ca950e91ccb2524487',
                'price': null,
                'offerItems': [
                    {
                        'offerItemId': 'c6e67efb15a147ca950e91ccb2524487_01',
                        'price': null,
                        'passengerIds': [
                            'ADULT_01'
                        ]
                    }
                ],
                'originDestinations': [
                    {
                        'totalPrice': null,
                        'adultPrice': null,
                        'perPassengerPrice': null,
                        'originDestinationId': 'OD1',
                        'applicableSlices': [
                            {
                                'sliceId': '3',
                                'remainingSeats': 9,
                                'segments': [
                                    {
                                        'segmentId': 'IB083020170616',
                                        'fareFamily': 'TFLESEU',
                                        'bookingCode': null,
                                        'bookingClass': null,
                                        'rbd': 'Y',
                                        'remainingSeats': 9,
                                        'seatDisplays': null
                                    }
                                ]
                            }
                        ]
                    }
                ],
                'timeLimits': '2017-06-13T19:28:58.904'
            },
            {
                'offerId': '90e1a0f037f5488097a442aaa904e313',
                'price': null,
                'offerItems': [
                    {
                        'offerItemId': '90e1a0f037f5488097a442aaa904e313_01',
                        'price': null,
                        'passengerIds': [
                            'ADULT_01'
                        ]
                    }
                ],
                'originDestinations': [
                    {
                        'totalPrice': null,
                        'adultPrice': null,
                        'perPassengerPrice': null,
                        'originDestinationId': 'OD1',
                        'applicableSlices': [
                            {
                                'sliceId': '1',
                                'remainingSeats': 9,
                                'segments': [
                                    {
                                        'segmentId': 'IB063020170616',
                                        'fareFamily': 'TFLESEU',
                                        'bookingCode': null,
                                        'bookingClass': null,
                                        'rbd': 'Y',
                                        'remainingSeats': 9,
                                        'seatDisplays': null
                                    }
                                ]
                            }
                        ]
                    }
                ],
                'timeLimits': '2017-06-13T19:28:58.904'
            }
        ],
        'originDestinations': [
            {
                'originDestinationId': 'OD1',
                'origin': 'MAD',
                'destination': 'BCN',
                'originCity': {
                    'code': 'MAD',
                    'description': 'Madrid',
                    'countryCode': 'ES'
                },
                'destinationCity': {
                    'code': 'BCN',
                    'description': 'Barcelona',
                    'countryCode': 'ES'
                },
                'slices': [
                    {
                        'sliceId': '1',
                        'arrivalDateTime': '2017-06-16 07:40',
                        'departureDateTime': '2017-06-16 06:30',
                        'segments': [
                            {
                                'segmentId': 'IB063020170616',
                                'departureDateTime': '2017-06-16 06:30',
                                'arrivalDateTime': '2017-06-16 07:40',
                                'departure': {
                                    'code': 'MAD',
                                    'name': 'Madrid Adolfo Suarez-Barajas',
                                    'terminal': '4'
                                },
                                'arrival': {
                                    'code': 'BCN',
                                    'name': 'Barcelona',
                                    'terminal': '1'
                                },
                                'flight': {
                                    'marketingCarrier': {
                                        'code': 'IB',
                                        'name': 'Iberia Lineas Aereas de Espana S.A.'
                                    },
                                    'operationalCarrier': {
                                        'code': 'IB',
                                        'name': 'Iberia Lineas Aereas de Espana S.A.'
                                    },
                                    'marketingFlightNumber': '630',
                                    'operationalFlightNumber': '630',
                                    'operationalDisclosure': 'IB',
                                    'aircraft': {
                                        'code': '321',
                                        'description': 'Airbus A321'
                                    }
                                },
                                'overnight': false,
                                'waitingTime': 0,
                                'duration': 70
                            }
                        ],
                        'duration': 70,
                        'cashAvios': null,
                        'overnight': false,
                        'stopsNumber': 0
                    }
                ]
            }
        ],
        'passengers': [
            {
                'passengerId': 'ADULT_01',
                'passengerType': 'ADULT'
            }
        ],
        'responseId': 'Qm9va2luZ0BHVy0xNDk3MzcxOTM2MDI1LVJQck9l',
        'fareFamilyConditions': [
            {
                'cabinType': 'E',
                'cabinDescription': 'Turista',
                'commercialCode': 'TFLESEU',
                'commercialName': 'Flexible',
                'priority': 500,
                'conditions': [
                    {
                        'code': 'EQMANO',
                        'name': 'Equipaje de mano',
                        'text': '1 bulto',
                        'extendedInfo': {
                            'title': '1 bulto en cabina',
                            'message': '1 bulto/ 56x45x25cm.',
                            'conditionStatus': true
                        }
                    }
                ]
            }
        ],
        'contextMetadata': {
            'language': 'es',
            'country': 'ES',
            'currencies': [

            ]
        }
    };

    beforeEach(function () {
        angular.mock.module('ib-MmB-filters-module', 'LocalStorageModule', 'ib-MmB-services-module', 'ib-Mmb-change-flight-module', function ($provide) {
            $provide.value('ChangeFlightConstants', fakeChangeFlightConstants);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('DateFormatFilter', fakeDateFormatFilter);
            $provide.value('Date', fakeDate);
            $provide.value('MmBUtilService', fakeMmBUtilService);
        });

        inject(function (_ChangeFlightTransformer_, _localStorageService_, _DateFormatFilter_) {
            changeFlightTransformer = _ChangeFlightTransformer_;
            localStorageService = _localStorageService_;
            filter = _DateFormatFilter_;

        });
        jasmine.clock().mockDate(new Date(2017, 6, 13, 13, 0));
    });

    describe('when generateInitialModel is called', function () {
        it('and departureDate is different of day selectetd, should return data with timezone AVAILABILITY_FILTER_ALL_TIMEZONES ', function (done) {
            var returnedModel;
            var DEFAULT_MAX_SEARCH_TIME = 330;
            var maxDate, minDate;
            var nowDay = new Date();

            localStorageService.set('selectedSegment', fakeSegmentSelected);
            localStorageService.set('searchDate', fakeSearchDate);
            localStorageService.set('commercialInfo', fakeCommercialInfo);
            let commercialInfo = localStorageService.get('commercialInfo') || {};
            maxDate = new Date().getTime() + (DEFAULT_MAX_SEARCH_TIME * 24 * 60 * 60 * 1000);
            minDate = new Date().getTime() + (commercialInfo.minSearchTime * 60 * 60 * 1000);

            returnedModel = changeFlightTransformer.generateInitialModel();
            expect(returnedModel.selectedSegmentInfo.id).toEqual(fakeSegmentSelected.id);
            expect(returnedModel.timeZonesList[0].id).toEqual(fakeChangeFlightConstants.FILTERS.AVAILABILITY_FILTER_ALL_TIMEZONES.id);
            expect(returnedModel.searchEngineModel.maxDate.getHours()).toEqual(new Date(maxDate).getHours());
            expect(returnedModel.searchEngineModel.minDate.getHours()).toEqual(new Date(minDate).getHours());
            localStorageService.clearAll();
            done();
        })

        it('and departureDate is different of day selectetd, should return data with timezone AVAILABILITY_FILTER_AFTERNOON_TIMEZONE ', function (done) {
            var returnedModel;
            var DEFAULT_MAX_SEARCH_TIME = 330;
            var maxDate, minDate;
            var nowDay = new Date();
            localStorageService.set('selectedSegment', fakeSegmentSelected);
            localStorageService.set('searchDate', fakeSearchDate);
            localStorageService.set('commercialInfo', fakeCommercialInfo);
            maxDate = new Date().getTime() + (DEFAULT_MAX_SEARCH_TIME * 24 * 60 * 60 * 1000);
            minDate = new Date().getTime() + (fakeCommercialInfo.minSearchTime * 60 * 60 * 1000);

            returnedModel = changeFlightTransformer.generateInitialModel();
            expect(returnedModel.selectedSegmentInfo.id).toEqual(fakeSegmentSelected.id);
            if (fakeSameDaySegmentSelected.departureDateTime.getTime() === nowDay.getTime() && nowDay.getHours() >= 12) {
                expect(returnedModel.timeZonesList[0].id).toEqual(fakeChangeFlightConstants.FILTERS.AVAILABILITY_FILTER_AFTERNOON_TIMEZONE.id);
            }
            expect(returnedModel.searchEngineModel.maxDate.getHours()).toEqual(new Date(maxDate).getHours());
            expect(returnedModel.searchEngineModel.minDate.getHours()).toEqual(new Date(minDate).getHours());
            localStorageService.clearAll();
            done();
        })
    });

    describe('when getTimeZoneList is called', function () {
        let daySelected, returnedModel, nowDay;
        it('with daySelected and nowDay are same and return timeList, the time is greater than 12', function (done) {
            localStorageService.set('selectedSegment', fakeSegmentSelected);
            daySelected = new Date();
            nowDay = new Date();
            returnedModel = changeFlightTransformer.getTimeZoneList(daySelected, nowDay);
            expect(returnedModel[0].id).toEqual(fakeChangeFlightConstants.FILTERS.AVAILABILITY_FILTER_AFTERNOON_TIMEZONE.id);
            localStorageService.clearAll();
            done();
        });

        it('with daySelected and nowDay are same and return timeList, the time is less than 12', function (done) {
            localStorageService.set('selectedSegment', fakeSegmentSelected);
            daySelected = new Date('2017/06/13');
            nowDay = new Date();
            returnedModel = changeFlightTransformer.getTimeZoneList(daySelected, nowDay);
            expect(returnedModel[0].id).toEqual(fakeChangeFlightConstants.FILTERS.AVAILABILITY_FILTER_ALL_TIMEZONES.id);
            localStorageService.clearAll();
            done();
        });

        it('with daySelected and nowDay are diferent and return timeList', function (done) {
            localStorageService.set('selectedSegment', fakeSegmentSelected);
            daySelected = new Date('2017/06/14');
            nowDay = new Date('2017/06/13');
            returnedModel = changeFlightTransformer.getTimeZoneList(daySelected, nowDay);
            expect(returnedModel[0].id).toEqual(fakeChangeFlightConstants.FILTERS.AVAILABILITY_FILTER_ALL_TIMEZONES.id);
            localStorageService.clearAll();
            done();
        });

        it('with daySelected and nowDay are empty and return timeList', function (done) {
            localStorageService.set('selectedSegment', fakeSegmentSelected);
            daySelected = new Date('2017/06/14');
            returnedModel = changeFlightTransformer.getTimeZoneList(daySelected, null);
            expect(returnedModel[0].id).toEqual(fakeChangeFlightConstants.FILTERS.AVAILABILITY_FILTER_ALL_TIMEZONES.id);
            localStorageService.clearAll();
            done();
        });

        it('with generateAvailabilityRequest is called', function (done) {
            localStorageService.set('passengers', fakePassengers);
            returnedModel = changeFlightTransformer.generateAvailabilityRequest(fakeCurrentModel);
            expect(returnedModel.passengers[0].passengerType).toEqual('ADULT');
            expect(returnedModel.slices[0].origin).toEqual('MAD');
            expect(returnedModel.marketCode).toEqual('ES');
            expect(returnedModel.slices[0].date).toEqual('2017-06-13');
            localStorageService.clearAll();
            done();
        });

        it('with transformAvailabilityView is called', function (done) {
            localStorageService.set('selectedSegment', fakeSegmentSelected);
            returnedModel = changeFlightTransformer.transformAvailabilityView(fakeAvailabilityData);
            expect(localStorageService.get('responseId')).toEqual('Qm9va2luZ0BHVy0xNDk3MzcxOTM2MDI1LVJQck9l');
            expect(localStorageService.get('fareFamilyConditionsData')).toEqual(fakeAvailabilityData.fareFamilyConditions);
            expect(returnedModel.slices[0].outboundDate).toEqual('2017-06-16 06:30');
            expect(returnedModel.slices[0].offerItemIds).toEqual(['90e1a0f037f5488097a442aaa904e313_01']);
            expect(returnedModel.slices[0].sliceId).toEqual('1');
            localStorageService.clearAll();
            done();
        });
    });


});
