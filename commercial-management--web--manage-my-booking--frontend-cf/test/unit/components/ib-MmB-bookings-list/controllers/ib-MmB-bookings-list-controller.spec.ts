describe('BookingsListController test', () => {
    let rootScope, scope, localStorageService, cookies, controller;

    let modalFake = () => {
        return { 'result': { 'then': () => { } } };
    };

    let fakeDatalayerUtilsService = {
        updateDatalayerWithQuadrigam: jasmine.createSpy('updateDatalayerWithQuadrigam').and.callFake(angular.noop),
        sendDatalayerEvent: jasmine.createSpy('sendDatalayerEvent').and.callFake(angular.noop),
        updateLoggedDatalayer: jasmine.createSpy('updateLoggedDatalayer').and.callFake(angular.noop),
        removeProcessAndStep: jasmine.createSpy('removeProcessAndStep').and.callFake(angular.noop),
        updateLoggedDigitalData: jasmine.createSpy('updateLoggedDigitalData').and.callFake(angular.noop),
        updateDigitalDataWithQuadrigam: jasmine.createSpy('updateDigitalDataWithQuadrigam').and.callFake(angular.noop),
        updateDatalayerViewEvent: jasmine.createSpy('updateDatalayerViewEvent').and.callFake(angular.noop),
        updateDatalayerInfo: jasmine.createSpy('updateDatalayerInfo').and.callFake(angular.noop),
    };

    let fakeMmBModalService = {
        showWaitingModal: jasmine.createSpy('showWaitingModal').and.callFake(angular.noop),
        finishWaiting: jasmine.createSpy('finishWaiting').and.callFake(angular.noop),
        showGenericModal: jasmine.createSpy('showGenericModal').and.callFake(modalFake),
        showGenericError: jasmine.createSpy('showGenericError').and.callFake(modalFake)
    };

    let fakeMmBAppConstants = {
        QUADRIGAM: { 'LOGGED_SEARCH': 'MYTRPS' },
        URL_PARAMETERS: { 'ERROR_CODE': 'codeError' }
    };

    let fakeDatalayerConstants = {
        DATALAYER_EVENT_TYPES: { 'VIEW': 'view', 'LINK': 'link' },
        DATALAYER_INFO: {
            'DEPARTURE_AIRPORT': 'aeropuertoOrigen', 'ARRIVAL_AIRPORT': 'aeropuertoDestino', 'TOTAL_AVAILABILITY': 'resultadosBusqueda',
            'DEPARTURE_TIME': 'horarioSalida', 'IS_AIR_SHUTTLE': 'puenteAereo'
        },
        DATALAYER_VALUES: { 'YES': 'SI' },
        DATALAYER_MODAL_ID: { 
            FARE_CONDITIONS: 'FARE_CONDITIONS',
            WHERE_IS_PNR: 'WHERE_IS_PNR '
         },
        DIGITAL_DATA_STEP: {
            LOGGED_SEARCH: 'LOGGED_SEARCH'
        },
        DIGITAL_DATA_PROCESS: {
            LOGGED_SEARCH: 'LOGGED_SEARCH'
        }
    };

    let fakeMmBUtilService = {
        'isUserLogged': jasmine.createSpy('isUserLogged').and.callFake(angular.noop),
        'getParameterByName': jasmine.createSpy('getParameterByName').and.callFake(() => {
            return {errorCode: 417};
        }),
        getOldManageAppErrorMessage: jasmine.createSpy('getOldManageAppErrorMessage').and.callFake(() => {
            return true;
        }),
    };

    let fakeBookingsListService = {
        'getBookingsList': jasmine.createSpy()
    };

    let fakeBookingSearchService = { 'searchFlightsPassengersEvent': jasmine.createSpy() };

    let fakeCommonsUserUtilsService = {
        isSoftUser: jasmine.createSpy()
    };

    let fakeCommonsUtilService = {
        setTitlePage: jasmine.createSpy()
    };

    let fakeLocation = {
        path: jasmine.createSpy()
    };

    let fakeBookingsListModel = {
        initializeModel: jasmine.createSpy(),
        bookingList: {},
        homeURL: 'homeURL'
    };

    let fakeLoadingSpinnerService = {
        'show': jasmine.createSpy('show'),
        'hide': jasmine.createSpy('hide'),
        'isLoading': jasmine.createSpy('isLoading').and.returnValue(false)
    };

    beforeEach(() => {
        angular.mock.module('ngCookies', 'ib-MmB-bookings-list-module', 'LocalStorageModule', 'ib-MmB-services-module', ($provide) => {
            $provide.value('BookingsListService', fakeBookingsListService);
            $provide.value('BookingsListModel', fakeBookingsListModel);
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('BookingSearchService', fakeBookingSearchService);
            $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('MmBUtilService', fakeMmBUtilService);
            $provide.value('$location', fakeLocation);
            $provide.value('CommonsUserUtilsService', fakeCommonsUserUtilsService);
            $provide.value('CommonsUtilService', fakeCommonsUtilService);
            $provide.value('MMBDatalayerConstants', fakeDatalayerConstants);
            $provide.value('DatalayerUtilsService', () => {});
            $provide.value('MmBDataLayerService', () => {});
            $provide.value('LoadingSpinnerService', fakeLoadingSpinnerService);
        });

        inject(($rootScope, $controller, _localStorageService_, $q, _$cookies_) => {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            cookies = _$cookies_;
            
            localStorageService = _localStorageService_;
            cookies.put('userLogged', true);
            fakeBookingsListService.getBookingsList = jasmine.createSpy('getBookingsList').and.callFake(() => {
                var defer = $q.defer();
                defer.resolve({ 'bookingList': {}, 'homeURL': 'homeURL' });
                return defer.promise;
            });
            localStorageService.set('userLogged', true);
        });
    });

    describe('When activate() is called', () => {
        beforeEach(inject(($controller) => {
            fakeCommonsUserUtilsService.isSoftUser = jasmine.createSpy('isSoftUser').and.callFake(() => {
                return false;
            });  
            controller = $controller('BookingsListController', {
                '$scope': scope,
                'localStorageService': localStorageService,
                'MmBModalService': fakeMmBModalService,
                'BookingsListService': fakeBookingsListService,
                'BookingSearchService': fakeBookingSearchService
            });
        }));
        it('and BookingsListService() resolve promise', (done) => {
            setTimeout(() => {
                rootScope.$digest();
                expect(controller.model.bookingList).toEqual({});
                expect(controller.model.homeURL).toBe('homeURL');
                done();
            }, 0);
        });  
    });

    describe('When activate() is called', () => {
        beforeEach(inject(($controller)=> {
            fakeCommonsUserUtilsService.isSoftUser = jasmine.createSpy('isSoftUser').and.callFake(() => {
                return true;
            });
            spyOn(fakeLocation, 'path');
            controller = $controller('BookingsListController', {
                '$scope': scope,
                'localStorageService': localStorageService,
                'MmBModalService': fakeMmBModalService,
                'BookingsListService': fakeBookingsListService,
                'BookingSearchService': fakeBookingSearchService
            });
        }));
        it('and isSoftUser() is false and go to else', (done) => {
            setTimeout(() => {
                rootScope.$digest();
                expect(fakeLocation.path).toHaveBeenCalled();
                done();
            }, 0);
        });
    });

    it('openGenericModal() is called', inject(($controller) => {
        controller = $controller('BookingsListController', {
            '$scope': scope,
            'localStorageService': localStorageService,
            'MmBModalService': fakeMmBModalService,
            'BookingsListService': fakeBookingsListService,
            'BookingSearchService': fakeBookingSearchService
        });
        rootScope.$broadcast('openGenericModal', {}, {});
        expect(fakeMmBModalService.showGenericModal).toHaveBeenCalled();
    }));

    it('searchBookingItem() is called', inject(($controller) => {
        controller = $controller('BookingsListController', {
            '$scope': scope,
            'localStorageService': localStorageService,
            'MmBModalService': fakeMmBModalService,
            'BookingsListService': fakeBookingsListService,
            'BookingSearchService': fakeBookingSearchService
        });
        var data = { 'locator': '1', 'surname': 'surname', 'departure': { 'code': '1' }, 'arrival': { 'code': '1' } };
        rootScope.$broadcast('searchBookingItem', data);
        expect(fakeBookingSearchService.searchFlightsPassengersEvent).toHaveBeenCalled();
    }));
});
