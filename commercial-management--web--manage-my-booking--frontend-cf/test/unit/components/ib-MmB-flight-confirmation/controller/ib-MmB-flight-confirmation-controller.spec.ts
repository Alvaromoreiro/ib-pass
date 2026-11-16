describe('FlightConfirmationController test', () => {

    let $controller, $rootScope, $scope, $q, location, controller, localStorageService;

    let fakeMmBModalService = {
        showGenericModal: jasmine.createSpy(),

        showWaitingModal: jasmine.createSpy('showWaitingModal').and.callFake(() => {
            return { result: { then: angular.noop } };
        }),
        finishWaiting: jasmine.createSpy(),
        showGenericError: jasmine.createSpy()
    };

    let fakeMmBAppConstants = {
        WARNING_MESSAGES: {
            OVERNIGHT_WARNING: 'SSE_AVM_20003',
            TERMINAL_CHANGE_WARNING: 'SSE_AVM_20002',
            AIRPORT_CHANGE_WARNING: 'SSE_AVM_20001',
            LONG_WAITING_WARNING: 'SSE_AVM_20004',
            MISSCONNECTION_FLEX_WARNING: 'SSE_ORM_20014'
        },
        FLIGHTS_TYPES: {
            'DIRECT': 'MMB_YOUR_FLIGHTS_DIRECT_TEXT',
            'INDIRECT': 'MMB_YOUR_FLIGHTS_SCALE_SIMPLE_TEXT'
        },
        CALENDAR_POSITION: {
            'LEFT': 'bottom-left',
            'RIGHT': 'bottom-right'
        },
        QUADRIGAM: {
            'SPECIAL_NEEDS': 'MOPMR',
            'SPECIAL_NEEDS_CONFIRMED': 'MOPMRCF'
        },
        PAGES_URL: {
            BOOKING_MANAGE: '',
            SEARCH: 'http://test.com'
        }
    }

    let fakeDatalayerUtilsService = {
        'updateDatalayerWithQuadrigam': jasmine.createSpy('updateDatalayerWithQuadrigam').and.callFake(angular.noop),
        'sendDatalayerEvent': jasmine.createSpy('sendDatalayerEvent').and.callFake(angular.noop),
        'updateLoggedDatalayer': jasmine.createSpy('updateLoggedDatalayer').and.callFake(angular.noop)
    }

    let fakeDatalayerConstants = {
        DATALAYER_EVENT_TYPES: { 'VIEW': 'view', 'LINK': 'link' },
        DATALAYER_INFO: {
            'DEPARTURE_AIRPORT': 'aeropuertoOrigen', 'ARRIVAL_AIRPORT': 'aeropuertoDestino', 'TOTAL_AVAILABILITY': 'resultadosBusqueda',
            'DEPARTURE_TIME': 'horarioSalida', 'IS_AIR_SHUTTLE': 'puenteAereo'
        },
        DATALAYER_VALUES: { 'YES': 'SI' },
        DATALAYER_MODAL_ID: {
            'FARE_CONDITIONS': 'FARE_CONDITIONS',
            'BACK_MAIN_HEADER_MODAL': 'BACK_MAIN_HEADER_MODAL',
            'POSIBLE_DELETE_SEGMENT': 'POSIBLE_DELETE_SEGMENT'
        }
    };

    let fakeMmBUtilService = {
        openFareFamilyConditionsModal: jasmine.createSpy()
    };

    let fakeMmBUtilsSharedService = {
        updateQuadrigam: jasmine.createSpy()
    };

    let fakeFlightConfirmationModel = {
        'initializeModel': jasmine.createSpy()
    };

    let fakeFlightConfirmationService = {
        'getConfirmationInfo': jasmine.createSpy(),
        'confirmChangeFlight': jasmine.createSpy(),
    };

    let fakeFlightConfirmationTransformer = {
        'posibleDeleteSegments': jasmine.createSpy(),
        'areDeletedSegments': jasmine.createSpy(),
    };

    beforeEach(() => {
        angular.mock.module('ib-MmB-flight-confirmation-module', 'LocalStorageModule', ($provide) => {
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('FlightConfirmationModel', fakeFlightConfirmationModel);
            $provide.value('FlightConfirmationService', fakeFlightConfirmationService);
            $provide.value('FlightConfirmationTransformer', fakeFlightConfirmationTransformer);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('MMBDatalayerConstants', fakeDatalayerConstants);
            $provide.value('MmBUtilService', fakeMmBUtilService);
            $provide.value('MmBUtilsSharedService', fakeMmBUtilsSharedService);
        });

        inject((_$controller_, _$rootScope_, _$location_, _$q_, _localStorageService_) => {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            localStorageService = _localStorageService_;

            $q = _$q_;

            fakeFlightConfirmationService.getConfirmationInfo = jasmine.createSpy('getConfirmationInfo').and.callFake(() => {
                var deferred = $q.defer();
                deferred.resolve({
                    newSegmentInfo: {
                        departureDate: {
                            dateTime: '10/10/2023'
                        }
                    }
                });
                return deferred.promise;
            });

            fakeFlightConfirmationService.confirmChangeFlight = jasmine.createSpy('confirmChangeFlight').and.callFake(() => {
                var deferred = $q.defer();
                deferred.resolve();
                return deferred.promise;
            });

            fakeFlightConfirmationTransformer.areDeletedSegments = jasmine.createSpy('areDeletedSegments').and.callFake(() => {
                return true;
            });

            controller = $controller('FlightConfirmationController', {
                $scope: $scope,
                $rootScope: $rootScope,
                $location: _$location_,
                localStorageService: localStorageService,
                changeFlightOrder: {
                    callChangeFlightOrder: jasmine.createSpy(),
                }
            });
            localStorageService.set('PNR', 'test');
            localStorageService.set('checkinSurname', 'test');
        });
    });

    describe('backAvailability', () => {
        it('backAvailability is called with showGeneric Reject', (done) => {
            fakeMmBModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.callFake(() => {
                var deferred = $q.defer();
                deferred.reject(angular.noop);
                return { result: deferred.promise }
            });
            controller.backAvailability();
            $rootScope.$digest();
            done();
            //expect(fakeMmBModalService.showGenericModal).toHaveBeenCalled();
        });

        it('backAvailability is called with showGeneric Resolve', (done) => {
            fakeMmBModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.callFake(() => {
                var deferred = $q.defer();
                deferred.resolve();
                return { result: deferred.promise }
            });
            controller.backAvailability();
            $rootScope.$digest();
            expect(fakeMmBModalService.showGenericModal).toHaveBeenCalled();
            done();
        });

    });

    describe('changeFlightOrder', () => {
        beforeEach(inject(() => {
            fakeFlightConfirmationService.getConfirmationInfo = jasmine.createSpy('getConfirmationInfo').and.callFake(() => {
                var deferred = $q.defer();
                deferred.resolve();
                return deferred.promise;
            });
            fakeMmBModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.callFake(() => {
                var deferred = $q.defer();
                deferred.resolve();
                return { 'result': deferred.promise }
            });
            fakeFlightConfirmationService.confirmChangeFlight = jasmine.createSpy('confirmChangeFlight').and.callFake(() => {
                var deferred = $q.defer();
                deferred.resolve();
                return deferred.promise;
            });
        }));
        it('changeFlightOrder is called when FlightConfirmationTransformer.posibleDeleteSegments() returns false', (done) => {
            fakeFlightConfirmationTransformer.posibleDeleteSegments = jasmine.createSpy('posibleDeleteSegments').and.callFake(() => {
                return false
            });
            fakeFlightConfirmationTransformer.areDeletedSegments = jasmine.createSpy('areDeletedSegments').and.callFake(() => {
                return false;
            });
            controller.changeFlightOrder();
            $rootScope.$digest();
            expect(fakeMmBModalService.showWaitingModal).toHaveBeenCalled();
            done();
        });
        it('changeFlightOrder is called when FlightConfirmationTransformer.posibleDeleteSegments() returns true', (done) => {

            fakeFlightConfirmationTransformer.posibleDeleteSegments = jasmine.createSpy('posibleDeleteSegments').and.callFake(() => {
                return true
            });
            fakeFlightConfirmationTransformer.areDeletedSegments = jasmine.createSpy('areDeletedSegments').and.callFake(() => {
                return true;
            });
            controller.changeFlightOrder();
            $rootScope.$digest();
            expect(fakeMmBModalService.showGenericModal).toHaveBeenCalled();
            done();
        });

        it('changeFlightOrder is called when FlightConfirmationTransformer.posibleDeleteSegments() returns true and showGeneric reject', (done) => {
            fakeMmBModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.callFake(() => {
                var deferred = $q.defer();
                deferred.reject();
                return { 'result': deferred.promise }
            });
            fakeFlightConfirmationTransformer.posibleDeleteSegments = jasmine.createSpy('posibleDeleteSegments').and.callFake(() => {
                return true
            });
            fakeFlightConfirmationTransformer.areDeletedSegments = jasmine.createSpy('areDeletedSegments').and.callFake(() => {
                return true;
            });
            controller.changeFlightOrder();
            $rootScope.$digest();
            expect(fakeMmBModalService.showGenericModal).toHaveBeenCalled();
            done();
        });
    });

    describe('changeFlightOrder with confirmChangeFlight reject and error 409', () => {
        beforeEach(inject(() => {
            fakeMmBModalService.showGenericError = jasmine.createSpy('showGenericError').and.callFake(() => {
                var deferred = $q.defer();
                deferred.resolve();
                return { 'result': deferred.promise }
            });
            fakeMmBModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.callFake(() => {
                var deferred = $q.defer();
                deferred.resolve();
                return { 'result': deferred.promise }
            });
        }));
        it('Should changeFlightOrder and confirmChangeFlight reject and error 409', (done) => {
            inject(() => {
                fakeFlightConfirmationService.getConfirmationInfo = jasmine.createSpy('getConfirmationInfo').and.callFake(() => {
                    var deferred = $q.defer();
                    deferred.reject({});
                    return deferred.promise;
                });
            });
            fakeFlightConfirmationService.confirmChangeFlight = jasmine.createSpy('confirmChangeFlight').and.callFake(() => {
                var deferred = $q.defer();
                deferred.reject({errorCode: 409});
                return deferred.promise;
            });
            controller.changeFlightOrder();
            $rootScope.$digest();
            expect(fakeMmBModalService.showGenericModal).toHaveBeenCalled();
            done();
        });
        it('Should changeFlightOrder and confirmChangeFlight reject and others error', (done) => {
            fakeFlightConfirmationService.confirmChangeFlight = jasmine.createSpy('confirmChangeFlight').and.callFake(() => {
                var deferred = $q.defer();
                deferred.reject({errorCode: 500});
                return deferred.promise;
            });
            controller.changeFlightOrder();
            $rootScope.$digest();
            expect(fakeMmBModalService.showGenericError).toHaveBeenCalled();
            done();
        });
    });

});
