describe('UpdateFlightsPassengerInfoService test', function () {

    var updateFlightsPassengerInfoService, rootScope, localStorageService, filter, timeout, window, cookies, location;

    var mockLogged = { 'access_token': 'access_token', 'refresh_token': 'refresh_token' };

    var mockPassengersInfo = [{ 'id': 1, 'type': 'ADULT', 'pasStatus': { 'available': true, 'isChecked': true, 'reason': null }, 'requiresApis': false, 'fieldStatus': { 'contactData': { 'available': true, 'show': true, 'mandatory': false }, 'emergencyData': { 'available': true, 'show': true, 'mandatory': false }, 'gender': { 'show': false, 'mandatory': false }, 'frequentFlyer': { 'show': true, 'mandatory': false } }, 'requiredInformation': [], 'isSelected': true, 'name': 'BORISAUGUSTO', 'surname': 'ABADORDONEZ', 'gender': 'MALE', 'infant': null, 'contactData': { 'denyNewsLetter': true, 'phone': { 'countryCode': '34', 'number': '12131231231' }, 'emergency': { 'phone': { 'countryCode': '34', 'number': '2141241241424' }, 'name': 'ASFASFASFASF' }, 'email': 'AS@AS.ES', 'available': true }, 'initialData': { 'contact': { 'gender': 'MALE', 'phone': { 'countryCode': '34', 'number': '12131231231' }, 'email': 'AS@AS.ES', 'frequentFlyer': { 'info': { 'iataCompanyCode': 'IB', 'number': '74419045', 'topTier': null, 'level': '8' }, 'enabled': false } }, 'emergency': { 'name': 'ASFASFASFASF', 'phone': { 'countryCode': '34', 'number': '2141241241424' } } }, 'frequentFlyer': { 'info': { 'iataCompanyCode': 'IB', 'number': '74419045', 'topTier': null, 'level': '8' }, 'enabled': false }, 'language': 'es', '$$hashKey': 'object:9583' }];



    var mockSegmentsInfo = [{ 'generalType': 'REGULAR', 'isSelected': true, 'segmentStatus': 'CHECKED', 'segmentStatusReason': '', 'id': 2, 'departure': { 'cityDescription': '', 'cityCode': '', 'airportDescription': 'Quito', 'airportCode': 'UIO', 'terminal': '', 'originalDate': '2018-05-29 17:55', 'date': { 'weekDay': 'WEEKDAY_TUESDAY', 'monthDay': 29, 'monthNumber': 5, 'month': 'MONTH_MAY', 'year': 2018 }, 'hour': '17:55' }, 'arrival': { 'cityDescription': '', 'cityCode': '', 'airportDescription': 'Madrid', 'airportCode': 'MAD', 'terminal': null, 'originalDate': '2018-05-30 10:04', 'date': { 'weekDay': 'WEEKDAY_WEDNESDAY', 'monthDay': 30, 'monthNumber': 5, 'month': 'MONTH_MAY', 'year': 2018 }, 'hour': '10:04' }, 'cabinClass': { 'code': 'A', 'type': 'ECONOMY', 'description': 'Turista', 'fareFamily': null, 'mainClass': 'Y' }, 'type': 'FLIGHT', 'flown': false, 'airlineName': 'Iberia', 'airlineLogo': '/iberia-web-content/iconos/aerolineas/logo_pos_IB.svg', 'flightCode': 'IB', 'flightNumber': 'IB6454', 'operatedBy': 'Iberia', '$$hashKey': 'object:9577' }];

    var mockActiveFields = {
        'additionalInfoUseForAllCheck': {
            'showId': '',
            'status': false,
            'show': false
        },
        'emergencyDataUseForAllCheck': {
            'showId': '',
            'status': false,
            'show': false
        },
        'showContactData': true
    };

    var mockGeneralPassenger = {
        'regularPassengersIds': [
            1
        ],
        'passengersApisIds': [

        ],
        'passengersSelected': [
            1
        ],
        'newsLetterInfo': {
            'needsUpdate': true,
            'info': [

            ]
        },
        'additionalInfo': {
            'needsUpdate': true,
            'info': [

            ]
        },
        'emergencyInfo': {
            'needsUpdate': true,
            'info': [

            ]
        }
    };
    var mockGeneralSegment = { 'selectedSegmentsIds': [2], 'summaryTrip': 'MAD-BIO' };

    var mockPassengerUpdatedInformation = { 'regularPassengersIds': [1], 'passengersApisIds': [{'test':'test'}], 'passengersSelected': [1], 'newsLetterInfo': { 'info': [{ 'name': 'BORISAUGUSTO ABADORDONEZ', 'departureCity': 'UIO', 'destinationCity': 'MAD', 'language': 'es', 'country': 'ES', 'unsubscribe': true, 'email': 'AS@AS.ES' }] }, 'additionalInfo': { 'needsUpdate': true, 'info': [], 'isMandatory': true }, 'emergencyInfo': { 'needsUpdate': true, 'info': [], 'isMandatory': false } };
    var mockGeneralSegmentInfo = { 'selectedSegmentsIds': [2], 'summaryTrip': 'UIO-MAD' };



    var fakeConfig = { 'SHUTTLE_NEXT_STEPS': { 'BOARDING_CARDS': 'BOARDING_CARDS', 'FLY_NOW': 'FLY_NOW', 'FLIGHT_PASSENGER': 'FLIGHT_PASSENGER', 'GDR': 'GDR' }, 'COOKIES': { 'GDR_PA_INFO': 'GDR_PA_INFO' }, 'STEPS': { 'GDR_CHANGE_FLIGHT': 'GDR_CHANGE_FLIGHT' } };
    var fakePassengerAdditionalInfoService = {
        'updateAdditionalInfo': jasmine.createSpy(),
        'updateEmergencyInfo': jasmine.createSpy('updateEmergencyInfo').and.callFake(function () {
            return { 'result': { 'then': angular.noop } };
        }) };
    var fakeModalService = {
        isWaiting: jasmine.createSpy('isWaiting').and.callFake(angular.noop),
        isNotWaiting: jasmine.createSpy('isNotWaiting').and.callFake(angular.noop),
        setErrorMessage: jasmine.createSpy(),
        showGenericError: jasmine.createSpy().and.callFake(function () {
            return { 'result': { 'then': angular.noop } };
        }),
        showGenericModal: jasmine.createSpy(),
        setErrorCode: jasmine.createSpy(),
        isError: jasmine.createSpy('isError').and.callFake(function () {
            return { 'result': { 'then': angular.noop } };
        })
    };
    var fakeDatalayerUtilsService = {
        'addDataLayerInfo': jasmine.createSpy(),
        'addDigitalDataInfo': jasmine.createSpy()
    };
    var fakeCkiDatalayerConstants = require('test/constants/datalayer-cki-constants.json');
    var fakeNewslettersService = { 'putNewsletters': jasmine.createSpy('.putNewsletters') };
    var fakeFlightsPassengersUtils = {
        'getPassengersUpdateInformation': jasmine.createSpy().and.callFake(function () {
            return { 'additionalInfo': {
                'needsUpdate': 'test'
            }};
        }),
        'getSegmentsUpdateInformation': jasmine.createSpy() };
    var fakeCallAcceptService = {
        'callAccept': jasmine.createSpy('callAccept').and.callFake(function () {
            angular.noop
        })
    };

    var fakeSelectedSegment = {
        'whatToDo' : {
            'selectedBlock' : {
                'nextStep' : 'BOARDING_CARDS'
            }
        }
    };

    const fakeIbCNewsletterService = {
        putNewsletter: jasmine.createSpy('putNewsletter')
    };

    const fakeIbSessionConfigService = {
        isUserLogged: jasmine.createSpy('isUserLogged')
    };

    const fakeDatalayerCKIConstants = require('test/constants/datalayer-cki-constants.json');

    const fakeDigitalDataInfo = require('test/constants/datalayer-general-constants.json');

    beforeEach(function () {
        angular.mock.module('ib-checkin-services-module', 'ngCookies', 'LocalStorageModule', function ($provide) {
            $provide.value('CheckinAppConstants', fakeConfig);
            $provide.value('PassengerAdditionalInfoService', fakePassengerAdditionalInfoService);
            $provide.value('ModalService', fakeModalService);
            $provide.value('CkiDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('CkiDatalayerConstants', fakeCkiDatalayerConstants);
            $provide.value('NewslettersService', fakeNewslettersService);
            $provide.value('FlightsPassengersUtils', fakeFlightsPassengersUtils);
            $provide.value('FlightsPassengersTransformer', {
                updateAdditionalInfo: jasmine.createSpy('updateAdditionalInfo').and.returnValue([{}])
            });
            $provide.value('CallAcceptService', fakeCallAcceptService);
            $provide.value('IbCNewsletterService', fakeIbCNewsletterService);
            $provide.value('CkiDatalayerConstants', fakeDatalayerCKIConstants);
            $provide.value('DigitalDataInfo', fakeDigitalDataInfo);
            $provide.value('IbSessionConfigService', fakeIbSessionConfigService);
        });
        inject(function (_UpdateFlightsPassengerInfoService_, $rootScope, $timeout, _localStorageService_, $window, $cookies, $location, $filter) {
            updateFlightsPassengerInfoService = _UpdateFlightsPassengerInfoService_;
            rootScope = $rootScope;
            timeout = $timeout;
            localStorageService = _localStorageService_;
            window = $window;
            cookies = $cookies;
            location = $location;
            filter = $filter;
        });
    });



    describe('When updateFlightsPassengerInfo() is called', function () {
        it('and  updateFlightsPassengerInfo is called', function (done) {
            inject(function ($q) {
                fakeFlightsPassengersUtils.getPassengersUpdateInformation = jasmine.createSpy('getPassengersUpdateInformation').and.callFake(function () {
                    return mockPassengerUpdatedInformation;
                });

                fakeFlightsPassengersUtils.getSegmentsUpdateInformation = jasmine.createSpy('getSegmentsUpdateInformation').and.callFake(function () {
                    return mockGeneralSegmentInfo;
                });

                fakeNewslettersService.putNewsletters = jasmine.createSpy('putNewsletters').and.callFake(function () {
                    var defer = $q.defer();
                    defer.resolve();
                    return defer.promise;
                });
                fakePassengerAdditionalInfoService.updateAdditionalInfo = jasmine.createSpy('updateAdditionalInfo').and.callFake(function () {
                    var defer = $q.defer();
                    defer.resolve();
                    return defer.promise;
                });
                fakePassengerAdditionalInfoService.updateEmergencyInfo = jasmine.createSpy('updateEmergencyInfo').and.callFake(function () {
                    var defer = $q.defer();
                    defer.resolve();
                    return defer.promise;
                });
            });

            updateFlightsPassengerInfoService.updateFlightsPassengerInfo(mockPassengersInfo, mockSegmentsInfo, false, mockActiveFields, fakeSelectedSegment);

            fakeNewslettersService.putNewsletters().then(function (data){
                fakePassengerAdditionalInfoService.updateEmergencyInfo().then(function (data){
                    expect(localStorageService.get('passengersAPIS')).toEqual(mockPassengerUpdatedInformation.passengersApisIds);
                }, angular.noop);
            }, angular.noop);
            rootScope.$digest();
            done();
        });
        it('calls PassengerAdditionalInfoService.updateAdditionalInfo when it rejects', function () {
            inject(function ($q) {
                fakeFlightsPassengersUtils.getPassengersUpdateInformation = jasmine.createSpy('getPassengersUpdateInformation').and.callFake(function () {
                    return mockPassengerUpdatedInformation;
                });

                fakeFlightsPassengersUtils.getSegmentsUpdateInformation = jasmine.createSpy('getSegmentsUpdateInformation').and.callFake(function () {
                    return mockGeneralSegmentInfo;
                });

                fakeNewslettersService.putNewsletters = jasmine.createSpy('putNewsletters').and.callFake(function () {
                    var defer = $q.defer();
                    defer.resolve();
                    return defer.promise;
                });
                fakePassengerAdditionalInfoService.updateAdditionalInfo = jasmine.createSpy('updateAdditionalInfo').and.callFake(function () {
                    var deferred = $q.defer();
                    deferred.reject(true);
                    return deferred.promise;
                });
            });

            updateFlightsPassengerInfoService.updateFlightsPassengerInfo(mockPassengersInfo, mockSegmentsInfo, false, mockActiveFields, fakeSelectedSegment);
            rootScope.$digest();

            expect(fakePassengerAdditionalInfoService.updateAdditionalInfo).toHaveBeenCalled();
        });
    });

    describe('When updateApisInformation is called', function () {
        it('should callAccept service', function (done) {
            localStorageService.set('passengersNOAPIS', [{ 'pas': 'pas' }]);
            updateFlightsPassengerInfoService.updateApisInformation({ 'pas': 'pas2' });
            expect(localStorageService.get('passengersSelected').length).toEqual(2);
            done();
        });
    });

    describe('When updateFlightsPassengerInfo() is called', function () {
        it('and  updateFlightsPassengerInfo is called', function (done) {
            const newsLetterIndex = 2;
            inject(function ($q) {
                fakeFlightsPassengersUtils.getPassengersUpdateInformation = jasmine.createSpy('getPassengersUpdateInformation').and.callFake(function () {
                    return mockPassengerUpdatedInformation;
                });

                fakeFlightsPassengersUtils.getSegmentsUpdateInformation = jasmine.createSpy('getSegmentsUpdateInformation').and.callFake(function () {
                    return mockGeneralSegmentInfo;
                });
            });
            updateFlightsPassengerInfoService.updateFlightsPassengerInfo(mockPassengersInfo, mockSegmentsInfo, false, mockActiveFields, fakeSelectedSegment);
            expect(newsLetterIndex > mockPassengerUpdatedInformation.newsLetterInfo.info.length).toBe(true);
            //expect(updateGeneralContactData).toHaveBeenCalled();
            done();
        });
    });
});
