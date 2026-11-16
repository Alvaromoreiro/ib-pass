describe('ibMmbYourFlightsTabComponent test', function () {
    var $controller, $rootScope, $scope, controller;

    var fakeBookingDashboardConstants = {
        BOX_LINKS_TYPES: {
            'CHECK_IN': 'checkIn',
            'EMERGENCY_CONTACT': 'emergencyContact',
            'SEATS_AUCTION': 'seatsAuction',
            'FLIGHT_REMINDER': 'flightReminder'
        },
        BOX_COL_SIZES: {
            'FULL': 'ib-box-menu__section--full',
            'EXTRALARGE': 'col-xs-12',
            'LARGE': 'col-md-6 col-lg-12 col-xl-6 col-xs-12',
            'MEDIUM': 'col-md-6 col-xs-12'
        },
        BOX_LINK_SIZES: {
            'FULL': 'ib-box-menu__section--full',
            'LEFT': 'ib-box-menu__section--left',
            'RIGHT': 'ib-box-menu__section--right'
        },
        BOX_LINK_ICONS: {
            'CHECK_IN': 'icon-checking_online',
            'MESSAGES': 'icon-mensajes',
            'AUCTION': 'icon-subasta'
        },
    }

    var fakeMmBAppConstants = {
        'QUADRIGAM': {
            'PASSENGER_DATA': 'test',
            'YOUR_FLIGHTS': 'your_flights'
        }
    }

    var fakeDatalayerUtilsService = {
        updateDatalayerWithQuadrigam: jasmine.createSpy('updateDatalayerWithQuadrigam').and.callFake(angular.noop),
        sendDatalayerEvent: jasmine.createSpy(),
        updateDigitalDataWithQuadrigam: jasmine.createSpy(),
        updateDatalayerViewEvent: jasmine.createSpy(),
        setProcessAndStep: jasmine.createSpy(),
        updateDatalayerInfo: jasmine.createSpy()
    };

    var fakeDatalayerConstants = {
        DATALAYER_EVENT_TYPES: {
            'VIEW': 'view'
        },
        DATALAYER_INFO: {
            'DEPARTURE_AIRPORT': 'aeropuertoOrigen',
            'ARRIVAL_AIRPORT': 'aeropuertoDestino',
            'TOTAL_AVAILABILITY': 'resultadosBusqueda',
            'DEPARTURE_TIME': 'horarioSalida',
            'IS_AIR_SHUTTLE': 'puenteAereo'
        },
        DATALAYER_VALUES: {
            'YES': 'SI'
        },
        DIGITAL_DATA_PROCESS:{
            IBMTFL: 'servicing'
        },
        DIGITAL_DATA_STEP: {
            IBMTFL: 'tus vuelos'
        }
    };

    var fakeMmBUtilService = {
        'isUserLogged': jasmine.createSpy('isUserLogged').and.callFake(function () {
            return true;
        }),
    }

    var fakeMmBModalService = {
        'showGenericModal': jasmine.createSpy()
    };
    var fakeCommonsUtilService = {
        'setTitlePage': jasmine.createSpy('setTitlePage').and.callFake(function () {
            return 'MMB_TITLE_PAGE_MANAGE_FLIGHTS'
        }),
    };

    var fakeLocalStorageService = {
        get: jasmine.createSpy('get').and.callFake(function (key) {
            if (key === 'bookingInfo') {
                return {
                    order: {
                        slices: [{ sliceId: 'slice-1', disruptionTypes: ['DELAY'] }]
                    },
                    warnings: [{ code: 'SSE_ORM_9442' }]
                };
            }
            return null;
        })
    };

    var fakeDisruptionUtilService = {
        checkDelayedFlights: jasmine.createSpy('checkDelayedFlights').and.returnValue([{ sliceId: 'slice-1' }]),
        checkWarning: jasmine.createSpy('checkWarning').and.returnValue(true)
    };

    beforeEach(function () {
        angular.mock.module('ib-MmB-your-flights-tab-module', function ($provide) {
            $provide.value('BookingDashboardConstants', fakeBookingDashboardConstants);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('MMBDatalayerConstants', fakeDatalayerConstants);
            $provide.value('MmBUtilService', fakeMmBUtilService);
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('CommonsUtilService', fakeCommonsUtilService);
            $provide.value('localStorageService', fakeLocalStorageService);
            $provide.value('DisruptionUtilService', fakeDisruptionUtilService);
        });
        inject(function (_$componentController_, _$rootScope_) {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            controller = _$componentController_('ibMmbYourFlightsTabComponent', {
                $scope: $scope
            });
        });
    });

    describe('when activate() function is called', function () {
        it('should do nothing )', function () {
            controller.$onInit();
            expect(controller.$onInit).toBeDefined();
            expect(fakeDisruptionUtilService.checkDelayedFlights).toHaveBeenCalled();
            expect(fakeDisruptionUtilService.checkWarning).toHaveBeenCalled();
            expect(controller.delayedFlights).toEqual([{ sliceId: 'slice-1' }]);
            expect(controller.caseFive).toBe(true);
        });
    });

    describe('when openFareWindowModal() function is called', function () {
        it('should set selectedFareInfo correctly and use MmBModalService.showGenericModal with them. )', function () {
            inject(function () {
                fakeMmBModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.callFake(function () {
                    return {
                        'result': {
                            'then': function () {}
                        }
                    };
                });
            });
            $rootScope.$broadcast('openFareModal', {});
        });
    });
});
