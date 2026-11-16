describe('ibMmbPassengersTabComponent test', () => {

    let $rootScope, $scope, controller, message;

    let fakeSeatsAuctionDataOutput = {

        'colSize': 'col-md-6 col-lg-12 col-xl-6 col-xs-12',
        'boxSize': 'ib-box-menu__section--full',
        'icon': 'icon-subasta',
        'linkId': 'seatsAuction',
        'text': {
            'title': 'MODULES_LINK_SEAT_AUCTION_TEXT',
            'subtitle': 'MODULES_LINK_GET_BETTER_SEAT_TEXT',
            'accessibilityText': 'MODULES_LINK_GET_BETTER_SEAT_TEXT'
        }
    }

    let fakeSeatsAuctionDataOutput2 = {

        'colSize': 'col-md-6 col-lg-12 col-xl-6 col-xs-12',
        'boxSize': 'ib-box-menu__section--full',
        'icon': 'icon-subasta',
        'linkId': 'seatsAuction',
        'text': {
            'title': 'MODULES_LINK_SEAT_AUCTION_TEXT',
            'subtitle': 'MODULES_LINK_GET_BETTER_SEAT_TEXT',
            'accessibilityText': 'MODULES_LINK_GET_BETTER_SEAT_TEXT'
        }
    }

    let fakeEmergencyContactDataOutput = {
        'colSize': 'col-md-6 col-lg-12 col-xl-6 col-xs-12',
        'boxSize': 'ib-box-menu__section--full',
        'icon': 'icon-mensajes',
        'linkId': 'emergencyContact',
        'flags': false,
        'text': {
            'title': 'MODULES_LINK_EMERGENCY_CONTACT_TEXT',
            'subtitle': 'MODULES_LINK_ADD_FOR_POSSIBLE_UNEXPECTED_TEXT',
            'accessibilityText': 'MODULES_LINK_ADD_FOR_POSSIBLE_UNEXPECTED_TEXT'
        }
    }

    let fakeEmergencyContactDataOutputTest2 = {
        'colSize': 'col-md-6 col-lg-12 col-xl-6 col-xs-12',
        'boxSize': 'ib-box-menu__section--full',
        'icon': 'icon-mensajes',
        'linkId': 'emergencyContact',
        'flags': false,
        'text': {
            'title': 'MODULES_LINK_EMERGENCY_CONTACT_TEXT',
            'subtitle': 'MODULES_LINK_ADD_FOR_POSSIBLE_UNEXPECTED_TEXT',
            'accessibilityText': 'MODULES_LINK_ADD_FOR_POSSIBLE_UNEXPECTED_TEXT'
        }
    }


    let fakeModelOrder = {
        'orders': [
            {
                'flag': {
                    'enabled': false
                }
            },
            {
                'flag': {
                    'enabled': false
                }
            },
            {
                'flag': {
                    'enabled': false
                }
            }
        ]
    }

    let fakeBookingDashboardConstants = {
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
    let fakeMmBAppConstants = {
        QUADRIGAM: {
            'PASSENGER_DATA': 'test'
        },
        TOGGLE: {
            isActiveUmnr: true
        }
    }
    let fakeDatalayerUtilsService = {
        updateDatalayerWithQuadrigam: jasmine.createSpy('updateDatalayerWithQuadrigam').and.callFake(angular.noop),
        sendDatalayerEvent: jasmine.createSpy(),
        updateDigitalDataWithQuadrigam: jasmine.createSpy(),
        updateDatalayerViewEvent: jasmine.createSpy(),
        setProcessAndStep: jasmine.createSpy(),
        updateLoggedDatalayer: jasmine.createSpy(),
        updateLoggedDigitalData: jasmine.createSpy(),
        updateDatalayerInfo: jasmine.createSpy()
    }
    let fakeDatalayerConstants = {
        DATALAYER_EVENT_TYPES: { 'VIEW': 'view' },
        DATALAYER_INFO: {
            'DEPARTURE_AIRPORT': 'aeropuertoOrigen', 'ARRIVAL_AIRPORT': 'aeropuertoDestino', 'TOTAL_AVAILABILITY': 'resultadosBusqueda',
            'DEPARTURE_TIME': 'horarioSalida', 'IS_AIR_SHUTTLE': 'puenteAereo'
        },
        DATALAYER_VALUES: { 'YES': 'SI' },
        DIGITAL_DATA_PROCESS:{
            MODPAX: 'servicing'
        },
        DIGITAL_DATA_STEP: {
            MODPAX: 'info pasajeros'
        }

    };

    let fakeCommonsUtilService = {
        'setTitlePage': jasmine.createSpy(),
    };

    let fakeIbMmbUmnrUtilsService = {
            isActiveUMNR: jasmine.createSpy(),
            isDataUmnrCompleted: jasmine.createSpy(),
        };

    beforeEach(() => {
        angular.mock.module('ib-MmB-passengers-tab-module', 'LocalStorageModule', ($provide) =>{
            $provide.value('BookingDashboardConstants', fakeBookingDashboardConstants);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('MMBDatalayerConstants', fakeDatalayerConstants);
            $provide.value('CommonsUtilService', fakeCommonsUtilService);
            $provide.value('IbMmbUmnrUtilsService', fakeIbMmbUmnrUtilsService);
        });
        inject(($componentController, _$rootScope_) => {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            controller = $componentController('ibMmbPassengersTabComponent', { $scope: $scope });
        });
    });

    describe('when activate() function is called', () => {

        it('should set correctValue to seatAuctionData and emergencyContactData )', () => {
            controller.model = fakeModelOrder;
            controller.bid = {bidable : true};
            controller.$onInit();
            expect(angular.toJson(controller.seatsAuctionData)).toEqual(angular.toJson(fakeSeatsAuctionDataOutput));
            expect(angular.toJson(controller.emergencyContactData)).toEqual(angular.toJson(fakeEmergencyContactDataOutput));
        });

        it('should set correctValue to seatAuctionData and emergencyContactData )', () => {
            controller.model = fakeModelOrder;
            controller.bid = {bidable : false};
            controller.hide = true;
            controller.$onInit();
            expect(angular.toJson(controller.seatsAuctionData)).toEqual(angular.toJson(fakeSeatsAuctionDataOutput2));
            expect(angular.toJson(controller.emergencyContactData)).toEqual(angular.toJson(fakeEmergencyContactDataOutputTest2));
        });

    });

    describe('when confirmEmergencyContact() function is called', () => {

        it('should set correctValue to model variables )', () => {
            message = {
                'name' : 'test',
                'phone' : 'dsdasd'
            }
            controller.seatsAuctionData = {'colSize' : 'test'};
            $rootScope.$broadcast('confirmEmergencyContact', message);
            expect(controller.seatsAuctionData.colSize).toEqual('col-md-6 col-lg-12 col-xl-6 col-xs-12');
            expect(controller.hide).toEqual(true);
        });

        it('should set correctValue to model variables )', () => {
            message = {
                'name' : '',
                'phone' : ''
            }
            controller.seatsAuctionData = {'colSize' : 'test'};
            $rootScope.$broadcast('confirmEmergencyContact', message);
            expect(controller.seatsAuctionData.colSize).toEqual('col-md-6 col-lg-12 col-xl-6 col-xs-12');
            expect(controller.hide).toEqual(false);
        });

    });

    describe('when changeContactInfo () function is called', () => {
        it('should set correctValue to model)', () => {
            controller.model = {
                passengers : [
                    {
                        contactInfo : ''
                    }
                ]
            }
            $rootScope.$broadcast('changeContactInfo', {},0);
            expect(controller.model.passengers[0].contactInfo).toEqual({});
        });
    });

});
