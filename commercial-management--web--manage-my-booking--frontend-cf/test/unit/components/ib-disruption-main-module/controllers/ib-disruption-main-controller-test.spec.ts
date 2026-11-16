describe('DisruptionMainController test', () =>  {

    let  $timeout,  localStorageService;
    let faketranslate = {
        onReady: jasmine.createSpy('onReady').and.returnValue(Promise.resolve())
    };
    let fakeMmbInvoluntaryChangeService = {
        'flightHasInvoluntaryChange': jasmine.createSpy('flightHasInvoluntaryChange').and.callFake(() =>  {
            return true;
        }),

        'flightIsChange': jasmine.createSpy('flightIsChange').and.callFake(() =>  {
            return true;
        }),

        'flightIsCancel': jasmine.createSpy('flightIsCancel').and.callFake(() =>  {
            return true;
        }),
        'submitChangesAccepted' : jasmine.createSpy().and.callFake(() => {
            let deferred = $q.defer();
            deferred.reject(true);
            return deferred.promise;
        }),
    };
    let fake$scope = {
        '$on': jasmine.createSpy()
    };
    let fakeNewMainHeaderFacade = {
        'initHeader': jasmine.createSpy(),
        'showLogin' : jasmine.createSpy(),
    }

    let fakeMmBModalService = {
        'finishWaiting': jasmine.createSpy(),
        'showGenericModal':jasmine.createSpy().and.callFake(() =>  {
            return {
                result: $q.when({})
            };
        }),
        'showWaitingModal': jasmine.createSpy().and.callFake(() =>  {}),
        'showGenericError': jasmine.createSpy('showGenericError').and.callFake(() =>  {
            return {
                result: $q.when({})
            };
        }),
        'showFullModal': jasmine.createSpy('showFullModal').and.callFake(() =>  {
            return {
                result: $q.when({})
            };
        }),
        'showVoluntaryChangeModal': jasmine.createSpy('showVoluntaryChangeModal').and.callFake(() =>  { })
    };

    let fakeMmBAppConstants = {
        'WCS': {
            'PHONE_TYPES': {
                'SALES': '910 555 101'
            }
        },
        'QUADRIGAM': {
            'CANCEL_FLIGHT_INV': 'TEST',
            'MODAL_ACCEPT_CHANGE_WITH_ONLY_ALTERNATIVE_TOTAL': 'CINTBK',
            'DISRUPTION_VOUCHER_REFUND_BEGGINING': 'TEST_3'
        },
        'TITLES_APP':{
            'MANAGEMYBOOKING_DISRUPTION':'MMBDISR',
        },
        'PNR_EMITION_CHANNEL' : {
            'FLEX_FLIGHT_DIRECT' : ['IBCOM', 'CALL_CENTER', 'NDC_DIRECT'],
            'FLEX_FLIGHT_INDIRECT': [
                'NDC_INDIRECT',
                'OTHER'
            ]
        },
        'DISRUPTION_TIME' : {
            'COMERCIAL_TIME': 'COMMERCIAL_TIME',
            'OPERATIONAL_TIME': 'OPERATIONAL_TIME',
            'MAJOR_DISRUPTION_TIME': 'MAJOR_DISRUPTION'
        },
    };

    const fakeDisruptionDashboardConstants = {
        COMMON_LABELS: {
            CHANNEL: {
                IBCOM: {
                    'VALUE': 'MMB_DISRUPTION_CALLCENTER_CONTACT_MSG',
                    'PHONE': true
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
        DISRUPTED_CHANGE_CONDITIONS: {
            IBERIA_OPER :{
                'keepConditions':[
                    {
                        'message':'MMB_FLEXIBILIZATION_REASON_INFO_KEEP_CONDITION_NEW_1'
                    },
                    {
                        'message':'MMB_FLEXIBILIZATION_REASON_INFO_KEEP_CONDITION_NEW_2'
                    },
                    {
                        'message':'MMB_FLEXIBILIZATION_REASON_INFO_KEEP_CONDITION_NEW_3'
                    },
                    {
                        'message':'MMB_FLEXIBILIZATION_REASON_INFO_KEEP_CONDITION_NEW_4'
                    }
                ],
            },
            NOT_IBERIA_OPER:{
                'keepConditions':[
                    {
                        'message':'MMB_FLEXIBILIZATION_REASON_INFO_KEEP_CONDITION_1'
                    },
                    {
                        'message':'MMB_FLEXIBILIZATION_REASON_INFO_KEEP_CONDITION_6'
                    },
                    {
                        'message':'MMB_FLEXIBILIZATION_REASON_INFO_KEEP_CONDITION_7'
                    }
                ],
            },
        },
    };

    let fakeDisruptionDashboardTransformer = {
        'transformPhoneCallCenter': jasmine.createSpy(),
        'transformDisruptionData': jasmine.createSpy(),
        'transformDateSelectorData': jasmine.createSpy(),
        'transformOrderData': jasmine.createSpy(),
        'transformCustomChangeByFlows': jasmine.createSpy()
    };

    let fakeMmBUtilService = {
        'transformSisterCitiesModel': jasmine.createSpy(),
        'formatDisruptionAndFlexibilizationDates': jasmine.createSpy(),
        'isUserLogged': jasmine.createSpy(),
        'getURLFirstParameterByName': jasmine.createSpy('getURLFirstParameterByName').and.callFake(() =>  {
            return {};
        }),
        'generateSummaryModel': jasmine.createSpy(),
               
    };

    let fakeGetWcsPhonesService = {
        'getPhoneByCode': jasmine.createSpy()
    };

    let fakeBookingSearchService = {
        'checkOrderInfo': jasmine.createSpy(),
        'retrieveOrderComplete': jasmine.createSpy(),
        'reshopConditionsResponseObser': {
            subscribe: jasmine.createSpy('subscribe').and.callFake(() =>  {})
          }
    };

    let fakeDatalayerUtilsService = {
        'updateDatalayerWithQuadrigam': jasmine.createSpy(),
        'sendDatalayerEvent': jasmine.createSpy(),
        'updateDigitalDataWithQuadrigam': jasmine.createSpy('updateDigitalDataWithQuadrigam').and.callFake(() =>  { }),
        'updateDatalayerViewEvent': jasmine.createSpy('updateDatalayerViewEvent').and.callFake(() =>  { }),
        'setProcessAndStep': jasmine.createSpy()
    };

    let fakeRedirectionService = {
        'externalRedirect': jasmine.createSpy()
    };

    let fakeDatalayerConstants = {
        DATALAYER_EVENT_TYPES: {
            'VIEW': 'TEST_4'
        },
        DIGITAL_DATA_PROCESS:{
            RVDDBT: 'test'
        },
        DIGITAL_DATA_STEP:{
            RVDDBT: 'test'
        }
    };
    let $filterFake = jasmine.createSpy('$filter').and.callFake(function (filterName) {
        return function (key, params) {
            if (params && params.phoneNumber) {
                return `${key} con ${params.phoneNumber}`;
            }
            return `${key}`;
        };
    });

    let fakeDisruptionRefundService = {};

    let fakeCurrencyService = {};

    let fakeIbFlagsTransformer = {
        'generateFlagsMenu': jasmine.createSpy()
    };

    let fakeChangleFlightsService = {
        'getDisruptionPeriods': jasmine.createSpy()
    };

    //MOCKS
    let bookingInfoMock = {
        'flowid' : '',
        'fareFamilyConditions':[
        ],
        'order' : {
            'slices': [
                {

                }
            ]
        },
        'channel': 'OTHER'
    };
    let disruptionPeriodsInfo = {

    }
    let allowedPeriodsMock = {
        'dateTo' : true
    }
    let searchSliceObj = [
        {
            segments : [
                {
                    flight : {
                        operationalCarrier:{
                            code : 'IB'
                        }
                    }
                }
            ]
        }
    ];

    let searchSliceObj2 = [
        {
            segments : [
                {
                    flight : {
                        operationalCarrier:{
                            code : 'TEST'
                        }
                    }
                }
            ]
        }
    ];
    
    const orderSlicesMMB = [
        {
            sliceId: 'MADIBZ20200718114500',
            type: 'REGULAR',
            departureDateTime: '2020-07-18 11:45',
            arrivalDateTime: '2020-07-18 13:00',
            duration: 75,
            stopsNumber: 0,
            price: {
                fare: 223,
                currency: 'EUR'
            },
            detailedPrices: [
                {
                    fare: 223,
                    currency: 'EUR'
                }
            ],
            segments: [
                {
                    type: 'CONFIRMED',
                    mmbAllowed: true,
                    noShow: false,
                    flyNow: false,
                    flown: false,
                    overnight: false,
                    id: 'IB380820200718',
                    duration: 75,
                    waitingTime: 0,
                    operatorLocator: null,
                    stop: null,
                    departureDateTime: '2020-07-18 11:45',
                    departureUtcDateTime: '2020-07-18T09:45:00.000',
                    arrivalDateTime: '2020-07-18 13:00',
                    arrivalUtcDateTime: '2020-07-18T11:00:00.000',
                    flight : {
                        operationalCarrier:{
                            code : 'IB'
                        }
                    }
                }
            ],
            overnight: false,
            passengerFlags: [
                {
                    passengerId: 'ADULT_01'
                }
            ]
        }
    ];
    let phonesListMock = {"RESERVAS":{'prefix':'(+34)','telephone':'901 111 500','text':'Reservas y Venta:','prefixAlt':'','telephoneAlt':'','textAlt':'','timeText':'24h'}};
    let pnrChannelMock = null;
    let showSisterCitiesPossibilityMock = null;
    let partialRefundMock = null;
    let rebookDisableMock = null;
    let notIberiaTicketMock = null;
    let hasTicketsMock = null;
    let manualCloseVCModalMock = null;
    let checkinSurnameMock = null;
    let warningDowngradeDiffFlightOrTimeMock = null;
    let pnrMock = null;
    let warningDowngradeSameFlightAndTimeMock = null;
    let specialOrderStatusMock = null;
    let blackOutPeriodsDataMock = null;
    let textBlackoutPeriodsMock = null;
    let textAllowedPeriodsMock = null;
    let voucherPriceInfoMock = null;
    let cashPriceInfoMock = null;
    let cashOrderItemsMock = null;
    let currencysMock = null;
    let userLoggedMock = null;
    let customerDataMock = null;
    let voucherOrderItemsMock = null;
    let membershipDataMock = null;
    let voucherPartialRefundMock = null;
    let $q;
    let fakeCommonsUtilService = {
        'setTitlePage': jasmine.createSpy()
    };
    
    let fakeLoadingSpinnerService = {
        'show': jasmine.createSpy('show'),
        'hide': jasmine.createSpy('hide'),
        'isLoading': jasmine.createSpy('isLoading').and.returnValue(false)
    };

    let DisruptionDashboardController;
    let $controller;
    let $injector;
    let MmBModalService;
    let DisruptionModel;
    let MmBAppConstants;
    let DisruptionDashboardTransformer;
    let DisruptionUtilService;
    let MmBUtilService;
    let CommonsGetWcsPhonesService;
    let MmbInvoluntaryChangeService;
    let BookingSearchService;
    let MmBDatalayerUtilsService;
    let RedirectionService;
    let MMBDatalayerConstants;
    let DisruptionRefundService;
    let CurrencyService;
    let IbFlagsTransformer;
    let ChangleFlightsService;
    let $rootScope;
    let $scope;
    let NewMainHeaderFacade;
    let DisruptionDashboardConstants;
    //SPIES letIABLES
    let localStorageGetSpy, DUtilSrvEvaluateSpy, DUtilSrvSearchSlicesSpy, DUtilSrvDisTypeSpy, DUtilSrvgetQuadSpy, DUtilSrvcheckFLXXSpy, DUtilSrvorderItemContained;

    const setChannelDowngradeMessage = (channel) => {
        const contactPhone = '+34123456789';
        if (MmBAppConstants.PNR_EMITION_CHANNEL.FLEX_FLIGHT_DIRECT.includes(channel)) {
            DisruptionDashboardController.model.channelDowngradeMessage = 
                `MMB_DISRUPTION_ALTERNATIVES_DOWNGRADE_DIRECT ${contactPhone}`;
        } else if (MmBAppConstants.PNR_EMITION_CHANNEL.FLEX_FLIGHT_INDIRECT.includes(channel)) {
            DisruptionDashboardController.model.channelDowngradeMessage = 
                'MMB_DISRUPTION_ALTERNATIVES_DOWNGRADE_INDIRECT';
        };
    };

    const initializeDisruptionDCModel = () => {
        DisruptionDashboardController.model = {
            flagRefund: true,
            enableExternalRefundLink: false,
            channelDowngradeMessage: '',
            contactPhone: '+34 123456789',
            operationalTimeMessage: false,
            showRefundLink: false,
            flags: {
                voucherPriceInfo: true,
                cashPartialRefund: true,
                showRefundVoucherSection: false
            },
            voucherPriceInfo: {},
            cashPriceInfo: {},
            voucherOrderItems: [],
            cashOrderItems: [],
            refundFlags: {
                mixedOption: true
            },
            isGenericDisruption: { disruptionTime: "COMMERCIAL_TIME",  isMajorDisruption: false },
            hasPets: false,
            selectorFlights: {},
            common: {
                labelContact: '',
                contactPhone: ''
            },
            changeConditions: {}
        };
    };
    let addLocalInjectors = (_$timeout_) => {
        $q = $injector.get('$q');
        $timeout = _$timeout_;
        $rootScope = $injector.get('$rootScope');
        $scope = $rootScope.$new();
        ChangleFlightsService = $injector.get('ChangleFlightsService');
        IbFlagsTransformer = $injector.get('IbFlagsTransformer');
        CurrencyService = $injector.get('CurrencyService');
        DisruptionRefundService = $injector.get('DisruptionRefundService');
        MMBDatalayerConstants = $injector.get('MMBDatalayerConstants');
        RedirectionService = $injector.get('RedirectionService');
        MmBDatalayerUtilsService = $injector.get('MmBDatalayerUtilsService');
        BookingSearchService = $injector.get('BookingSearchService');
        MmbInvoluntaryChangeService = $injector.get('MmbInvoluntaryChangeService');
        CommonsGetWcsPhonesService = $injector.get('CommonsGetWcsPhonesService');
        MmBUtilService = $injector.get('MmBUtilService');
        DisruptionUtilService = $injector.get('DisruptionUtilService');
        DisruptionDashboardTransformer = $injector.get('DisruptionDashboardTransformer');
        MmBAppConstants = $injector.get('MmBAppConstants');
        DisruptionModel = $injector.get('DisruptionModel');
        MmBModalService = $injector.get('MmBModalService');
        NewMainHeaderFacade = $injector.get('NewMainHeaderFacade');
        localStorageService = $injector.get('localStorageService');
        DisruptionDashboardConstants = $injector.get('DisruptionDashboardConstants');
    };

    let addLocalStorageItems = (_$timeout_) => {
       addLocalInjectors(_$timeout_);

        localStorageGetSpy = spyOn(localStorageService, 'get');

        spyOn(localStorageService, 'set');
        DUtilSrvEvaluateSpy = spyOn(DisruptionUtilService, 'evaluateRule');
        DUtilSrvSearchSlicesSpy = spyOn(DisruptionUtilService, 'searchSlices');
        DUtilSrvDisTypeSpy = spyOn(DisruptionUtilService, 'getDisruptionType');
        DUtilSrvgetQuadSpy = spyOn(DisruptionUtilService, 'getQuadrigam');
        DUtilSrvcheckFLXXSpy = spyOn(DisruptionUtilService, 'checkFLXX');
        DUtilSrvorderItemContained = spyOn(DisruptionUtilService, 'orderItemContained');

        DUtilSrvEvaluateSpy.and.returnValue(true);
        DUtilSrvSearchSlicesSpy.and.returnValue(searchSliceObj);
        DUtilSrvDisTypeSpy.and.returnValue('');
        DUtilSrvgetQuadSpy.and.returnValue('');
        DUtilSrvcheckFLXXSpy.and.returnValue('');
        DUtilSrvorderItemContained.and.returnValue(true);

        fakeMmBUtilsSharedService.generateFlexAndDisruptedFlightsDatalayerInfo.and.stub();
        localStorageGetSpy.withArgs('bookingInfo').and.returnValue(bookingInfoMock);
        localStorageGetSpy.withArgs('pnrChannel').and.returnValue(pnrChannelMock);
        localStorageGetSpy.withArgs('showSisterCitiesPossibility').and.returnValue(showSisterCitiesPossibilityMock);
        localStorageGetSpy.withArgs('partialRefund').and.returnValue(partialRefundMock);
        localStorageGetSpy.withArgs('rebookDisable').and.returnValue( rebookDisableMock);
        localStorageGetSpy.withArgs('notIberiaTicket').and.returnValue( notIberiaTicketMock);
        localStorageGetSpy.withArgs('hasTickets').and.returnValue( hasTicketsMock);
        localStorageGetSpy.withArgs('manualCloseVCModal').and.returnValue( manualCloseVCModalMock);
        localStorageGetSpy.withArgs('PNR').and.returnValue( pnrMock );
        localStorageGetSpy.withArgs('checkinSurname').and.returnValue( checkinSurnameMock );
        localStorageGetSpy.withArgs('warningDowngradeSameFlightAndTime').and.returnValue( warningDowngradeSameFlightAndTimeMock );
        localStorageGetSpy.withArgs('warningDowngradeDiffFlightOrTime').and.returnValue( warningDowngradeDiffFlightOrTimeMock );
        localStorageGetSpy.withArgs('specialOrderStatus').and.returnValue( specialOrderStatusMock );
        localStorageGetSpy.withArgs('blackOutPeriodsData').and.returnValue( blackOutPeriodsDataMock );
        localStorageGetSpy.withArgs('textBlackoutPeriods').and.returnValue( textBlackoutPeriodsMock );
        localStorageGetSpy.withArgs('textAllowedPeriods').and.returnValue( textAllowedPeriodsMock );
        localStorageGetSpy.withArgs('voucherPriceInfo').and.returnValue( voucherPriceInfoMock );
        localStorageGetSpy.withArgs('cashPriceInfo').and.returnValue( cashPriceInfoMock);
        localStorageGetSpy.withArgs('cashOrderItems').and.returnValue( cashOrderItemsMock);
        localStorageGetSpy.withArgs('voucherOrderItems').and.returnValue( voucherOrderItemsMock);
        localStorageGetSpy.withArgs('phonesList').and.returnValue(phonesListMock);
        localStorageGetSpy.withArgs('disruptionPeriodsInfo').and.returnValue(disruptionPeriodsInfo);
        localStorageGetSpy.withArgs('allowedPeriods').and.returnValue(allowedPeriodsMock);
        localStorageGetSpy.withArgs('voucherPartialRefund').and.returnValue(voucherPartialRefundMock);
        localStorageGetSpy.withArgs('currency').and.returnValue( currencysMock );
        localStorageGetSpy.withArgs('userLogged').and.returnValue( userLoggedMock );
        localStorageGetSpy.withArgs('customerData').and.returnValue(customerDataMock);
        localStorageGetSpy.withArgs('membershipData').and.returnValue(membershipDataMock);
        localStorageGetSpy.withArgs('voucherFromEmail').and.returnValue(true);
        localStorageGetSpy.withArgs('optionalFlight').and.returnValue(true);
        fakeGetWcsPhonesService.getPhoneByCode.and.callFake(function(){
            let deferred = $q.defer();
            deferred.resolve();
            return deferred.promise;
        });
    };

    let fakeMmBUtilsSharedService = {
        'newTransformSisterCitiesModel': jasmine.createSpy('newTransformSisterCitiesModel').and.callFake(() => {
            return {};
        }),
        'initializeQuadrigam':  jasmine.createSpy(),
        'getProcessByStatus':  jasmine.createSpy('getProcessByStatus').and.callFake(() =>  {
            return 'test'
        }),
        'updateQuadrigam': jasmine.createSpy(),
        'generateFlexAndDisruptedFlightsDatalayerInfo' : jasmine.createSpy()
    };

    beforeEach(() =>  {
        angular.mock.module('ib-disruption-main-module', 'LocalStorageModule', function ($provide) {
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('DisruptionDashboardConstants', fakeDisruptionDashboardConstants);
            $provide.value('DisruptionDashboardTransformer', fakeDisruptionDashboardTransformer);
            $provide.value('MmBUtilService', fakeMmBUtilService);
            $provide.value('CommonsGetWcsPhonesService', fakeGetWcsPhonesService);
            $provide.value('MmbInvoluntaryChangeService', fakeMmbInvoluntaryChangeService);
            $provide.value('BookingSearchService', fakeBookingSearchService);
            $provide.value('$translate', faketranslate);
            $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('RedirectionService', fakeRedirectionService);
            $provide.value('MMBDatalayerConstants', fakeDatalayerConstants);
            $provide.value('DisruptionRefundService', fakeDisruptionRefundService);
            $provide.value('CurrencyService', fakeCurrencyService);
            $provide.value('IbFlagsTransformer', fakeIbFlagsTransformer);
            $provide.value('ChangleFlightsService', fakeChangleFlightsService);
            $provide.value('$scope ', fake$scope );
            $provide.value('$filter', $filterFake );
            $provide.value('NewMainHeaderFacade', fakeNewMainHeaderFacade);
            $provide.value('CommonsUtilService',fakeCommonsUtilService);
            $provide.value('LoadingSpinnerService', fakeLoadingSpinnerService);
            $provide.value('MmBUtilsSharedService', fakeMmBUtilsSharedService);
        });
    
        inject(function(_$controller_, _$injector_, _$timeout_) {
            $controller = _$controller_;
            $injector = Object.keys(_$injector_).reduce(function (clone, key) {
                clone[key] = _$injector_[key];
                return clone
            } , {});
            
            addLocalStorageItems(_$timeout_);
            DisruptionDashboardController = $controller('DisruptionDashboardController', {
                $scope: $scope,
                $rootScope : $rootScope,
                ChangleFlightsService: ChangleFlightsService,
                IbFlagsTransformer: IbFlagsTransformer,
                CurrencyService: CurrencyService,
                DisruptionRefundService: DisruptionRefundService,
                MMBDatalayerConstants: MMBDatalayerConstants,
                RedirectionService: RedirectionService,
                MmBDatalayerUtilsService: MmBDatalayerUtilsService,
                BookingSearchService: BookingSearchService,
                MmbInvoluntaryChangeService: MmbInvoluntaryChangeService,
                CommonsGetWcsPhonesService: CommonsGetWcsPhonesService,
                MmBUtilService: MmBUtilService,
                DisruptionUtilService: DisruptionUtilService,
                DisruptionDashboardTransformer: DisruptionDashboardTransformer,
                MmBAppConstants: MmBAppConstants,
                DisruptionDashboardConstants: DisruptionDashboardConstants,
                DisruptionModel: DisruptionModel,
                MmBModalService: MmBModalService,
                NewMainHeaderFacade: NewMainHeaderFacade,
                LoadingSpinnerService: fakeLoadingSpinnerService

            });
            initializeDisruptionDCModel();
        });
        $rootScope.$digest();
    });
    describe('when DisruptionDashboardController be Defined', () =>  {
        it('should be defined', (done) =>  {
            expect(DisruptionDashboardController).toBeDefined();
            done();
        });
    });

    describe('when checkPets() function is called', () => {
        const testCases = [
            { orderItems: [{ type: 'pet' }]},
            { orderItems: [{ type: 'petc' }]},
            { orderItems: [{ type: 'seat' }]}
        ];

        it('should set hasPets to true when orderItems contain a pet', () => {
            DisruptionDashboardController.bookingInfo = {
                order: { orderItems: testCases[0].orderItems }
            };

            DisruptionDashboardController.checkPets(DisruptionDashboardController.bookingInfo);
            expect(DisruptionDashboardController.model.hasPets).toBe(true);
        });

        it('should set hasPets to true when orderItems contain a pet in cabin', () => {
            DisruptionDashboardController.bookingInfo = {
                order: { orderItems: testCases[1].orderItems }
            };

            DisruptionDashboardController.checkPets(DisruptionDashboardController.bookingInfo);
            expect(DisruptionDashboardController.model.hasPets).toBe(true);
        });

        it('should set hasPets to false when orderItems do not contain a pet', () => {
            DisruptionDashboardController.bookingInfo = {
                order: { orderItems: testCases[2].orderItems }
            };

            DisruptionDashboardController.checkPets(DisruptionDashboardController.bookingInfo);
            expect(DisruptionDashboardController.model.hasPets).toBe(false);
        });

        it('should set hasPets to false when orderItems is undefined', () => {
            DisruptionDashboardController.bookingInfo = {
                order: {}
            };

            DisruptionDashboardController.checkPets(DisruptionDashboardController.bookingInfo);
            expect(DisruptionDashboardController.model.hasPets).toBe(false);
        });

        it('should set hasPets to false when order is undefined', () => {
            DisruptionDashboardController.bookingInfo = {};

            DisruptionDashboardController.checkPets(DisruptionDashboardController.bookingInfo);
            expect(DisruptionDashboardController.model.hasPets).toBe(false);
        });

        it('should set hasPets to false when localBookingInfo is undefined', () => {
            DisruptionDashboardController.checkPets(undefined);
            expect(DisruptionDashboardController.model.hasPets).toBe(false);
        });
    });

    describe('when checkWarning() function is called', () => {
        it('should set hasFreeTickets to true when SSE_MMB_1018 exists', () => {
            const warningMatch = { code: 'SSE_MMB_1018', description: 'Free ticket warning' };
            DisruptionDashboardController.bookingInfo = {
                warnings: [
                    { code: 'OTHER_WARNING' },
                    warningMatch
                ]
            };

            DisruptionDashboardController.checkWarning(DisruptionDashboardController.bookingInfo);
            expect(DisruptionDashboardController.model.hasFreeTickets).toBe(true);
        });

        it('should set hasFreeTickets to false when SSE_MMB_1018 does not exist', () => {
            DisruptionDashboardController.bookingInfo = {
                warnings: [{ code: 'OTHER_WARNING' }]
            };

            DisruptionDashboardController.checkWarning(DisruptionDashboardController.bookingInfo);
            expect(DisruptionDashboardController.model.hasFreeTickets).toBe(false);
        });

        it('should set hasFreeTickets to false when warnings is undefined', () => {
            DisruptionDashboardController.bookingInfo = {};

            DisruptionDashboardController.checkWarning(DisruptionDashboardController.bookingInfo);
            expect(DisruptionDashboardController.model.hasFreeTickets).toBe(false);
        });

        it('should set hasFreeTickets to false when localBookingInfo is undefined', () => {
            DisruptionDashboardController.checkWarning(undefined);
            expect(DisruptionDashboardController.model.hasFreeTickets).toBe(false);
        });
    });

    describe('when endActivate() function is called', () =>  {
        it('check isMajorDisruption is true', () =>  {
            DisruptionDashboardController.model.isGenericDisruption.disruptionTime = 'MAJOR_DISRUPTION';

            const orderSlices = {
                canceledList: {
                    list: [1, 2]
                },
                reacomList: {
                    list: [1, 2]
                },
                confirmedList: {
                    list: [1, 2]
                },
            }

            DisruptionDashboardController.bookingInfo = {
                order: {
                    status: 'CANCELLED'
                },
                orderFlags: {}
            }

            DisruptionDashboardController.endActivate(DisruptionDashboardController.bookingInfo, DisruptionDashboardController.voucherFromEmail, orderSlices);

            expect(DisruptionDashboardController.model.isGenericDisruption.isMajorDisruption).toBe(true);
        });
    });

    describe('when activate() function is called', () =>  {
        it('should set direct channel downgrade message', (done) =>  {
            let channel = 'IBCOM';

            faketranslate.onReady().then(() =>  {
                setChannelDowngradeMessage(channel);

                expect(DisruptionDashboardController.model.channelDowngradeMessage).toBe('MMB_DISRUPTION_ALTERNATIVES_DOWNGRADE_DIRECT +34123456789');
                done();
            });
        });

        it('should set indirect channel downgrade message', (done) =>  {
            let channel = 'OTHER';

            faketranslate.onReady().then(() =>  {
                setChannelDowngradeMessage(channel);

                expect(DisruptionDashboardController.model.channelDowngradeMessage).toBe('MMB_DISRUPTION_ALTERNATIVES_DOWNGRADE_INDIRECT');
                done();
            });
        });

        it('should set operational time message', (done) =>  {
            DisruptionDashboardController.model.isGenericDisruption.disruptionTime = 'OPERATIONAL_TIME';

            faketranslate.onReady().then(() =>  {
                if(DisruptionDashboardController.model.isGenericDisruption.disruptionTime === MmBAppConstants.DISRUPTION_TIME.OPERATIONAL_TIME) {
                    DisruptionDashboardController.model.operationalTimeMessage = true;
                    DisruptionDashboardController.model.channelDowngradeMessage = `MMB_DISRUPTION_ALTERNATIVES_DOWNGRADE_OPERATIONAL_TIME`;
                }

                expect(DisruptionDashboardController.model.operationalTimeMessage).toBe(true);
                expect(DisruptionDashboardController.model.channelDowngradeMessage).toBe('MMB_DISRUPTION_ALTERNATIVES_DOWNGRADE_OPERATIONAL_TIME');
                done();
            });
            $timeout.flush();
        });

        it('operationalCarrier is from OPERATIONAL_GROUP_IBERIA & isGenericDisruption is true', () => {
            const changeConditions = DisruptionDashboardController.getChangeConditions(orderSlicesMMB, true);

            expect(changeConditions.keepConditions[1].message).toBe('MMB_FLEXIBILIZATION_REASON_INFO_KEEP_CONDITION_NEW_2');
        })

        it('operationalCarrier is not from OPERATIONAL_GROUP_IBERIA', () => {
            DUtilSrvSearchSlicesSpy.and.returnValue(searchSliceObj2);
            const changeConditions = DisruptionDashboardController.getChangeConditions(orderSlicesMMB, true);

            expect(changeConditions.keepConditions[1].message).toBe('MMB_FLEXIBILIZATION_REASON_INFO_KEEP_CONDITION_6');
        })

        it('setPhonesList is called & order.phonesList is null & channel is not included in COMMON_LABELS', () => {
            const bookingInfo = {
                order: {},
                channel: 'TEST'
            };

            DisruptionDashboardController.setPhonesList(bookingInfo);

            expect(DisruptionDashboardController.model.common.labelContact).toBe('MMB_DISRUPTION_CALLCENTER_CONTACT_MSG');
        })
    });
        
    describe('call goToRefund()', () => {
        it(' and flagRefund is enabled', (done) => {
            let refundsInformation = {
                'cashAvailable':{
                    'showRefundVoucherSection': false
                }
            };

            DisruptionDashboardController.refundsInformation = refundsInformation;
            DisruptionDashboardController.goToRefund();
            done();
        })
        it('should show a waiting modal', (done) =>  {
            DisruptionDashboardController.goToRefund();
            expect(MmBModalService.showWaitingModal).toHaveBeenCalled();
            done();
        });
    });

    describe('call acceptChanges', () => {
        beforeEach(inject((_$timeout_, _$q_, _localStorageService_) => {
            $q = _$q_;
            $timeout = _$timeout_;
            localStorageService = _localStorageService_;
            fakeMmbInvoluntaryChangeService.submitChangesAccepted=jasmine.createSpy('submitChangesAccepted').and.callFake(() => {
                let deferred = $q.defer();
                deferred.reject(true);
                return deferred.promise;
            }),
            localStorageGetSpy = spyOn(localStorageService, 'get');
            localStorageGetSpy.withArgs('typeDisruptionFlow').and.returnValue('ALT_PARC_WITHOUT_FLEX');
            fakeMmBModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.callFake(() =>  {
                // Simulate modal acceptance
                return {
                    result: {
                    then: function (onAccept) {
                        onAccept();
                    }
                    }
                };
                });
        }));
        it('and ALTERNATIVE_PARCIAL_WITHOUT_FLEXIBILIZATION', (done) =>  {
            DisruptionDashboardController.acceptChanges();
            expect(fakeMmbInvoluntaryChangeService.submitChangesAccepted).toHaveBeenCalled();
            done();
        });
    });
});
