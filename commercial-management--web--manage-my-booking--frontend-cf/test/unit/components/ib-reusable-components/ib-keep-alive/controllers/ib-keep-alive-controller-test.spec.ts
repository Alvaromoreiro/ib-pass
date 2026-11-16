describe('IbKeepAliveController test', () => {
    var controller, $scope, $rootScope, $controller, localStorage, $interval;

    var fakeCommercialInfo = {
        'sessionTimeLifeInMinutes': 50
    };

    var fakeDatalayerConstants = {
        DATALAYER_EVENT_TYPES: {
            VIEW: 'VIEW'
        },
        DIGITAL_DATA_PROCESS: {
            ATCFCNA: 'test',
            CVFFOW: 'test',
            ATCFOW: 'test',
            CVFFRT: 'test'
        },
        DIGITAL_DATA_STEP: {
            ATCFCNA: 'test',
            CVFFOW: 'test',
            ATCFOW: 'test',
            CVFFRT: 'test'
        },
        FLOWS: {
            SHUTTLE: 'ibshuttle',
            PASSENGERS: 'ibairp',
            ANCILLARIES: 'ibcmtv',
            PAYMENTS: 'ibpurc',
            CONFIRMATION: 'confirmation'
        },
        QUADRIGAMS: {
            LANDING_FLASH: 'FLASHO',
            DETAILS_FLASH: 'FLASHD',
            SHUTTLE_HOME: 'PAHOME',
            SHUTTLE_PASSENGERS: 'PAHMPA',
            SHUTTLE_PASSENGERS_CODE: 'PAAIRP',
            SHUTTLE_REDEMPTION_PASSENGERS: 'RPAAIRP',
            SHUTTLE_PAYMENTS: 'PAPURC',
            SHUTTLE_REDEMPTION_PAYMENTS: 'RPAPURC',
            SHUTTLE_CONFIRMATION: 'PABKCF',
            SHUTTLE_REDEMPTION_CONFIRMATION: 'RPABKCF',
            CKI_SESSION_EXPIRED: 'CKIEXP',
            MMB_SESSION_EXPIRED: 'MMBEXP'
        }
    };

    var fakeMmBAppConstants = {
        QUADRIGAM: {
            STOP_OVER: 'STOP_OVER',
            COMPLETE_TRAVEL: 'COMPLETE_TRAVEL',
            FLEXIBILIZATION_SEARCH_ONE_WAY: 'FLEXIBILIZATION_SEARCH_ONE_WAY',
            CHANGE_FLIGHTS_SARCH_ONE_WAY: 'CHANGE_FLIGHTS_SARCH_ONE_WAY',
            FLEXIBILIZATION_SEARCH_WITH_RETURN: 'FLEXIBILIZATION_SEARCH_WITH_RETURN',
            CHANGE_FLIGHTS_SEARCH_WITH_RETURN: 'CHANGE_FLIGHTS_SEARCH_WITH_RETURN',

        },
        PNR_EMITION_CHANNEL: {
            FLEX_FLIGHT_DIRECT: [
                'IBCOM',
                'CALL_CENTER',
                'NDC_DIRECT'
            ],
            FLEX_FLIGHT_INDIRECT: [
                'NDC_INDIRECT',
                'OTHER',
            ],
        },
        ORDER_ITEMS_TYPE_TO_AVOID: ['baggage', 'specialEquipment', 'flexibilityOnDemand', 'priorityBoarding'],
        COMMON_LABELS: {
            CHANNEL: {
                IBCOM: {
                    'VALUE': 'MMB_DISRUPTION_CALLCENTER_CONTACT_MSG',
                    'PHONE': true
                },
                NDC_DIRECT: {
                    'VALUE': 'MMB_DISRUPTION_CALLCENTER_CONTACT_MSG',
                    'PHONE': true
                },
                NDC_INDIRECT: {
                    'VALUE': 'MMB_DISRUPTION_AGENCY_CONTACT_MSG',
                    'PHONE': false
                },
                CALL_CENTER: {
                    'VALUE': 'MMB_DISRUPTION_CALLCENTER_CONTACT_MSG',
                    'PHONE': true
                },
                OTHER: {
                    'VALUE': 'MMB_DISRUPTION_AGENCY_CONTACT_MSG',
                    'PHONE': false
                },
                DEFAULT: {
                    'VALUE': 'MMB_DISRUPTION_CALLCENTER_CONTACT_MSG',
                    'PHONE': true
                }
            }
        },
        WCS: {
            'PHONE_TYPES': {
                'SALES': 'RESERVAS',
                'IBHOLIDAYS': 'ATTBAH'
            }
        }
    };

    var fakeDatalayerUtilsService = {
        updateDatalayerWithQuadrigam: jasmine.createSpy('updateDatalayerWithQuadrigam').and.callFake(angular.noop),
        sendDatalayerEvent: jasmine.createSpy(),
        updateDigitalDataWithQuadrigam: jasmine.createSpy(),
        updateDatalayerViewEvent: jasmine.createSpy(),
        setProcessAndStep: jasmine.createSpy(),
        removeProcessAndStep: jasmine.createSpy(),
        updateDatalayerInfo: jasmine.createSpy()
    };

    var fakeCommonsUtilService = {
        'setTitlePage': jasmine.createSpy()
    }

    var fakeMmBUtilsSharedService = {
        'updateQuadrigam': jasmine.createSpy(),
        'getProcessByStatus':  jasmine.createSpy('getProcessByStatus').and.callFake(() =>  {
            return 'test'
        }),
    };

    var fakeBookingInfo = {
        'order' : {
            'status': 'UNCONFIRMED_CHANGES'
        }
    };

    beforeEach(() => {
        angular.mock.module('ib-reusable-components-module', 'LocalStorageModule', function($provide) {
            $provide.value('MMBDatalayerConstants', fakeDatalayerConstants);
            $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('CommonsUtilService', fakeCommonsUtilService);
            $provide.value('MmBUtilsSharedService', fakeMmBUtilsSharedService);
        });

        inject(function(_$controller_, _$rootScope_, _localStorageService_, _$interval_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $interval = _$interval_;
            $scope = $rootScope.$new();
            localStorage = _localStorageService_;
            localStorage.set('bookingInfo', fakeBookingInfo);
            controller = $controller('IbKeepAliveController', {
                $scope: $scope,
                $rootScope: $rootScope
            });
        });
    });

    describe('When activate is called', () => {
        it('Set timer variables values', (done) =>  {
            $rootScope.timeSession = {
                'startTime': 100
            };
            localStorage.set('commercialInfo', fakeCommercialInfo);
            controller.$onInit();
            expect(controller.timerActivate).not.toBe(0);
            expect(controller.timerTime).not.toBe(0);
            done();
        });
    });

    describe('When timerStopped is called', () => {
        it('timerActivated set false', (done) =>  {
            controller.timerStopped();
            expect(controller.timerActivate).toBeFalsy();
            done();
        });
    });

    describe('When setDigitalData is called', () => {
        it('should set correct title, proccess and step', (done) => {
            controller.setDigitalData(fakeDatalayerConstants.QUADRIGAMS.MMB_SESSION_EXPIRED);
            expect(fakeDatalayerUtilsService.updateDatalayerInfo).toHaveBeenCalled();
            done();
        });
    });

    describe('When countDownKeepAlive is called with differents maxTimeUnit', () => {
        it('should set correct values to maxTimeUnit day', (done) =>  {
            $rootScope.timeSession = { startTime: 100 };
            localStorage.set('commercialInfo', fakeCommercialInfo);
            controller.maxTimeUnit = 'day';
            controller.timerTime = 0;
            controller.$onInit();
            $interval.flush(1000);
            expect(controller.maxTimeUnit).toBe('day');
            done();
        });

        it('should set correct values to maxTimeUnit hour', (done) =>  {
            $rootScope.timeSession = { startTime: 100 };
            localStorage.set('commercialInfo', fakeCommercialInfo);
            controller.maxTimeUnit = 'hour';
            controller.timerTime = 0;
            controller.$onInit();
            $interval.flush(1000);
            expect(controller.maxTimeUnit).toBe('hour');
            done();
        });

        it('should set correct values to maxTimeUnit minute', (done) =>  {
            $rootScope.timeSession = { startTime: 100 };
            localStorage.set('commercialInfo', fakeCommercialInfo);
            controller.maxTimeUnit = 'minute';
            controller.timerTime = 0;
            controller.$onInit();
            $interval.flush(1000);
            expect(controller.maxTimeUnit).toBe('minute');
            done();
        });

        it('should set correct values to maxTimeUnit second', (done) =>  {
            $rootScope.timeSession = { startTime: 100 };
            localStorage.set('commercialInfo', fakeCommercialInfo);
            controller.maxTimeUnit = 'second';
            controller.timerTime = 0;
            controller.$onInit();
            $interval.flush(1000);
            expect(controller.maxTimeUnit).toBe('second');
            done();
        });
    });
});
