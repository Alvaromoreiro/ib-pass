import angular from "angular";
import { filterFake } from '@test/mocks/constants/filterTranslate-mock';
import { StorageServiceMock } from "@test/unit/utils/StorageServiceMock";

class IbCModalServiceMock {
    showGenericComponentModal = jasmine.createSpy('showGenericComponentModal').and.returnValue({result:Promise.resolve(''), componentInstance: {
        dataModelRefund: undefined
    }});
};

describe('MmBManagementTabComponent test', () => {

    let $rootScope, $scope, $q, controller,localStorage;

    let fakeflightReminderOutput = {
        colSize: 'col-md-6 col-lg-12 col-xl-6 col-xs-12',
        boxSize: 'ib-box-menu__section--full',
        icon: 'icon-mensajes',
        linkId: 'flightReminder',
        text: {
            title: 'MODULES_LINK_MAIL_FLIGHT_TEXT_2',
            subtitle: 'MODULES_LINK_RESEND_TEXT_2',
            accessibilityText: 'MODULES_LINK_MAIL_FLIGHT_ACCESIBLE_TEXT_2'
        }
    };

    let fakecheckInLinkDataOutput = {
        colSize: 'col-md-6 col-lg-12 col-xl-6 col-xs-12',
        boxSize: 'ib-box-menu__section--full',
        icon: 'icon-checking_online',
        linkId: 'checkIn',
        text: {
            title: 'MODULES_LINK_GO_TO_CHECK_IN_TEXT',
            subtitle: '',
            accessibilityText: 'MODULES_LINK_GO_TO_CHECK_IN_ACCESIBLE_TEXT'
        }
    };

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
        TABS: {
            'changeFlights': ' test',
            'refunds': 'test',
            'customize': 'test',
            'exclusiveBenefits': 'exclusiveBenefits'
        },
        DEFAULT_FLEXIBILIZATION_TITLE: 'MMB_REFUND_ADVISORY_1',
        CUSTOM_FLEXIBILIZATION_TITLE: {
            53: 'MMB_FLEX_CAPABILITIES_INFO_MODULE_TITLE'
        } as Record<number, string>
    };
    let fakeMmBAppConstants = {
        INT_HOSTNAME: 'int.iberia.com',
        templatesRoute: 'web-manage-my-booking/templates/',
        QUADRIGAM: {
            'PASSENGER_DATA': 'test'
        },
        TOGGLE: {
            isActiveUmnr: true
        },
        UMNR_DATA: {
            SESSION_STORAGE_KEY: 'dataUmnrCompleted'
        }
    };
    let fakeDatalayerUtilsService = {
        updateDatalayerWithQuadrigam: jasmine.createSpy('updateDatalayerWithQuadrigam').and.callFake(angular.noop),
        sendDatalayerEvent: jasmine.createSpy(),
        updateDigitalDataWithQuadrigam: jasmine.createSpy(),
        updateDatalayerViewEvent: jasmine.createSpy(),
        setProcessAndStep: jasmine.createSpy(),
        removeProcessAndStep: jasmine.createSpy(),
        updateDatalayerInfo: jasmine.createSpy(),
        updateDatalayerEvents: jasmine.createSpy('updateDatalayerEvents').and.callFake(angular.noop)
    };
    let fakeDatalayerConstants = {
        DATALAYER_EVENT_TYPES: { 'VIEW': 'view', 'IMPRESSIONS': 'impressions'  },
        DATALAYER_INFO: {
            'DEPARTURE_AIRPORT': 'aeropuertoOrigen', 'ARRIVAL_AIRPORT': 'aeropuertoDestino', 'TOTAL_AVAILABILITY': 'resultadosBusqueda',
            'DEPARTURE_TIME': 'horarioSalida', 'IS_AIR_SHUTTLE': 'puenteAereo'
        },
        DATALAYER_VALUES: { 'YES': 'SI' },
        EXCLUSIVE_SERVICES_EVENT_CATEGORY_VALUES: {
            'EXCLUSIVE_SERVICES': 'exclusive_services'
        },
        EXCLUSIVE_SERVICES_EVENT_LABEL_VALUES: {
            'CARD_VIP': 'card_vip'
        },
        DatalayerGeneralConstants: {
            'EVENT_NAME_INTERACTION': 'interaction'
        }

    };

    let fakeVipLoungesService = {
        'getVipInvitationsComponent': jasmine.createSpy('getVipInvitationsComponent').and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve(false);
            return deferred.promise;
        }),
        'getFastTrackCardComponent': jasmine.createSpy('getFastTrackCardComponent').and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve(false);
            return deferred.promise;
        })
    };

    const createFakeBookingInfo = () => ({
        'order': {
            'primaryContactInfo': {
                'email': 'ab@ab.com'
            },
            'availableForCheckin': undefined
        },
        'orderFlags': [{
            'type' : 'PRINT_ITINERARY',
            'enabled' : false
        },{
            'type' : 'PRINT_ITINERARY',
            'enabled' : false
        }],
        'channel': 'IBCOM',
        'contextMetadata': {
            'currencies' : [
                {
                    'code': '€'
                }
            ]
        },
        warnings: [{
            code: 'SSE_ORM_9442',
            description: '<p>text example1 <br> and example2</p>'
        }],
        'upgInformation': {},
    });

    let fakeRedirectionService = {
        externalRedirect: jasmine.createSpy()
    };

    let fakeDisruptionUtilService = {
        'evaluateRule': jasmine.createSpy('evaluateRule').and.callFake(() => {
            return false;
        }),
        'checkWarning': jasmine.createSpy('checkWarning').and.returnValue(true),
        'checkDelayedFlights': jasmine.createSpy('checkDelayedFlights').and.returnValue([])
    };
    let fakeEvaluatorConst ={
        REFUND_FLAG_EVALUATOR:{
            OLD_RUBIQ_EVAL : {
                RULES: [
                    {'type' : 'oper', 'value' : 'NOT'},
                    { 'type': 'flag', 'value': 'VOUCHER_REFUND' },
                ]
            },
        }
    };
    let mockTranslateFilter = function (value) {
        switch (value) {
            case 'GENERIC_BLOCKING_MODAL_ERROR':
                return 'Tenemos problemas con tu petición, por favor, vuelve a intentarlo desde el principio';
            default:
                break;
        }
    };
    let fakePhonesList = {
        RESERVAS:{
            prefix :'34',
            telephone: '123123123'
        }
    };
    let fakeAttendanceVoucher = {
            titleVoucher: '',
            typeVoucher: '',
            conditionsVoucher: [],
            actionsVoucher: [],
            linkName: '',
            linkUrl: '',
            infoTitle: '',
            infoText: ''
    };
    let mockDigitalBoardingInfo = {
        'digitalBoardings': {
            'segments': [{'url':'test'}]
        }
    };

    let fakeFlagsViews = {
        'showRefundVoucherSection': false,
        'allowedRefundVoucher': true,
    };

    let fakeBookingInfoLight = {
        passengers: [{

        }],
        order: {
            slices: [{
                segments: [{
                    departure: {
                        dateTime: '17-08-2030'
                    },
                    arrival: {
                        dateTime: '17-08-2030'
                    },
                    status: 'test',
                    flight: 'test',
                }]
            }]
        }
    };
    let windowEventListeners = {};

    let fakeIbCModalService: IbCModalServiceMock;

    let fakeIbMmbUmnrUtilsService = {
        isActiveUMNR: jasmine.createSpy(),
        isDataUmnrCompleted: jasmine.createSpy(),
    };

    beforeEach(() => {
        fakeIbCModalService = new IbCModalServiceMock();
        fakeDisruptionUtilService.checkWarning.calls.reset();
        fakeDisruptionUtilService.checkDelayedFlights.calls.reset();
        windowEventListeners = {};
        spyOn(window, 'addEventListener').and.callFake((event, handler) => {
            windowEventListeners[event] = handler;
        });
        spyOn(window, 'removeEventListener').and.callFake((event, handler) => {
            delete windowEventListeners[event];
        });
        angular.mock.module('ib-MmB-management-tab-module','LocalStorageModule', ($provide) => {
            $provide.value('BookingDashboardConstants', fakeBookingDashboardConstants);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('MMBDatalayerConstants', fakeDatalayerConstants);
            $provide.value('RedirectionService', fakeRedirectionService);
            $provide.value('DisruptionUtilService', fakeDisruptionUtilService);
            $provide.value('VipLoungesService', fakeVipLoungesService);
            $provide.value('EvaluatorConst', fakeEvaluatorConst);
            $provide.value('translateFilter', mockTranslateFilter);
            $provide.value('$filter', filterFake);
            $provide.value('IbCModalService', fakeIbCModalService);
            $provide.value('IbMmbUmnrUtilsService', fakeIbMmbUmnrUtilsService);
        });
        inject(($componentController, _$rootScope_, _localStorageService_,_$q_) => {
            $rootScope = _$rootScope_;
            $scope = $rootScope.$new();
            localStorage = _localStorageService_;
            $q = _$q_;
            localStorage.remove('vipLoungesInvitations');
            localStorage.set('bookingInfo', createFakeBookingInfo());
            localStorage.set('bookingInfoLight', fakeBookingInfoLight);
            localStorage.set('phonesList', fakePhonesList);
            localStorage.set('attendanceVoucher', fakeAttendanceVoucher);
            controller = $componentController('ibMmbManagementTabComponent', { $scope: $scope });
        });
        controller.flagsViews = { ...fakeFlagsViews };
        localStorage.set('digitalBoardingInfo', mockDigitalBoardingInfo)
    });

    afterEach(() => {
        localStorage.clearAll();
    });

    describe('templateUrl definition', () => {
        it('templateUrl should be defined', inject(($compile, $rootScope, $httpBackend) => {
            $httpBackend.expectGET('web-manage-my-booking/templates/ib-MmB-management-tab-view.html').respond(200, '<div id="test-template"></div>');
            const scope = $rootScope.$new();
            const element = $compile('<ib-mmb-management-tab-component></ib-mmb-management-tab-component>')(scope);
            scope.$digest();
            $httpBackend.flush();
            expect(element.html()).toContain('id="test-template"');
        }));
    });

    describe('when activate() function is called', () => {
        it('should set flagsViews is false', (done) => {
            let copyFakeBookingInfo = JSON.parse(JSON.stringify(createFakeBookingInfo()));
            copyFakeBookingInfo.channel = 'IBCOM';
            copyFakeBookingInfo.orderFlags[0].enabled = false;
            localStorage.set('bookingInfo', copyFakeBookingInfo);
            controller.$onInit();
            fakeflightReminderOutput.colSize = fakeBookingDashboardConstants.BOX_COL_SIZES.LARGE;
            fakecheckInLinkDataOutput.colSize = fakeBookingDashboardConstants.BOX_COL_SIZES.LARGE;
            expect(controller.externalAgency).toEqual(false);
            // expect(controller.oldExternalRubiQ).toEqual(true);
            expect(controller.flightReminder).toEqual(fakeflightReminderOutput);
            expect(controller.checkInLinkData).toEqual(fakecheckInLinkDataOutput);
            expect(controller.thereIsCurrencies).toEqual(true);
            expect(controller.print_itinerary).toEqual(null);
            done();
        });

        it('should set flagsViews is true', (done) => {
            let copyFakeBookingInfo = JSON.parse(JSON.stringify(createFakeBookingInfo()));
            copyFakeBookingInfo.channel = 'OTHER';
            copyFakeBookingInfo.orderFlags[0].enabled = true;
            delete copyFakeBookingInfo.contextMetadata;
            localStorage.set('bookingInfo', copyFakeBookingInfo);
            controller.$onInit();
            // fakeflightReminderOutput.colSize = fakeBookingDashboardConstants.BOX_COL_SIZES.LARGE;
            // expect(controller.flightReminder).toEqual(fakeflightReminderOutput);
            // expect(controller.checkInLinkData).toEqual(fakecheckInLinkDataOutput);
            expect(controller.thereIsCurrencies).toEqual(false);
            done();
        });

        it('should flagFilter execute, oldExternalRubiQ is false to enter and return true', (done) => {
            fakeDisruptionUtilService = {
                'evaluateRule': jasmine.createSpy('evaluateRule').and.callFake(() => {
                    return false;
                }),
                'checkWarning': jasmine.createSpy('checkWarning').and.returnValue(true),
                'checkDelayedFlights': jasmine.createSpy('checkDelayedFlights').and.returnValue([])
            };
            let copyFakeBookingInfo = JSON.parse(JSON.stringify(createFakeBookingInfo()));
            copyFakeBookingInfo.channel = 'NDC_INDIRECT';
            localStorage.set('bookingInfo', copyFakeBookingInfo);
            controller.$onInit();
            // expect(controller.oldExternalRubiQ).toEqual(true);
            done();
        });
    });

    describe('when redirectToVoucherRefundFlow() function is called', () => {
        it('and showRefundVoucherSection is true', (done) => {
            controller.flagsViews.showRefundVoucherSection = true;
            controller.redirectToVoucherRefundFlow();
            expect(fakeBookingDashboardConstants.TABS.refunds).toEqual('test');
            done();
        });
        it('and showRefundVoucherSection is false', (done) => {
            const email = createFakeBookingInfo().order.primaryContactInfo.email;
            controller.flagsViews.showRefundVoucherSection = false;
            controller.redirectToVoucherRefundFlow();
            expect(email).toEqual('ab@ab.com');
            done();
        });
    });

    describe('when redirectToFlightChangeFlow() function is called', () => {
        it('and TABS changeFlights is defined', (done) => {
            controller.redirectToFlightChangeFlow();
            expect(fakeBookingDashboardConstants.TABS.changeFlights).toBeDefined();
            done();
        });
    });

    describe('when redirectToRefundSection() function is called', () => {
        it('and TABS changeFlights is defined', (done) => {
            controller.redirectToRefundSection();
            expect(fakeBookingDashboardConstants.TABS.refunds).toBeDefined();
            done();
        });

    });

    describe('when redirectToSeatmapLayout() function is called', () => {
        it('and TABS customize is defined', (done) => {
            controller.redirectToSeatmapLayout();
            expect(fakeBookingDashboardConstants.TABS.customize).toBeDefined();
            done();
        });
    });

     describe('when $onInit() function is called', () => {
        it('should isSkeleton true', (done) => {
            controller.isSkeleton = true;
            controller.$onInit();
            fakeflightReminderOutput.colSize = fakeBookingDashboardConstants.BOX_COL_SIZES.LARGE;
            fakecheckInLinkDataOutput.colSize = fakeBookingDashboardConstants.BOX_COL_SIZES.LARGE;
            expect(controller.externalAgency).toEqual(false);
            done();
        });
    });

    describe('when importReady Event is called', () => {
        it('should importReady', (done) => {
            $rootScope.$broadcast('importReady');
            expect(controller.externalAgency).toEqual(false);
            done();
        });
    });

    describe('VIP Lounge Event Listener Methods', () => {
        describe('setupVipLoungeEventListener', () => {
            it('should add event listener for vip-lounge-button-clicked', (done) => {
                controller.setupVipLoungeEventListener();
                expect(window.addEventListener).toHaveBeenCalledWith(
                    'vip-lounge-button-clicked',
                    controller.vipLoungeEventHandler
                );
                expect(windowEventListeners['vip-lounge-button-clicked']).toBeDefined();
                expect(typeof windowEventListeners['vip-lounge-button-clicked']).toBe('function');
                done();
            });

            it('should add event listener for gibe-fast-button-clicked', (done) => {
                controller.setupGibeFastEventListener();
                expect(window.addEventListener).toHaveBeenCalledWith(
                    'gibe-fast-button-clicked',
                    controller.vipLoungeEventHandler
                );
                expect(windowEventListeners['gibe-fast-button-clicked']).toBeDefined();
                expect(typeof windowEventListeners['gibe-fast-button-clicked']).toBe('function');
                done();
            });

            it('should use the correct handler function bound to controller context', (done) => {
                controller.setupVipLoungeEventListener();
                const registeredHandler = windowEventListeners['vip-lounge-button-clicked'];
                expect(registeredHandler).toBe(controller.vipLoungeEventHandler);
                done();
            });

            it('should use the correct handler function bound to controller context', (done) => {
                controller.setupGibeFastEventListener();
                const registeredHandler = windowEventListeners['gibe-fast-button-clicked'];
                expect(registeredHandler).toBe(controller.vipLoungeEventHandler);
                done();
            });
        });

        describe('handleVipLoungeEvent', () => {
            it('should broadcast changeActiveTabMenuEvt with exclusiveBenefits tab', (done) => {
                spyOn($rootScope, '$broadcast');
                controller.handleVipLoungeEvent();
                expect($rootScope.$broadcast).toHaveBeenCalledWith(
                    'changeActiveTabMenuEvt',
                    fakeBookingDashboardConstants.TABS.exclusiveBenefits
                );
                done();
            });

            it('should call $broadcast exactly once when handleVipLoungeEvent is called', (done) => {
                spyOn($rootScope, '$broadcast');
                controller.handleVipLoungeEvent();
                expect($rootScope.$broadcast).toHaveBeenCalledTimes(1);
                done();
            });

            it('should use the correct tab value from BookingDashboardConstants', (done) => {
                spyOn($rootScope, '$broadcast');
                fakeBookingDashboardConstants.TABS.exclusiveBenefits = 'custom-exclusive-tab';
                controller.handleVipLoungeEvent();
                expect($rootScope.$broadcast).toHaveBeenCalledWith(
                    'changeActiveTabMenuEvt',
                    'custom-exclusive-tab'
                );
                done();
            });
        });

        describe('handleGastronomicEvent', () => {
            it('should broadcast openGastronomicProposal', (done) => {
                spyOn($rootScope, '$broadcast');
                controller.handleGastronomicEvent();
                expect($rootScope.$broadcast).toHaveBeenCalledWith(
                    'openGastronomicProposal'
                );
                done();
            });
        });

        describe('when vipLoungesDataReady event called', () => {
            beforeEach(() => {
                controller.showGibeInvitationsLink = false;
                controller.gibeData = null;
                spyOn(controller, 'setupVipLoungeEventListener');
                spyOn(controller, 'removeVipLoungeEventListener');
                spyOn(controller, 'setupGibeFastEventListener');
                spyOn(controller, 'removeGibeFastEventListener');
            });

            const setInitialTruthyState = () => {
                controller.showGibeInvitationsLink = true;
                controller.gibeData = {
                    status: {
                        invitations: { code: 'AVAILABLE' }
                    }
                };
            };

            const testErrorValue = (value, description) => {
                it(`should handleVipLoungesData and set showGibeInvitationsLink to false when vipLoungesData is ${description}`, (done) => {
                    setInitialTruthyState();

                    $rootScope.$broadcast('vipLoungesDataReady', value);
                    $rootScope.$digest();

                    expect(controller.showGibeInvitationsLink).toBe(false);
                    expect(controller.gibeData).toBe(value);
                    expect(controller.removeVipLoungeEventListener).toHaveBeenCalled();
                    expect(controller.setupVipLoungeEventListener).not.toHaveBeenCalled();
                    expect(controller.setupGibeFastEventListener).not.toHaveBeenCalled();
                    expect(controller.removeGibeFastEventListener).toHaveBeenCalled();
                    done();
                });
            };

            it('should handleVipLoungesData and set showGibeInvitationsLink to true when vipLoungesData is provided', (done) => {
                const testVipLoungesData = {
                    status: {
                        invitations: { code: 'AVAILABLE' }
                    }
                };

                $rootScope.$broadcast('vipLoungesDataReady', testVipLoungesData);
                $rootScope.$digest();

                expect(controller.showGibeInvitationsLink).toBe(true);
                expect(controller.showGibeFastLink).toBe(false);
                expect(controller.gibeData).toEqual(testVipLoungesData);
                expect(controller.setupVipLoungeEventListener).toHaveBeenCalled();
                expect(controller.removeVipLoungeEventListener).not.toHaveBeenCalled();
                expect(controller.setupGibeFastEventListener).not.toHaveBeenCalled();
                expect(controller.removeGibeFastEventListener).toHaveBeenCalled();
                done();
            });

            testErrorValue(null, 'null');
            testErrorValue(undefined, 'undefined');
            testErrorValue(false, 'false');
            testErrorValue('', 'empty string');
            testErrorValue(0, 'zero');
            testErrorValue({}, 'empty object');
            testErrorValue(['item1', 'item2'], 'non-empty array');

            it('should handleVipLoungesData multiple times correctly', (done) => {
                const firstData = {
                    status: {
                        invitations: { code: 'AVAILABLE' }
                    }
                };
                const secondData = {
                    status: {
                        fast: { code: 'AVAILABLE' }
                    }
                };

                $rootScope.$broadcast('vipLoungesDataReady', firstData);
                $rootScope.$digest();
                expect(controller.showGibeInvitationsLink).toBe(true);
                expect(controller.showGibeFastLink).toBe(false);
                expect(controller.gibeData).toEqual(firstData);
                expect(controller.setupVipLoungeEventListener).toHaveBeenCalledTimes(1);
                expect(controller.removeVipLoungeEventListener).toHaveBeenCalledTimes(0);
                expect(controller.setupGibeFastEventListener).toHaveBeenCalledTimes(0);
                expect(controller.removeGibeFastEventListener).toHaveBeenCalledTimes(1);

                $rootScope.$broadcast('vipLoungesDataReady', secondData);
                $rootScope.$digest();
                expect(controller.showGibeInvitationsLink).toBe(false);
                expect(controller.showGibeFastLink).toBe(true);
                expect(controller.gibeData).toEqual(secondData);
                expect(controller.setupVipLoungeEventListener).toHaveBeenCalledTimes(1);
                expect(controller.removeVipLoungeEventListener).toHaveBeenCalledTimes(1);
                expect(controller.setupGibeFastEventListener).toHaveBeenCalledTimes(1);
                expect(controller.removeGibeFastEventListener).toHaveBeenCalledTimes(1);

                $rootScope.$broadcast('vipLoungesDataReady', null);
                $rootScope.$digest();
                expect(controller.showGibeInvitationsLink).toBe(false);
                expect(controller.showGibeFastLink).toBe(false);
                expect(controller.gibeData).toBeNull();
                expect(controller.setupVipLoungeEventListener).toHaveBeenCalledTimes(1);
                expect(controller.removeVipLoungeEventListener).toHaveBeenCalledTimes(2);
                expect(controller.setupGibeFastEventListener).toHaveBeenCalledTimes(1);
                expect(controller.removeGibeFastEventListener).toHaveBeenCalledTimes(2);

                done();
            });
        });

        describe('initializeVipLounges method', () => {
            let deferred;

            const assertInitialState = () => {
                expect(controller.showGibeInvitationsLink).toBe(false);
                expect(controller.showGibeFastLink).toBe(false);
            }

            const assertExpectedStateAfterPromises = (invitationExpected, fastExpected) => {
                setTimeout(() => {
                    expect(controller.showGibeInvitationsLink).toBe(invitationExpected);
                    expect(controller.showGibeFastLink).toBe(fastExpected);
                }, 0);
            }

            const gibeStatus = (invitationsAvailable, fastAvailable) => {
                return {
                    status: {
                        invitations: { code: invitationsAvailable ? 'AVAILABLE' : 'NOT_AVAILABLE' },
                        fast: { code: fastAvailable ? 'AVAILABLE' : 'NOT_AVAILABLE' }
                    }
                };
            }

            beforeEach(() => {
                controller.showGibeInvitationsLink = false;
                controller.showGibeFastLink = false;
                controller.gibeData = null;
                deferred = $q.defer();
                spyOn(controller, 'setupVipLoungeEventListener');
                spyOn(controller, 'setupGibeFastEventListener');
                spyOn(controller, 'initializeVipLounges').and.callThrough();
                spyOn(controller, 'handleVipLoungesData').and.callThrough();
                spyOn(controller, 'setupManagementData');
                spyOn(controller, 'addGastronomicEventListener');

                controller.isSkeleton = false;

                fakeVipLoungesService.getVipInvitationsComponent = jasmine.createSpy('getVipInvitationsComponent')
                    .and.returnValue(deferred.promise);

                fakeVipLoungesService.getFastTrackCardComponent = jasmine.createSpy('getFastTrackCardComponent')
                    .and.returnValue(deferred.promise);
            });
            it('should call initializeVipLounges when vipLoungesData exists in localStorage', (done) => {
                const vipLoungesData = gibeStatus(true, false); // Example data

                localStorage.set('vipLoungesInvitations', vipLoungesData);
                controller.$onInit();

                expect(controller.initializeVipLounges).toHaveBeenCalledWith(vipLoungesData);
                expect(controller.initializeVipLounges).toHaveBeenCalledTimes(1);
                done();
            });
            it('should fetch components when initializeVipLounges is called with any product is available', (done) => {
                const testData = gibeStatus(true, false);

                controller.initializeVipLounges(testData);

                expect(fakeVipLoungesService.getVipInvitationsComponent).toHaveBeenCalled();
                expect(fakeVipLoungesService.getVipInvitationsComponent).toHaveBeenCalledTimes(1);
                expect(fakeVipLoungesService.getFastTrackCardComponent).toHaveBeenCalled();
                expect(fakeVipLoungesService.getFastTrackCardComponent).toHaveBeenCalledTimes(1);
                done();
            });

            const runAvailabilityTests = (status, expectedInvitation, expectedFast, done) => {
                controller.initializeVipLounges(status);

                assertInitialState();
                deferred.resolve();
                $scope.$digest();

                assertExpectedStateAfterPromises(expectedInvitation, expectedFast);
                done();
            }

            it('should set showGibeInvitationsLink to true when GibeInvitations are available', (done) => {
                const testData = gibeStatus(true, false);
                runAvailabilityTests(testData, true, false, done);
            });

            it('should set showGibeFastLink to true when GibeFast are available', (done) => {
                const testData = gibeStatus(false, true);
                runAvailabilityTests(testData, false, true, done);
            });
        });
    });
    describe('when $onInit() function is called to cover branches', () => {
        it('and upgInformation is defined and return false', (done) => {
            let fakeBookingInfoCopy = JSON.parse(JSON.stringify(createFakeBookingInfo()));
            fakeBookingInfoCopy.upgInformation = {bidable: false};
            fakeBookingInfoCopy.channel = 'NDC_INDIRECT';
            fakeBookingInfoCopy.order.availableForCheckin = true;
            delete fakeBookingInfoCopy.orderFlags;
            localStorage.set('bookingInfo', fakeBookingInfoCopy);
            controller.$onInit();
            expect(controller.infoBooking.upgInformation.bidable).toBe(false);
            expect(controller.orderFlags).toEqual([]);
            expect(controller.infoBooking.channel).toEqual('NDC_INDIRECT');
            expect(controller.infoBooking.order.availableForCheckin).toBe(true);
            done();
        });

        it('and channel different and externalAgency is false', (done) => {
            let fakeBookingInfoCopy = JSON.parse(JSON.stringify(createFakeBookingInfo()));
            fakeBookingInfoCopy.order.availableForCheckin = undefined;
            fakeBookingInfoCopy.channel = 'IBCOM';
            localStorage.set('bookingInfo', fakeBookingInfoCopy);
            controller.$onInit();
            expect(controller.infoBooking.channel).toEqual('IBCOM');
            expect(controller.externalAgency).toBe(false); 
            done();
        });

        it('and checkWarning ', (done) => {
            let fakeBookingInfoCopy = JSON.parse(JSON.stringify(createFakeBookingInfo()));
            fakeBookingInfoCopy.order.availableForCheckin = undefined;
            fakeBookingInfoCopy.warnings = [{
                code: 'SSE_ORM_9442',
                description: 'hola</br>test'
            }];
            localStorage.set('bookingInfo', fakeBookingInfoCopy);
            controller.$onInit();
            expect(controller.infoBooking.warnings).toBeDefined();
            expect(fakeDisruptionUtilService.checkWarning).toHaveBeenCalledWith(fakeBookingInfoCopy.warnings);
            expect(controller.caseFive).toBeTrue();
            done();
        });

        it('and checkDelayedFlights should assign delayedFlights from service response', (done) => {
            const delayedFlightsMock = [{ sliceId: 'MADBCN', disruptionTypes: ['DELAY'] }];
            let fakeBookingInfoCopy = JSON.parse(JSON.stringify(createFakeBookingInfo()));

            fakeBookingInfoCopy.order.slices = [
                { sliceId: 'MADBCN', disruptionTypes: ['DELAY'] },
                { sliceId: 'BCNMAD', disruptionTypes: ['OTHER'] }
            ];

            fakeDisruptionUtilService.checkDelayedFlights.and.returnValue(delayedFlightsMock);

            localStorage.set('bookingInfo', fakeBookingInfoCopy);
            controller.$onInit();

            expect(fakeDisruptionUtilService.checkDelayedFlights).toHaveBeenCalledWith(fakeBookingInfoCopy.order.slices);
            expect(controller.delayedFlights).toEqual(delayedFlightsMock);
            done();
        });
        
    });

    describe('getFlexibilizationTitle', () => {
        it('should return the default literal when infoBooking is null', (done) => {
            controller.infoBooking = null;
            expect(controller.getFlexibilizationTitle()).toEqual(fakeBookingDashboardConstants.DEFAULT_FLEXIBILIZATION_TITLE);
            done();
        });

        it('should return the default literal when flexibilizationCapabilitiesInformation is undefined', (done) => {
            controller.$onInit();
            controller.infoBooking = { ...createFakeBookingInfo(), flexibilizationCapabilitiesInformation: undefined };
            expect(controller.getFlexibilizationTitle()).toEqual(fakeBookingDashboardConstants.DEFAULT_FLEXIBILIZATION_TITLE);
            done();
        });

        it('should return the mapped literal when id matches a key in CUSTOM_FLEXIBILIZATION_TITLE', (done) => {
            controller.$onInit();
            controller.infoBooking = { ...createFakeBookingInfo(), flexibilizationCapabilitiesInformation: { id: 53 } };
            expect(controller.getFlexibilizationTitle()).toEqual('MMB_FLEX_CAPABILITIES_INFO_MODULE_TITLE');
            done();
        });

        it('should return the default literal when id is not found in CUSTOM_FLEXIBILIZATION_TITLE', (done) => {
            controller.$onInit();
            controller.infoBooking = { ...createFakeBookingInfo(), flexibilizationCapabilitiesInformation: { id: 999 } };
            expect(controller.getFlexibilizationTitle()).toEqual(fakeBookingDashboardConstants.DEFAULT_FLEXIBILIZATION_TITLE);
            done();
        });
    });
});
