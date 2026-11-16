describe('MmBYourHotelHolidaysTabController test', function () {
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
        IBERIA_HOLIDAYS:{
            'MMB_IB_VACIONES_TYPE_PACKAGE' : 'flight+hotel',
            'MMB_IB_VACIONES_TYPE_PACKAGE_HOTEL' : 'hotel',
            'MMB_IB_VACIONES_TYPE_LINK_AVIS' : '../iberia-web-content/iconos/IB_Vacaciones/AVIS_RED@2x.svg',
            'MMB_IB_VACIONES_TYPE_LINK_BUDGET' : '../iberia-web-content/iconos/IB_Vacaciones/Budget_logo.svg',
            'MMB_IB_VACIONES_TYPE_COMPANY_CAR_AVIS' : 'ZI',
            'MMB_IB_VACIONES_TYPE_COMPANY_CAR_BUDGET' : 'ZD',
            'MMB_IB_VACIONES_TYPE_NEGATIVE' : '-',
            'MMB_IB_VACIONES_TYPE_SPACE' : ' '
        }
    }

    var fakeMmBAppConstants = {
        'QUADRIGAM': {
            'PASSENGER_DATA': 'test'
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
        DIGITAL_DATA_PROCESS: {
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
    }

    beforeEach(function () {
        angular.mock.module('ib-MmB-your-hotel-holidays-tab-module', function ($provide) {
            $provide.value('BookingDashboardConstants', fakeBookingDashboardConstants);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('MMBDatalayerConstants', fakeDatalayerConstants);
            $provide.value('MmBUtilService', fakeMmBUtilService);
            $provide.value('MmBModalService', fakeMmBModalService)
        });
        inject(function (_$controller_, _$rootScope_) {
            $rootScope = _$rootScope_;
            $controller = _$controller_;
            $scope = $rootScope.$new();
            controller = $controller('MmBYourHotelHolidaysTabController', {
                $scope: $scope
            });
        });
    });

    describe('when activate() function is called', function () {
        it('should do nothing )', function () {
            controller.$onInit();
            expect(controller.$onInit).toBeDefined();
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
