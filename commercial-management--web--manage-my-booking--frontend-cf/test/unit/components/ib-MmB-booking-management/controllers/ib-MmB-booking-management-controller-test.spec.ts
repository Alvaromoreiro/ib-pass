describe('BookingManagementController test', function () {
    var rootScope, scope, localStorageService, location, controller;

    var fakeBookingManagementService = {
        'getBookingInfo': jasmine.createSpy(),
        'generateMinAndMaxSearchDate': jasmine.createSpy('generateMinAndMaxSearchDate').and.callFake(angular.noop),
        'optionSelected': jasmine.createSpy('optionSelected').and.callFake(angular.noop)

    };

    var fakeDatalayerUtilsService = {
        'updateDatalayerWithQuadrigam': jasmine.createSpy('updateDatalayerWithQuadrigam').and.callFake(angular.noop),
        'sendDatalayerEvent': jasmine.createSpy('sendDatalayerEvent').and.callFake(angular.noop),
        'removeDatalayerObjects': jasmine.createSpy('removeDatalayerObjects').and.callFake(angular.noop),
        'updateTripDetailsDatalayerObject': jasmine.createSpy('updateTripDetailsDatalayerObject').and.callFake(angular.noop),
        'removeDigitalDataObjects': jasmine.createSpy('removeDigitalDataObjects').and.callFake(angular.noop),
        'updateDigitalDataWithQuadrigam': jasmine.createSpy('updateDigitalDataWithQuadrigam').and.callFake(angular.noop),
        'updateDatalayerViewEvent': jasmine.createSpy('updateDatalayerViewEvent').and.callFake(angular.noop),
        'updateDatalayerInfo': jasmine.createSpy()

    }

    var fakeMmBModalService = {
        showWaitingModal: jasmine.createSpy('showWaitingModal').and.callFake(angular.noop),
        finishWaiting: jasmine.createSpy('finishWaiting').and.callFake(angular.noop),
        showGenericError: jasmine.createSpy('showGenericError').and.callFake(modalFake)
    };

    var fakeBookingManagementConstants = {
        'DATA_CONTACT': {
            'CONTACT': 'CONTACT'
        }
    };

    var fakeMmBAppConstants = {
        QUADRIGAM: { 'TRIP_DETAILS': 'IBMTDT' },
        PAGES_URL: { 'PASSENGERS_INFO': '/moinfo', 'CHANGE_PASSENGERS_SPECIAL_NEEDS': '/mopmr' }
    };

    var fakeDatalayerConstants = {
        DATALAYER_EVENT_TYPES: { 'VIEW': 'view' },
        DATALAYER_INFO: {
            'DEPARTURE_AIRPORT': 'aeropuertoOrigen', 'ARRIVAL_AIRPORT': 'aeropuertoDestino', 'TOTAL_AVAILABILITY': 'resultadosBusqueda',
            'DEPARTURE_TIME': 'horarioSalida', 'IS_AIR_SHUTTLE': 'puenteAereo'
        },
        DATALAYER_VALUES: { 'YES': 'SI' }

    };

    var fakeMmBUtilService = {
        'isUserLogged': jasmine.createSpy('isUserLogged').and.callFake(angular.noop)
    };

    var bookingInfo = {
        'bookingCode': 'code',
        'segments': [{ 'id': 'IB273020170504' }],
        'passengers': [{ 'passengerId': '1' }],
        'optionalInformation': true,
        'hasSavedChangesSuccess': false,
        'showSpecialNeeds': true,
        'haveSpecialPassenger': true,
        'showCopyOfTickets': true
    };

    var fakeCommonsUtilService = {
        'setTitlePage': jasmine.createSpy()
    }

    function modalFake() {
        return { 'result': { 'then': function () { } } };
    }

    let fakeLoadingSpinnerService = {
        'show': jasmine.createSpy('show'),
        'hide': jasmine.createSpy('hide'),
        'isLoading': jasmine.createSpy('isLoading').and.returnValue(false)
    };      


    beforeEach(function () {
        angular.mock.module('ib-MmB-booking-management-module', 'LocalStorageModule', 'ib-MmB-services-module', function ($provide) {
            $provide.value('BookingManagementService', fakeBookingManagementService);
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('MMBDatalayerConstants', fakeDatalayerConstants);
            $provide.value('BookingManagementConstants', fakeBookingManagementConstants);
            $provide.value('MmBUtilService', fakeMmBUtilService);
            $provide.value('CommonsUtilService', fakeCommonsUtilService);
            $provide.value('LoadingSpinnerService', fakeLoadingSpinnerService);
        });

        inject(function ($rootScope, $controller, $location, _localStorageService_, $q) {
            rootScope = $rootScope;
            location = $location;
            scope = $rootScope.$new();
            localStorageService = _localStorageService_;
            fakeBookingManagementService.getBookingInfo = jasmine.createSpy('getBookingInfo').and.callFake(function () {
                var defer = $q.defer();
                defer.resolve(bookingInfo);
                return defer.promise;
            });
            controller = $controller('BookingManagementController', {
                'BookingManagementModel': { 'initializeModel': function () { } },
                '$scope': scope,
                '$location': $location,
                'localStorageService': _localStorageService_,
                'MmBModalService': fakeMmBModalService,
                'BookingManagementService': fakeBookingManagementService,
                'LoadingSpinnerService': fakeLoadingSpinnerService

            });
            scope.$digest();
        });
    });


    describe('When segmentOptionSelected() is called', function () {
        it('generateMinAndMaxSearchDate and optionSelected have been called', function (done) {
            rootScope.$broadcast('optionSelected', {}, {});
            expect(fakeBookingManagementService.generateMinAndMaxSearchDate).toHaveBeenCalled();
            expect(fakeBookingManagementService.optionSelected).toHaveBeenCalled();
            done();
        });
    })

    describe('When showSegmentError() is called', function () {
        it(' MmBModalService.showGenericError have been called', function (done) {
            rootScope.$broadcast('showSegmentError', {}, {});
            expect(fakeMmBModalService.showGenericError).toHaveBeenCalled();
            done();
        });
    });

    describe('When modifyPassenger() is called', function () {
        var passenger = {
            'passengerType': 'ADULT',
            'personalInfo': {
                'name': 'BUEN',
                'surname': 'REBES WEINDL',
                'birthDate': null
            },
            'passengerId': '1',
            'ckiStatus': 'CHECKABLE',
            'optionalInformation': {
                'contactData': true,
                'emergency': false,
                'ffInfo': false,
                'specialNeed': false
            }
        };
        it('and showSpecialNeeds is true and passengerId is DATA_CONTACT', function (done) {
            rootScope.$broadcast('modifyPassenger', passenger, { 'passengerId': fakeBookingManagementConstants.DATA_CONTACT.CONTACT });
            expect(localStorageService.get('selectedPassengerId').passengerId).toEqual(fakeBookingManagementConstants.DATA_CONTACT.CONTACT);
            localStorageService.set('optionalInformation', true);
            expect(localStorageService.get('optionalInformation')).toBe(true);
            expect(location.path()).toBe(fakeMmBAppConstants.PAGES_URL.PASSENGERS_INFO);
            localStorageService.clearAll();
            done();
        });

        it('and showSpecialNeeds is true and passengerId is !DATA_CONTACT', function (done) {
            rootScope.$broadcast('modifyPassenger', passenger, { 'passengerId': 1 });
            expect(localStorageService.get('selectedPassengerId').passengerId).toEqual(1);
            localStorageService.set('optionalInformation', true);
            expect(localStorageService.get('optionalInformation')).toBe(true);
            expect(location.path()).toBe(fakeMmBAppConstants.PAGES_URL.PASSENGERS_INFO);
            localStorageService.clearAll();
            done();

        });

    });

    it('When openSpecialPassengers() is called, redirect to CHANGE_PASSENGERS_SPECIAL_NEEDS URL', function () {
        rootScope.$broadcast('openSpecialPassengers');
        expect(location.path()).toBe(fakeMmBAppConstants.PAGES_URL.CHANGE_PASSENGERS_SPECIAL_NEEDS);
    });
});
