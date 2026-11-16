'use strict';

import angular from "angular";

jasmine.getEnv().allowRespy(true);
describe('test for module ib-disruption-flight-change-date-module - controllers', function () {
    var q;
    var fakeMmBModalService = {
        'showGenericModal': jasmine.createSpy(),
        'showGenericError': jasmine.createSpy(),
        'finishWaiting': jasmine.createSpy(),
        'showWaitingModal': jasmine.createSpy(),
        'showFullModal': jasmine.createSpy(),
    };
    var fakeMmBUtilService = {
        'isUserLogged': jasmine.createSpy(),
        'generateRequestFlexibilization': jasmine.createSpy()
    };
    let fakeMmBUtilsSharedService = {
        'updateSisterCitiesModel': jasmine.createSpy(),
        'updateQuadrigam': jasmine.createSpy(),
        'getProcessByStatus': jasmine.createSpy(),
    };
    var fakeDisruptionFlightChangeDateTransformer = {
        'initializeModel': jasmine.createSpy().and.returnValue({
            flights: {
                    LCGMAD20220315092000: {
                        optionalEnabled: true,
                        position: 1,
                        dateOptions: {
                            showWeeks: false,
                            maxMode: 'day',
                            minDate: {
                                _isAMomentObject: true,
                                _isUTC: false,
                                _pf: {
                                    empty: false,
                                    overflow: -2,
                                    charsLeftOver: 0,
                                    nullInput: false,
                                    invalidMonth: null,
                                    invalidFormat: false,
                                    userInvalidated: false,
                                    iso: false,
                                    meridiem: null
                                },
                                _locale: {
                                    _invalidDate: 'Invalid date',
                                    _ordinal: '%dº',
                                    _monthsParseExact: true,
                                    _weekdaysParseExact: true,
                                    _abbr: 'es'
                                },
                                _d: '2020-05-13T09:24:26.336Z',
                                _isValid: true
                            },
                            maxDate: {
                                _isAMomentObject: true,
                                _i: '2021-04-29T22:00:00.000Z',
                                _isUTC: false,
                                _pf: {
                                    empty: false,
                                    overflow: -2,
                                    charsLeftOver: 0,
                                    nullInput: false,
                                    invalidMonth: null,
                                    invalidFormat: false,
                                    userInvalidated: false,
                                    iso: false,
                                    meridiem: null
                                },
                                _locale: {
                                    _invalidDate: 'Invalid date',
                                    _ordinal: '%dº',
                                    _monthsParseExact: true,
                                    _weekdaysParseExact: true,
                                    _abbr: 'es'
                                },
                                _d: '2021-04-29T22:00:00.000Z',
                                _isValid: true
                            },
                            initDate: new Date('2050/11/10')
                        }
                    
                    }
                },
                slicesId: ['LCGMAD20220315092000']
        }),
        'transformerDateSelected': jasmine.createSpy(),
        'calculateDateOption': jasmine.createSpy().and.returnValue({
            minDate: new Date('2020-05-13T00:00:00Z'),
            maxDate: new Date('2021-04-29T22:00:00Z')
        })
    };

    var fakeDatalayerUtilsService = {
        'updateDatalayerWithQuadrigam': jasmine.createSpy(),
        'sendDatalayerEvent': jasmine.createSpy(),
        'setProcessAndStep': jasmine.createSpy()
    };
    var $fakeFilter = jasmine.createSpy('$filter').and.callFake(function (filter) {
        var filterFunc = function () {
            return [];
        };
        switch (filter) {
            case 'translate':
                filterFunc = function (label) {
                    return label;
                } as any;
                break;
            default:
                break;
        }

        return filterFunc;
    })

    var fakeMmBAppConstants = {
        'WCS': {
            'PHONE_TYPES': {
                'SALES': 'RESERVAS',
                'IBHOLIDAYS': 'ATTBAH'
            }
        },
        'PNR_EMITION_CHANNEL' : {
            'FLEX_FLIGHT_DIRECT' : ['IBCOM', 'CALL_CENTER', 'NDC_DIRECT']
        },
        QUADRIGAM: {
            SEARCH: 'CHKTRP',
            LOGGED_SEARCH: 'MYTRPS',
            TRIP_DETAILS: 'IBMTDT',
            CHANGE_FLIGHT: 'TCADVS',
            CHANGE_FLIGHT_DISPO: 'TCFLPA',
            FLIGHT_CONFIRMATION: 'TCFREV',
            ORDER_TICKETS: 'IBENIT',
            ORDER_TICKETS_CONFIRMATION: 'IBCENIT',
            CHANGED_HOURS_INV: 'IBICHC',
            CANCEL_FLIGHT_INV: 'IBICFC',
            SPECIAL_NEEDS: 'MOPMR',
            SPECIAL_NEEDS_CONFIRMED: 'MOPMRCF',
            PASSENGER_INFO: 'MOINFO',
            ON_HOLD_CONF: 'OHMTDT',
            ON_HOLD_CONF_ON_BUSINESS: 'CIPOHMTDT',
            ON_HOLD_CONF_RESIDENTS: 'OHSARA',
            ON_HOLD_CONF_LOGIN: 'OHLOIN',
            ON_HOLD_CONF_PAYMENT: 'MOPURC',
            ON_HOLD_CONF_PAYMENT_ON_BUSINESS: 'CIPOHINFO',
            ON_HOLD_CONF_PAYMENT_WAIT: 'OHWAIT',
            ON_HOLD_CONF_PAYMENT_FRAUD: 'OHPCC',
            ON_HOLD_CONF_CONFIRMATION: 'MOPURC',
            ON_HOLD_CONF_CONFIRMATION_ON_BUSINESS: 'CIPRTBKCF',
            ON_HOLD_CONF_CANCEL_ORDER_MODAL: 'CNCLOH',
            ON_HOLD_CONF_CANCEL_ORDER_MODAL_ON_BUSINESS: 'CIPCNCLOH',
            ON_HOLD_CONF_CANCEL_ORDER_CONFIRMATION: 'CNCLIT',
            ON_HOLD_CONF_CANCEL_ORDER_CONFIRMATION_ON_BUSINESS: 'CIPCNCLIT',
            PASSENGER_DATA: 'MODPAX',
            CUSTOMIZE_FLIGHTS: 'MOANCI',
            MODAL_SELECT_SEAT_JBA: 'SEATMPJBR',
            PASSENGER_FF_ADD: 'MOEMER',
            CONFIRM_EMERGENCY_CONTACT: 'MOCEME',
            FRECUENT_F: 'MOFFLY',
            CONFIRM_FF: 'MOCFFL',
            CONFIRM_ADD_APIS: 'MOCAPI',
            SPECIAL_NEEDS_ADD: 'MOPMR',
            CONFIRM_SPECIAL_NEEDS_ADD: 'MOCPMR',
            MANAGE_RESERV: 'IBMMBR',
            ADD_APIS: 'MOAPIS',
            MODAL_INFO_SEATS: 'MODSEA',
            MODAL_INFO_BAGGAGE: 'MODBAG',
            MODAL_INFO_SECUR: 'MODINS',
            YOUR_FLIGHTS: 'IBMTFL',
            ANC_SPECIAL_MEALS_UPDATE: 'MEALCF',
            ANC_SPECIAL_MEALS_OPEN_MODAL: 'MOMEAL',
            COMPLETE_TRAVEL: 'IBMCYT',
            STOP_OVER: 'HMMTDT',
            FLEXIBILIZATION_SEARCH_ONE_WAY: 'CVFFOW',
            FLEXIBILIZATION_SEARCH_WITH_RETURN: 'CVFFRT',
            FLEXIBILIZATION_AVAILABILITY_SERVICE_ERROR: 'CVFERD',
            FLEXIBILIZATION_BLACKOUT_DATE_SERVICE_ERROR: 'CVFERB',
            FLEXIBILIZATION_AVAILABILITY_ONE_WAY: 'CVFPOW',
            FLEXIBILIZATION_AVAILABILITY_RETURN: 'CVFPRT',
            FLEXIBILIZATION_AVAILABILITY_ONE_CHOOSE: 'CVFPSG',
            FLEXIBILIZATION_NOT_AVAILABILITY: 'CVFERR',
            FLEXIBILIZATION_REBOOK_SERVICE_ERROR: 'CVFERS',
            FLEXIBILIZATION_REBOOK_ERROR: 'CVFERF',
            FLEXIBILIZATION_CONFIRMATION: 'CVBKCF',
            FLEXIBILIZATION_INVOLUNTARY_SEARCH_ONE_WAY: 'CIFFOW',
            FLEXIBILIZATION_INVOLUNTARY_SEARCH_WITH_RETURN: 'CIFFRT',
            FLEXIBILIZATION_INVOLUNTARY_AVAILABILITY_SERVICE_ERROR: 'CIFERD',
            FLEXIBILIZATION_INVOLUNTARY_BLACKOUT_DATE_SERVICE_ERROR: 'CIFERB',
            FLEXIBILIZATION_INVOLUNTARY_AVAILABILITY_ONE_WAY: 'CIFPOW',
            FLEXIBILIZATION_INVOLUNTARY_AVAILABILITY_RETURN: 'CIFPRT',
            FLEXIBILIZATION_INVOLUNTARY_AVAILABILITY_ONE_CHOOSE: 'CIFPSG',
            FLEXIBILIZATION_INVOLUNTARY_NOT_AVAILABILITY: 'CIFERR',
            FLEXIBILIZATION_INVOLUNTARY_REBOOK_SERVICE_ERROR: 'CIFERS',
            FLEXIBILIZATION_INVOLUNTARY_REBOOK_ERROR: 'CIFERF',
            FLEXIBILIZATION_INVOLUNTARY_CONFIRMATION: 'CIBKCF',
            FLEXIBILIZATION_VOUCHER_REFUND_BEGGINING: 'RVFDBT',
            FLEXIBILIZATION_VOUCHER_REFUND_SUMMARY: 'RVFDBD',
            FLEXIBILIZATION_VOUCHER_REFUND_CONFIRMATION_MODAL: 'RVFCEB',
            FLEXIBILIZATION_VOUCHER_REFUND_CONFIRMATION_SINGLE_PAX: 'RVFCFP',
            FLEXIBILIZATION_VOUCHER_REFUND_CONFIRMATION_MULTIPLE_PAX: 'RVFCFM',
            DISRUPTION_VOUCHER_REFUND_BEGGINING: 'RVDDBT',
            DISRUPTION_VOUCHER_REFUND_SUMMARY: 'RVDDBD',
            DISRUPTION_VOUCHER_REFUND_CONFIRMATION_MODAL: 'RVDCEB',
            DISRUPTION_VOUCHER_REFUND_CONFIRMATION_SINGLE_PAX: 'RVDCFP',
            DISRUPTION_VOUCHER_REFUND_CONFIRMATION_MULTIPLE_PAX: 'RVDCFM',
            FLEXIBILIZATION_CASH_REFUND_SUMMARY: 'RCFDBD',
            FLEXIBILIZATION_CASH_REFUND_CONFIRMATION_MODAL: 'RCFCEB',
            FLEXIBILIZATION_CASH_REFUND_CONFIRMATION_PAGE: 'RCFCFP',
            DISRUPTION_CASH_REFUND_SUMMARY: 'RCDDBD',
            DISRUPTION_CASH_REFUND_CONFIRMATION_MODAL: 'RCDCEB',
            DISRUPTION_CASH_REFUND_CONFIRMATION_PAGE: 'RCDCFP',
            DISRUPTION_CHANGE_WITH_ALTERNATIVE_TOTAL: 'CITORE',
            AVAILABILITY_CHANGE_WITH_ALTERNATIVE_TOTAL: 'CITOAV',
            AVAILABILITY_SELECT_CHANGE_WITH_ALTERNATIVE_TOTAL: 'CITOAC',
            CONFIRMATION_CHANGE_WITH_ALTERNATIVE_TOTAL: 'CITOBK',
            DISRUPTION_CHANGE_WITH_ALTERNATIVE_PARCIAL: 'CIPARE',
            AVAILABILITY_CHANGE_WITH_ALTERNATIVE_PARCIAL: 'CIPAAV',
            AVAILABILITY_SELECT_CHANGE_WITH_ALTERNATIVE_PARCIAL: 'CIPAAC',
            CONFIRMATION_CHANGE_WITH_ALTERNATIVE_PARCIAL: 'CIPABK',
            DISRUPTION_CHANGE_WITH_ALTERNATIVE_TOTAL_OPTIONAL: 'CIPARE',
            AVAILABILITY_CHANGE_WITH_ALTERNATIVE_TOTAL_OPTIONAL: 'CIPTAV',
            AVAILABILITY_SELECT_CHANGE_WITH_ALTERNATIVE_TOTAL_OPTIONAL: 'CIPTAC',
            CONFIRMATION_CHANGE_WITH_ALTERNATIVE_TOTAL_OPTIONAL: 'CIPTBK',
            DISRUPTION_CHANGE_WITHOUT_ALTERNATIVE_TOTAL: 'CINTRE',
            MODAL_ACCEPT_CHANGE_WITHOUT_ALTERNATIVE_TOTAL: 'CINTBK',
            DISRUPTION_CHANGE_WITHOUT_ALTERNATIVE_PARCIAL: 'CINPRE',
            MODAL_ACCEPT_CHANGE_WITHOUT_ALTERNATIVE_PARCIAL: 'CINPBK',
            DISRUPTION_CHANGE_WITHOUT_ALTERNATIVE_WITHOUT_FLEXIBILIZATION: 'CINORE'
        }
    };
    var fakeDatalayerConstants = {
        'DATALAYER_EVENT_TYPES': {
            'VIEW': 'TEST_4'
        }
    }
    var fakeAvailabilityOrchestrator = {
        'availability' : jasmine.createSpy('availability'),

        'getAvailabilityRequest' : jasmine.createSpy('getAvailabilityRequest'),

        'getModalObject' : jasmine.createSpy('getModalObject'),

        'callModalService' : jasmine.createSpy('callModalService'),
        'getAvailability': jasmine.createSpy('getAvailability'),
    };
    var fakeStrategy = {
        'getAvailability': jasmine.createSpy('getAvailability'),
        'initializeDateOptions': jasmine.createSpy('initializeDateOptions'),
        'updateDateOptionOnChange': jasmine.createSpy('updateDateOptionOnChange')
    }
    var fakeBookingInfo = {
        channel : true,
        order: {
            slices: [{
                segments: [{
                    status: {
                        code: 'test'
                    } 
                }]
            }],
            status: 'DISRUPTED'
        }
    };
    var faketranslate = {

        'onReady': jasmine.createSpy().and.returnValue(new Promise(resolve => resolve(true))),
        'storageKey': jasmine.createSpy('storageKey').and.callFake(function () { }),
        'storage': jasmine.createSpy('storage').and.callFake(function () { }),
        'preferredLanguage': jasmine.createSpy('preferredLanguage').and.callFake(function () { }),
        'use': jasmine.createSpy('use').and.callFake(function () { })
    };

    var fakeCommonsUtilService = {
        'setTitlePage': jasmine.createSpy()
    }

    let fakeDisruptionDashboardConstants = {};
    class DefaultStrategy {
        constructor() {}
        getAvailability() {}
        initializeDateOptions() {}
        updateDateOptionOnChange() {}
    };
    class UnifiedStrategy {
        constructor() {}
        getAvailability() {}
    };
    let fakeAvailabilityClass = {
        DefaultStrategy: DefaultStrategy,
        UnifiedStrategy: UnifiedStrategy,
        getAvailability: jasmine.createSpy('getAvailability')
    };

    let fakeDisruptionUtilService = {
        initializeQuadrigam: jasmine.createSpy('initializeQuadrigam'),
        initializeSlicesList: jasmine.createSpy('initializeSlicesList'),
        getDateRange: jasmine.createSpy('getDateRange').and.returnValue({}),
        checkDates: jasmine.createSpy('checkDates').and.returnValue(true)
    };
    
    beforeEach(function () {
        angular.mock.module('ib-disruption-main-module', 'LocalStorageModule', function ($provide) {
            $provide.value('DisruptionFlightChangeDateTransformer', fakeDisruptionFlightChangeDateTransformer);
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('MmBUtilService', fakeMmBUtilService);
            $provide.value('$filter', $fakeFilter);
            $provide.value('MMBDatalayerConstants', fakeDatalayerConstants);
            $provide.value('AvailabilityOrchestrator', fakeAvailabilityOrchestrator);
            $provide.value('AvailabilityClass', fakeAvailabilityClass);
            $provide.value('DisruptionUtilService', fakeDisruptionUtilService);
            $provide.value('$translate', faketranslate);
            $provide.value('CommonsUtilService', fakeCommonsUtilService);
            $provide.value('DisruptionDashboardConstants', fakeDisruptionDashboardConstants);
            $provide.value('MmBUtilsSharedService', fakeMmBUtilsSharedService);
        });
    });

    describe('test for DisruptionFlightChangeDateController', function () {

        var DisruptionFlightChangeDateController;
        var $controller;
        var $rootScope;
        var $scope;
        var DisruptionFlightChangeDateTransformer;
        var MmBModalService;
        var $window;
        var MmBDatalayerUtilsService;
        var MmBUtilService;
        var $filter;
        var DatalayerConstants;
        var $injector;
        var localStorageService;

        beforeEach(function () {
            inject(function (_$controller_, _$injector_, $q,_$translate_) {
                $controller = _$controller_;
                q = $q;
                $injector = Object.keys(_$injector_).reduce(function (clone, key) {
                    clone[key] = _$injector_[key];
                    return clone
                }, {});
                localStorageService = $injector.get('localStorageService');
                $rootScope = $injector.get('$rootScope');
                $scope = $rootScope.$new();
                DisruptionFlightChangeDateTransformer = $injector.get('DisruptionFlightChangeDateTransformer');
                MmBModalService = $injector.get('MmBModalService');
                $window = $injector.get('$window');
                MmBDatalayerUtilsService = $injector.get('MmBDatalayerUtilsService');
                MmBUtilService = $injector.get('MmBUtilService');
                $filter = $injector.get('$filter');
                DatalayerConstants = $injector.get('MMBDatalayerConstants');
                DisruptionFlightChangeDateController = $controller('DisruptionFlightChangeDateController', {
                    $scope: $scope,
                    $rootScope: $rootScope,
                    DisruptionFlightChangeDateTransformer: DisruptionFlightChangeDateTransformer,
                    $translate: faketranslate,
                    MmBModalService: MmBModalService,
                    $window: $window,
                    MmBDatalayerUtilsService: MmBDatalayerUtilsService,
                    MmBUtilService: MmBUtilService,
                    $filter: $filter,
                    DatalayerConstants: DatalayerConstants
                });
                DisruptionFlightChangeDateController.initDates = [
                    { id: 'LCGMAD20220315092000', stringValue: '2020-05-13T09:24:26.336Z' },
                    { id: 'LCGMAD20220315092001', stringValue: '2020-05-13T09:24:26.336Z' }
                ];
                DisruptionFlightChangeDateController.sisterCitiesData = {
                    newSisterCitiesModel: {
                        'MADBIO20210731173500': {
                            origin: {
                                originSisterCities: [{code: 'MAD'}]
                            },
                            destination: {
                                destinationSisterCities: 'Bilbao'
                            },
                            originSisterCitiesNum: null,
                            destinationSisterCitiesNum: null,
                        },
                        referenceSliceId: 'MADBIO20210731173500',
                        sisterCitiesOptionChecked: true
                    }
                };
                // Clear localStorage before each test
                if (typeof localStorageService.clear === 'function') {
                    localStorageService.clear();
                } else if (typeof window !== 'undefined' && window.localStorage) {
                    window.localStorage.clear();
                }
                
                localStorageService.set('bookingInfo', fakeBookingInfo);
                DisruptionFlightChangeDateController.bookingInfo = fakeBookingInfo;
                
            });
        });

        it('DisruptionFlightChangeDateController should be defined', function () {

            expect(DisruptionFlightChangeDateController).toBeDefined();
        });
        xit ('DisruptionFlightChangeDateController activate', function(done){
            DisruptionFlightChangeDateController.model = {
                optional : 'LCGMAD20220315092000',
                slicesId: [0, 1]
            };
            DisruptionFlightChangeDateController.genericDisruption = true;
            DisruptionFlightChangeDateController.blackOutPeriodsData = {maxDate : new Date('2050/11/10')};
            DisruptionFlightChangeDateController.strategy = fakeStrategy;
            DisruptionFlightChangeDateController.$onInit();
            expect(fakeDisruptionFlightChangeDateTransformer.initializeModel).toHaveBeenCalled();
            done();
        });
        it ('DisruptionFlightChangeDateController activate - false generic', function(done){
            DisruptionFlightChangeDateController.model = {
                optional : 'LCGMAD20220315092000',
                flights: {
                    LCGMAD20220315092000: {
                        optionalEnabled: true,
                        position: 1,
                        dateOptions: {
                            showWeeks: false,
                            maxMode: 'day',
                            minDate: {
                                _isAMomentObject: true,
                                _isUTC: false,
                                _pf: {
                                    empty: false,
                                    overflow: -2,
                                    charsLeftOver: 0,
                                    nullInput: false,
                                    invalidMonth: null,
                                    invalidFormat: false,
                                    userInvalidated: false,
                                    iso: false,
                                    meridiem: null
                                },
                                _locale: {
                                    _invalidDate: 'Invalid date',
                                    _ordinal: '%dº',
                                    _monthsParseExact: true,
                                    _weekdaysParseExact: true,
                                    _abbr: 'es'
                                },
                                _d: '2020-05-13T09:24:26.336Z',
                                _isValid: true
                            },
                            maxDate: {
                                _isAMomentObject: true,
                                _i: '2021-04-29T22:00:00.000Z',
                                _isUTC: false,
                                _pf: {
                                    empty: false,
                                    overflow: -2,
                                    charsLeftOver: 0,
                                    nullInput: false,
                                    invalidMonth: null,
                                    invalidFormat: false,
                                    userInvalidated: false,
                                    iso: false,
                                    meridiem: null
                                },
                                _locale: {
                                    _invalidDate: 'Invalid date',
                                    _ordinal: '%dº',
                                    _monthsParseExact: true,
                                    _weekdaysParseExact: true,
                                    _abbr: 'es'
                                },
                                _d: '2021-04-29T22:00:00.000Z',
                                _isValid: true
                            },
                            initDate: new Date('2050/11/10')
                        }
                    
                    }
                },
                slicesId: ['LCGMAD20220315092000']
            };
            DisruptionFlightChangeDateController.genericDisruption = false;
            DisruptionFlightChangeDateController.blackOutPeriodsData = {maxDate : new Date('2050/11/10')};
            DisruptionFlightChangeDateController.$onInit();
            expect(fakeDisruptionFlightChangeDateTransformer.initializeModel).toHaveBeenCalled();
            done();
        });
        it('DisruptionFlightChangeDateController should be defined', function () {
            DisruptionFlightChangeDateController.model = {
                optional: 'LCGMAD20220315092000',
                flights: {LCGMAD20220315092000:
                    {
                        optionalEnabled: true,
                        position: 1,
                        dateOptions: {
                            showWeeks: false,
                            maxMode: 'day',
                            minDate: {
                                _isAMomentObject: true,
                                _isUTC: false,
                                _pf: {
                                    empty: false,
                                    overflow: -2,
                                    charsLeftOver: 0,
                                    nullInput: false,
                                    invalidMonth: null,
                                    invalidFormat: false,
                                    userInvalidated: false,
                                    iso: false,
                                    meridiem: null
                                },
                                _locale: {
                                    _invalidDate: 'Invalid date',
                                    _ordinal: '%dº',
                                    _monthsParseExact: true,
                                    _weekdaysParseExact: true,
                                    _abbr: 'es'
                                },
                                _d: '2020-05-13T09:24:26.336Z',
                                _isValid: true
                            },
                            maxDate: {
                                _isAMomentObject: true,
                                _i: '2021-04-29T22:00:00.000Z',
                                _isUTC: false,
                                _pf: {
                                    empty: false,
                                    overflow: -2,
                                    charsLeftOver: 0,
                                    nullInput: false,
                                    invalidMonth: null,
                                    invalidFormat: false,
                                    userInvalidated: false,
                                    iso: false,
                                    meridiem: null
                                },
                                _locale: {
                                    _invalidDate: 'Invalid date',
                                    _ordinal: '%dº',
                                    _monthsParseExact: true,
                                    _weekdaysParseExact: true,
                                    _abbr: 'es'
                                },
                                _d: '2021-04-29T22:00:00.000Z',
                                _isValid: true
                            }
                        }
                    }
                },
                slicesId: ['LCGMAD20220315092000'],
                dateOptions: {
                    showWeeks: false,
                    maxMode: 'day',
                    minDate: {
                        _isAMomentObject: true,
                        _isUTC: false,
                        _pf: {
                            empty: false,
                            overflow: -2,
                            charsLeftOver: 0,
                            nullInput: false,
                            invalidMonth: null,
                            invalidFormat: false,
                            userInvalidated: false,
                            iso: false,
                            meridiem: null
                        },
                        _locale: {
                            _invalidDate: 'Invalid date',
                            _ordinal: '%dº',
                            _monthsParseExact: true,
                            _weekdaysParseExact: true,
                            _abbr: 'es'
                        },
                        _d: '2020-05-13T09:24:26.336Z',
                        _isValid: true
                    },
                    maxDate: {
                        _isAMomentObject: true,
                        _i: '2021-04-29T22:00:00.000Z',
                        _isUTC: false,
                        _pf: {
                            empty: false,
                            overflow: -2,
                            charsLeftOver: 0,
                            nullInput: false,
                            invalidMonth: null,
                            invalidFormat: false,
                            userInvalidated: false,
                            iso: false,
                            meridiem: null
                        },
                        _locale: {
                            _invalidDate: 'Invalid date',
                            _ordinal: '%dº',
                            _monthsParseExact: true,
                            _weekdaysParseExact: true,
                            _abbr: 'es'
                        },
                        _d: '2021-04-29T22:00:00.000Z',
                        _isValid: true
                    }
                }
            };
            fakeDisruptionFlightChangeDateTransformer.initializeModel(DisruptionFlightChangeDateController.model, true, 0, false)
        });

        it('test for DisruptionFlightChangeDateController.optionalFlightCheck', function () {
            DisruptionFlightChangeDateController.sisterCitiesData = {
                newSisterCitiesModel: {
                    'MADBIO20210731173500': {
                        origin: {
                            originSisterCities: [{code: 'MAD'}]
                        },
                        destination: {
                            destinationSisterCities: 'Bilbao'
                        },
                        originSisterCitiesNum: null,
                        destinationSisterCitiesNum: null,
                    },
                    referenceSliceId: "MADBIO20210731173500",
                    sisterCitiesOptionChecked: false,
                }
            };
           
            var object2 = {
                VIEW: 'view',
                LINK: 'link'
            }
            var optionalId = 1;
            MmBUtilService.isUserLogged = jasmine.createSpy().and.returnValue(false);
            
            DatalayerConstants.DATALAYER_EVENT_TYPES = object2;
            DisruptionFlightChangeDateController.model = {
                optional: 'LCGMAD20220315092000',
                flights: {LCGMAD20220315092000:
                    {
                        optionalEnabled: true,
                        position: 1,
                        dateOptions: {
                            showWeeks: false,
                            maxMode: 'day',
                            minDate: {
                                _isAMomentObject: true,
                                _isUTC: false,
                                _pf: {
                                    empty: false,
                                    overflow: -2,
                                    charsLeftOver: 0,
                                    nullInput: false,
                                    invalidMonth: null,
                                    invalidFormat: false,
                                    userInvalidated: false,
                                    iso: false,
                                    meridiem: null
                                },
                                _locale: {
                                    _invalidDate: 'Invalid date',
                                    _ordinal: '%dº',
                                    _monthsParseExact: true,
                                    _weekdaysParseExact: true,
                                    _abbr: 'es'
                                },
                                _d: '2020-05-13T09:24:26.336Z',
                                _isValid: true
                            },
                            maxDate: {
                                _isAMomentObject: true,
                                _i: '2021-04-29T22:00:00.000Z',
                                _isUTC: false,
                                _pf: {
                                    empty: false,
                                    overflow: -2,
                                    charsLeftOver: 0,
                                    nullInput: false,
                                    invalidMonth: null,
                                    invalidFormat: false,
                                    userInvalidated: false,
                                    iso: false,
                                    meridiem: null
                                },
                                _locale: {
                                    _invalidDate: 'Invalid date',
                                    _ordinal: '%dº',
                                    _monthsParseExact: true,
                                    _weekdaysParseExact: true,
                                    _abbr: 'es'
                                },
                                _d: '2021-04-29T22:00:00.000Z',
                                _isValid: true
                            }
                        }
                    }
                },
                slicesId: ['LCGMAD20220315092000'],
                dateOptions: {
                    showWeeks: false,
                    maxMode: 'day',
                    minDate: {
                        _isAMomentObject: true,
                        _isUTC: false,
                        _pf: {
                            empty: false,
                            overflow: -2,
                            charsLeftOver: 0,
                            nullInput: false,
                            invalidMonth: null,
                            invalidFormat: false,
                            userInvalidated: false,
                            iso: false,
                            meridiem: null
                        },
                        _locale: {
                            _invalidDate: 'Invalid date',
                            _ordinal: '%dº',
                            _monthsParseExact: true,
                            _weekdaysParseExact: true,
                            _abbr: 'es'
                        },
                        _d: '2020-05-13T09:24:26.336Z',
                        _isValid: true
                    },
                    maxDate: {
                        _isAMomentObject: true,
                        _i: '2021-04-29T22:00:00.000Z',
                        _isUTC: false,
                        _pf: {
                            empty: false,
                            overflow: -2,
                            charsLeftOver: 0,
                            nullInput: false,
                            invalidMonth: null,
                            invalidFormat: false,
                            userInvalidated: false,
                            iso: false,
                            meridiem: null
                        },
                        _locale: {
                            _invalidDate: 'Invalid date',
                            _ordinal: '%dº',
                            _monthsParseExact: true,
                            _weekdaysParseExact: true,
                            _abbr: 'es'
                        },
                        _d: '2021-04-29T22:00:00.000Z',
                        _isValid: true
                    }
                }
            };
            DisruptionFlightChangeDateController.optionalFlightCheck();
        });

        it('test 2 for DisruptionFlightChangeDateController.optionalFlightCheck', function () {
            DisruptionFlightChangeDateController.sisterCitiesData = {
                newSisterCitiesModel: {
                    'MADBIO20210731173500': {
                        origin: {
                            originSisterCities: [{code: 'MAD'}]
                        },
                        destination: {
                            destinationSisterCities: 'Bilbao'
                        },
                        originSisterCitiesNum: null,
                        destinationSisterCitiesNum: null,
                    },
                    referenceSliceId: "MADBIO20210731173500",
                    sisterCitiesOptionChecked: false,
                }
            };
            
            var object2 = {
                VIEW: 'view',
                LINK: 'link'
            }
            MmBUtilService.isUserLogged = jasmine.createSpy().and.returnValue(false);

            DatalayerConstants.DATALAYER_EVENT_TYPES = object2;
            DisruptionFlightChangeDateController.model = {
                optional: 'LCGMAD20220315092000',
                flights: {LCGMAD20220315092000:
                    {
                        optionalEnabled: true,
                        position: 0,
                        dateOptions: {
                            showWeeks: false,
                            maxMode: 'day',
                            minDate: {
                                _isAMomentObject: true,
                                _isUTC: false,
                                _pf: {
                                    empty: false,
                                    overflow: -2,
                                    charsLeftOver: 0,
                                    nullInput: false,
                                    invalidMonth: null,
                                    invalidFormat: false,
                                    userInvalidated: false,
                                    iso: false,
                                    meridiem: null
                                },
                                _locale: {
                                    _invalidDate: 'Invalid date',
                                    _ordinal: '%dº',
                                    _monthsParseExact: true,
                                    _weekdaysParseExact: true,
                                    _abbr: 'es'
                                },
                                _d: '2020-05-13T09:24:26.336Z',
                                _isValid: true
                            },
                            maxDate: {
                                _isAMomentObject: true,
                                _i: '2021-04-29T22:00:00.000Z',
                                _isUTC: false,
                                _pf: {
                                    empty: false,
                                    overflow: -2,
                                    charsLeftOver: 0,
                                    nullInput: false,
                                    invalidMonth: null,
                                    invalidFormat: false,
                                    userInvalidated: false,
                                    iso: false,
                                    meridiem: null
                                },
                                _locale: {
                                    _invalidDate: 'Invalid date',
                                    _ordinal: '%dº',
                                    _monthsParseExact: true,
                                    _weekdaysParseExact: true,
                                    _abbr: 'es'
                                },
                                _d: '2021-04-29T22:00:00.000Z',
                                _isValid: true
                            }
                        }
                    }
                },
                slicesId: ['LCGMAD20220315092000'],
                dateOptions: {
                    showWeeks: false,
                    maxMode: 'day',
                    minDate: {
                        _isAMomentObject: true,
                        _isUTC: false,
                        _pf: {
                            empty: false,
                            overflow: -2,
                            charsLeftOver: 0,
                            nullInput: false,
                            invalidMonth: null,
                            invalidFormat: false,
                            userInvalidated: false,
                            iso: false,
                            meridiem: null
                        },
                        _locale: {
                            _invalidDate: 'Invalid date',
                            _ordinal: '%dº',
                            _monthsParseExact: true,
                            _weekdaysParseExact: true,
                            _abbr: 'es'
                        },
                        _d: '2020-05-13T09:24:26.336Z',
                        _isValid: true
                    },
                    maxDate: {
                        _isAMomentObject: true,
                        _i: '2021-04-29T22:00:00.000Z',
                        _isUTC: false,
                        _pf: {
                            empty: false,
                            overflow: -2,
                            charsLeftOver: 0,
                            nullInput: false,
                            invalidMonth: null,
                            invalidFormat: false,
                            userInvalidated: false,
                            iso: false,
                            meridiem: null
                        },
                        _locale: {
                            _invalidDate: 'Invalid date',
                            _ordinal: '%dº',
                            _monthsParseExact: true,
                            _weekdaysParseExact: true,
                            _abbr: 'es'
                        },
                        _d: '2021-04-29T22:00:00.000Z',
                        _isValid: true
                    }
                }
            };
            DisruptionFlightChangeDateController.optionalFlightCheck();
        });

        it('test 3 for DisruptionFlightChangeDateController.optionalFlightCheck', function () {
            MmBUtilService.isUserLogged = jasmine.createSpy().and.returnValue(false);
            DisruptionFlightChangeDateController.sisterCitiesData = {
                newSisterCitiesModel: {
                    'MADBIO20210731173500': {
                        origin: {
                            originSisterCities: [{code: 'MAD'}]
                        },
                        destination: {
                            destinationSisterCities: 'Bilbao'
                        },
                        originSisterCitiesNum: null,
                        destinationSisterCitiesNum: null,
                    },
                    referenceSliceId: "MADBIO20210731173500",
                    sisterCitiesOptionChecked: false,
                }
            };
            DisruptionFlightChangeDateController.model = {
                optional: 'LCGMAD20220315092000',
                flights: {
                    LCGMAD20220315092000:
                    {
                        optionalEnabled: false,
                        position: 0,
                        dateOptions: {
                            showWeeks: false,
                            maxMode: 'day',
                            minDate: {
                                _isAMomentObject: true,
                                _isUTC: false,
                                _pf: {
                                    empty: false,
                                    overflow: -2,
                                    charsLeftOver: 0,
                                    nullInput: false,
                                    invalidMonth: null,
                                    invalidFormat: false,
                                    userInvalidated: false,
                                    iso: false,
                                    meridiem: null
                                },
                                _locale: {
                                    _invalidDate: 'Invalid date',
                                    _ordinal: '%dº',
                                    _monthsParseExact: true,
                                    _weekdaysParseExact: true,
                                    _abbr: 'es'
                                },
                                _d: '2020-05-13T09:24:26.336Z',
                                _isValid: true
                            },
                            maxDate: {
                                _isAMomentObject: true,
                                _i: '2021-04-29T22:00:00.000Z',
                                _isUTC: false,
                                _pf: {
                                    empty: false,
                                    overflow: -2,
                                    charsLeftOver: 0,
                                    nullInput: false,
                                    invalidMonth: null,
                                    invalidFormat: false,
                                    userInvalidated: false,
                                    iso: false,
                                    meridiem: null
                                },
                                _locale: {
                                    _invalidDate: 'Invalid date',
                                    _ordinal: '%dº',
                                    _monthsParseExact: true,
                                    _weekdaysParseExact: true,
                                    _abbr: 'es'
                                },
                                _d: '2021-04-29T22:00:00.000Z',
                                _isValid: true
                            }
                        },
                        arrivalDateParsed: 0
                    },
                    LCGMAD20220315092001:
                    {
                        
                        optionalEnabled: false,
                        position: 0,
                        dateOptions: {
                            showWeeks: false,
                            maxMode: 'day',
                            minDate: {
                                _isAMomentObject: true,
                                _isUTC: false,
                                _pf: {
                                    empty: false,
                                    overflow: -2,
                                    charsLeftOver: 0,
                                    nullInput: false,
                                    invalidMonth: null,
                                    invalidFormat: false,
                                    userInvalidated: false,
                                    iso: false,
                                    meridiem: null
                                },
                                _locale: {
                                    _invalidDate: 'Invalid date',
                                    _ordinal: '%dº',
                                    _monthsParseExact: true,
                                    _weekdaysParseExact: true,
                                    _abbr: 'es'
                                },
                                _d: '2020-05-13T09:24:26.336Z',
                                _isValid: true
                            },
                            maxDate: {
                                _isAMomentObject: true,
                                _i: '2021-04-29T22:00:00.000Z',
                                _isUTC: false,
                                _pf: {
                                    empty: false,
                                    overflow: -2,
                                    charsLeftOver: 0,
                                    nullInput: false,
                                    invalidMonth: null,
                                    invalidFormat: false,
                                    userInvalidated: false,
                                    iso: false,
                                    meridiem: null
                                },
                                _locale: {
                                    _invalidDate: 'Invalid date',
                                    _ordinal: '%dº',
                                    _monthsParseExact: true,
                                    _weekdaysParseExact: true,
                                    _abbr: 'es'
                                },
                                _d: '2021-04-29T22:00:00.000Z',
                                _isValid: true
                            }
                        }
                    }
                },
                slicesId: ['LCGMAD20220315092000', 'LCGMAD20220315092001'],
                dateOptions: {
                    showWeeks: false,
                    maxMode: 'day',
                    minDate: {
                        _isAMomentObject: true,
                        _isUTC: false,
                        _pf: {
                            empty: false,
                            overflow: -2,
                            charsLeftOver: 0,
                            nullInput: false,
                            invalidMonth: null,
                            invalidFormat: false,
                            userInvalidated: false,
                            iso: false,
                            meridiem: null
                        },
                        _locale: {
                            _invalidDate: 'Invalid date',
                            _ordinal: '%dº',
                            _monthsParseExact: true,
                            _weekdaysParseExact: true,
                            _abbr: 'es'
                        },
                        _d: '2020-05-13T09:24:26.336Z',
                        _isValid: true
                    },
                    maxDate: {
                        _isAMomentObject: true,
                        _i: '2021-04-29T22:00:00.000Z',
                        _isUTC: false,
                        _pf: {
                            empty: false,
                            overflow: -2,
                            charsLeftOver: 0,
                            nullInput: false,
                            invalidMonth: null,
                            invalidFormat: false,
                            userInvalidated: false,
                            iso: false,
                            meridiem: null
                        },
                        _locale: {
                            _invalidDate: 'Invalid date',
                            _ordinal: '%dº',
                            _monthsParseExact: true,
                            _weekdaysParseExact: true,
                            _abbr: 'es'
                        },
                        _d: '2021-04-29T22:00:00.000Z',
                        _isValid: true
                    }
                }
            };
            
            DisruptionFlightChangeDateController.optionalFlightCheck();
        });

        it('test 4 for DisruptionFlightChangeDateController.optionalFlightCheck', function () {
            MmBUtilService.isUserLogged = jasmine.createSpy().and.returnValue(false);
            DisruptionFlightChangeDateController.sisterCitiesData = {
                newSisterCitiesModel: {
                    'MADBIO20210731173500': {
                        origin: {
                            originSisterCities: [{code: 'MAD'}]
                        },
                        destination: {
                            destinationSisterCities: 'Bilbao'
                        },
                        originSisterCitiesNum: null,
                        destinationSisterCitiesNum: null,
                    },
                    referenceSliceId: "MADBIO20210731173500",
                    sisterCitiesOptionChecked: false,
                }
            };
            DisruptionFlightChangeDateController.model = {
                optional: 'LCGMAD20220315092000',
                flights: {
                    LCGMAD20220315092000:{
                        optionalEnabled: false,
                        position: 1,
                        dateOptions: {
                            showWeeks: false,
                            maxMode: 'day',
                            minDate: {
                                _isAMomentObject: true,
                                _isUTC: false,
                                _pf: {
                                    empty: false,
                                    overflow: -2,
                                    charsLeftOver: 0,
                                    nullInput: false,
                                    invalidMonth: null,
                                    invalidFormat: false,
                                    userInvalidated: false,
                                    iso: false,
                                    meridiem: null
                                },
                                _locale: {
                                    _invalidDate: 'Invalid date',
                                    _ordinal: '%dº',
                                    _monthsParseExact: true,
                                    _weekdaysParseExact: true,
                                    _abbr: 'es'
                                },
                                _d: '2020-05-13T09:24:26.336Z',
                                _isValid: true
                            },
                            maxDate: {
                                _isAMomentObject: true,
                                _i: '2021-04-29T22:00:00.000Z',
                                _isUTC: false,
                                _pf: {
                                    empty: false,
                                    overflow: -2,
                                    charsLeftOver: 0,
                                    nullInput: false,
                                    invalidMonth: null,
                                    invalidFormat: false,
                                    userInvalidated: false,
                                    iso: false,
                                    meridiem: null
                                },
                                _locale: {
                                    _invalidDate: 'Invalid date',
                                    _ordinal: '%dº',
                                    _monthsParseExact: true,
                                    _weekdaysParseExact: true,
                                    _abbr: 'es'
                                },
                                _d: '2021-04-29T22:00:00.000Z',
                                _isValid: true
                            }
                        },
                        departureDateParsed: 0
                    },
                    LCGMAD20220315092001: {
                        optionalEnabled: false,
                        position: 0,
                        dateOptions: {
                            showWeeks: false,
                            maxMode: 'day',
                            minDate: {
                                _isAMomentObject: true,
                                _isUTC: false,
                                _pf: {
                                    empty: false,
                                    overflow: -2,
                                    charsLeftOver: 0,
                                    nullInput: false,
                                    invalidMonth: null,
                                    invalidFormat: false,
                                    userInvalidated: false,
                                    iso: false,
                                    meridiem: null
                                },
                                _locale: {
                                    _invalidDate: 'Invalid date',
                                    _ordinal: '%dº',
                                    _monthsParseExact: true,
                                    _weekdaysParseExact: true,
                                    _abbr: 'es'
                                },
                                _d: '2020-05-13T09:24:26.336Z',
                                _isValid: true
                            },
                            maxDate: {
                                _isAMomentObject: true,
                                _i: '2021-04-29T22:00:00.000Z',
                                _isUTC: false,
                                _pf: {
                                    empty: false,
                                    overflow: -2,
                                    charsLeftOver: 0,
                                    nullInput: false,
                                    invalidMonth: null,
                                    invalidFormat: false,
                                    userInvalidated: false,
                                    iso: false,
                                    meridiem: null
                                },
                                _locale: {
                                    _invalidDate: 'Invalid date',
                                    _ordinal: '%dº',
                                    _monthsParseExact: true,
                                    _weekdaysParseExact: true,
                                    _abbr: 'es'
                                },
                                _d: '2021-04-29T22:00:00.000Z',
                                _isValid: true
                            }
                        }
                    }
                },
                slicesId: ['LCGMAD20220315092000', 'LCGMAD20220315092001'],
                dateOptions: {
                    showWeeks: false,
                    maxMode: 'day',
                    minDate: {
                        _isAMomentObject: true,
                        _isUTC: false,
                        _pf: {
                            empty: false,
                            overflow: -2,
                            charsLeftOver: 0,
                            nullInput: false,
                            invalidMonth: null,
                            invalidFormat: false,
                            userInvalidated: false,
                            iso: false,
                            meridiem: null
                        },
                        _locale: {
                            _invalidDate: 'Invalid date',
                            _ordinal: '%dº',
                            _monthsParseExact: true,
                            _weekdaysParseExact: true,
                            _abbr: 'es'
                        },
                        _d: '2020-05-13T09:24:26.336Z',
                        _isValid: true
                    },
                    maxDate: {
                        _isAMomentObject: true,
                        _i: '2021-04-29T22:00:00.000Z',
                        _isUTC: false,
                        _pf: {
                            empty: false,
                            overflow: -2,
                            charsLeftOver: 0,
                            nullInput: false,
                            invalidMonth: null,
                            invalidFormat: false,
                            userInvalidated: false,
                            iso: false,
                            meridiem: null
                        },
                        _locale: {
                            _invalidDate: 'Invalid date',
                            _ordinal: '%dº',
                            _monthsParseExact: true,
                            _weekdaysParseExact: true,
                            _abbr: 'es'
                        },
                        _d: '2021-04-29T22:00:00.000Z',
                        _isValid: true
                    }
                }
            };
            DisruptionFlightChangeDateController.optionalFlightCheck();
        });

        it('test 1 for DisruptionFlightChangeDateController.changeDate', function () {
            DisruptionFlightChangeDateController.sisterCitiesData = {
                newSisterCitiesModel: {
                    'MADBIO20210731173500': {
                        origin: {
                            originSisterCities: [{code: 'MAD'}]
                        },
                        destination: {
                            destinationSisterCities: 'Bilbao'
                        },
                        originSisterCitiesNum: null,
                        destinationSisterCitiesNum: null,
                    },
                    referenceSliceId: 'MADBIO20210731173500',
                    sisterCitiesOptionChecked: false,
                }
            };
            var object1 = {
                day: 3,
                month: 6,
                year: 2020,
                weekDay: 3
            }

            var object3 = {
                VIEW: 'view',
                LINK: 'link'
            }
            DisruptionFlightChangeDateTransformer.transformerDateSelected = jasmine.createSpy().and.returnValue(object1);
            MmBUtilService.isUserLogged = jasmine.createSpy().and.returnValue(false);
            //spyOn(DisruptionFlightChangeDateTransformer, 'transformerDateSelected').and.returnValue(object1);
            //spyOn(MmBUtilService, 'isUserLogged').and.returnValue(false);
            //spyOn(MmBDatalayerUtilsService, 'updateDatalayerWithQuadrigam').withArgs('CIFFRT', null, false);
            //spyOn(MmBDatalayerUtilsService, 'sendDatalayerEvent').withArgs('view');

            DatalayerConstants.DATALAYER_EVENT_TYPES = object3;
            DisruptionFlightChangeDateController.genericDisruption = true;
            DisruptionFlightChangeDateController.sisterCitiesData.newSisterCitiesModel.sisterCitiesOptionChecked = true;
            DisruptionFlightChangeDateController.originalFirstFlightMinDate = null;
            DisruptionFlightChangeDateController.model = {
                optional: 'LCGMAD20220315092001',
                numberFlights: 2,
                slicesId: ['LCGMAD20220315092000','LCGMAD20220315092001'],
                flights: {
                    LCGMAD20220315092000:{
                    optionalEnabled: false,
                    position: 1,
                    dateOptions: {
                        showWeeks: false,
                        maxMode: 'day',
                        minDate: {
                            _isAMomentObject: true,
                            _isUTC: false,
                            _pf: {
                                empty: false,
                                overflow: -2,
                                charsLeftOver: 0,
                                nullInput: false,
                                invalidMonth: null,
                                invalidFormat: false,
                                userInvalidated: false,
                                iso: false,
                                meridiem: null
                            },
                            _locale: {
                                _invalidDate: 'Invalid date',
                                _ordinal: '%dº',
                                _monthsParseExact: true,
                                _weekdaysParseExact: true,
                                _abbr: 'es'
                            },
                            _d: '2020-05-13T09:24:26.336Z',
                            _isValid: true
                        },
                        maxDate: {
                            _isAMomentObject: true,
                            _i: '2021-04-29T22:00:00.000Z',
                            _isUTC: false,
                            _pf: {
                                empty: false,
                                overflow: -2,
                                charsLeftOver: 0,
                                nullInput: false,
                                invalidMonth: null,
                                invalidFormat: false,
                                userInvalidated: false,
                                iso: false,
                                meridiem: null
                            },
                            _locale: {
                                _invalidDate: 'Invalid date',
                                _ordinal: '%dº',
                                _monthsParseExact: true,
                                _weekdaysParseExact: true,
                                _abbr: 'es'
                            },
                            _d: '2021-04-29T22:00:00.000Z',
                            _isValid: true
                        }
                    },
                    departureDateParsed: 0,
                    newDateSelected: true
                },
                LCGMAD20220315092001:{
                    optionalEnabled: true,
                    position: 0,
                    dateOptions: {
                        showWeeks: false,
                        maxMode: 'day',
                        minDate: {
                            _isAMomentObject: true,
                            _isUTC: false,
                            _pf: {
                                empty: false,
                                overflow: -2,
                                charsLeftOver: 0,
                                nullInput: false,
                                invalidMonth: null,
                                invalidFormat: false,
                                userInvalidated: false,
                                iso: false,
                                meridiem: null
                            },
                            _locale: {
                                _invalidDate: 'Invalid date',
                                _ordinal: '%dº',
                                _monthsParseExact: true,
                                _weekdaysParseExact: true,
                                _abbr: 'es'
                            },
                            _d: '2020-05-13T09:24:26.336Z',
                            _isValid: true
                        },
                        maxDate: {
                            _isAMomentObject: true,
                            _i: '2021-04-29T22:00:00.000Z',
                            _isUTC: false,
                            _pf: {
                                empty: false,
                                overflow: -2,
                                charsLeftOver: 0,
                                nullInput: false,
                                invalidMonth: null,
                                invalidFormat: false,
                                userInvalidated: false,
                                iso: false,
                                meridiem: null
                            },
                            _locale: {
                                _invalidDate: 'Invalid date',
                                _ordinal: '%dº',
                                _monthsParseExact: true,
                                _weekdaysParseExact: true,
                                _abbr: 'es'
                            },
                            _d: '2021-04-29T22:00:00.000Z',
                            _isValid: true
                        }
                    }
                }
            }
            };
            spyOn(DisruptionFlightChangeDateController, 'checkMaxDate').and.callThrough();
            DisruptionFlightChangeDateController.changeDate(0);
            expect(DisruptionFlightChangeDateController.checkMaxDate).toHaveBeenCalled();
            //expect(DisruptionFlightChangeDateController.quadrigam).toBe('CIFFRT');
        });
        xit('test 1 for DisruptionFlightChangeDateController.changeDate with optionalEnabled false', function () {
            DisruptionFlightChangeDateController.sisterCitiesData = {
                newSisterCitiesModel: {
                    'MADBIO20210731173500': {
                        origin: {
                            originSisterCities: [{code: 'MAD'}]
                        },
                        destination: {
                            destinationSisterCities: 'Bilbao'
                        },
                        originSisterCitiesNum: null,
                        destinationSisterCitiesNum: null,
                    },
                    referenceSliceId: "MADBIO20210731173500",
                    sisterCitiesOptionChecked: false,
                }
            };
            var object1 = {
                day: 3,
                month: 6,
                year: 2020,
                weekDay: 3
            }
            
            var object3 = {
                VIEW: 'view',
                LINK: 'link'
            }
            DisruptionFlightChangeDateTransformer.transformerDateSelected = jasmine.createSpy().and.returnValue(object1);
            MmBUtilService.isUserLogged = jasmine.createSpy().and.returnValue(false);
            //spyOn(DisruptionFlightChangeDateTransformer, 'transformerDateSelected').and.returnValue(object1);
            //spyOn(MmBUtilService, 'isUserLogged').and.returnValue(false);
            //spyOn(MmBDatalayerUtilsService, 'updateDatalayerWithQuadrigam').withArgs('CIFFRT', null, false);
            //spyOn(MmBDatalayerUtilsService, 'sendDatalayerEvent').withArgs('view');

            DatalayerConstants.DATALAYER_EVENT_TYPES = object3;
            DisruptionFlightChangeDateController.genericDisruption = true;
            DisruptionFlightChangeDateController.sisterCitiesData.newSisterCitiesModel.sisterCitiesOptionChecked = true;
            DisruptionFlightChangeDateController.originalFirstFlightMinDate = null;
            DisruptionFlightChangeDateController.model = {
                optional: 'LCGMAD20220315092001',
                numberFlights: 2,
                slicesId: ['LCGMAD20220315092000','LCGMAD20220315092001'],
                flights: {LCGMAD20220315092000:{
                    optionalEnabled: false,
                    position: 1,
                    dateOptions: {
                        showWeeks: false,
                        maxMode: 'day',
                        minDate: {
                            _isAMomentObject: true,
                            _isUTC: false,
                            _pf: {
                                empty: false,
                                overflow: -2,
                                charsLeftOver: 0,
                                nullInput: false,
                                invalidMonth: null,
                                invalidFormat: false,
                                userInvalidated: false,
                                iso: false,
                                meridiem: null
                            },
                            _locale: {
                                _invalidDate: 'Invalid date',
                                _ordinal: '%dº',
                                _monthsParseExact: true,
                                _weekdaysParseExact: true,
                                _abbr: 'es'
                            },
                            _d: '2020-05-13T09:24:26.336Z',
                            _isValid: true
                        },
                        maxDate: {
                            _isAMomentObject: true,
                            _i: '2021-04-29T22:00:00.000Z',
                            _isUTC: false,
                            _pf: {
                                empty: false,
                                overflow: -2,
                                charsLeftOver: 0,
                                nullInput: false,
                                invalidMonth: null,
                                invalidFormat: false,
                                userInvalidated: false,
                                iso: false,
                                meridiem: null
                            },
                            _locale: {
                                _invalidDate: 'Invalid date',
                                _ordinal: '%dº',
                                _monthsParseExact: true,
                                _weekdaysParseExact: true,
                                _abbr: 'es'
                            },
                            _d: '2021-04-29T22:00:00.000Z',
                            _isValid: true
                        }
                    },
                    departureDateParsed: 0,
                    newDateSelected: true
                },
                LCGMAD20220315092001:
                {
                    optionalEnabled: false,
                    position: 0,
                    dateOptions: {
                        showWeeks: false,
                        maxMode: 'day',
                        minDate: {
                            _isAMomentObject: true,
                            _isUTC: false,
                            _pf: {
                                empty: false,
                                overflow: -2,
                                charsLeftOver: 0,
                                nullInput: false,
                                invalidMonth: null,
                                invalidFormat: false,
                                userInvalidated: false,
                                iso: false,
                                meridiem: null
                            },
                            _locale: {
                                _invalidDate: 'Invalid date',
                                _ordinal: '%dº',
                                _monthsParseExact: true,
                                _weekdaysParseExact: true,
                                _abbr: 'es'
                            },
                            _d: '2020-05-13T09:24:26.336Z',
                            _isValid: true
                        },
                        maxDate: {
                            _isAMomentObject: true,
                            _i: '2021-04-29T22:00:00.000Z',
                            _isUTC: false,
                            _pf: {
                                empty: false,
                                overflow: -2,
                                charsLeftOver: 0,
                                nullInput: false,
                                invalidMonth: null,
                                invalidFormat: false,
                                userInvalidated: false,
                                iso: false,
                                meridiem: null
                            },
                            _locale: {
                                _invalidDate: 'Invalid date',
                                _ordinal: '%dº',
                                _monthsParseExact: true,
                                _weekdaysParseExact: true,
                                _abbr: 'es'
                            },
                            _d: '2021-04-29T22:00:00.000Z',
                            _isValid: true
                        }
                    }
                }}
            };
            DisruptionFlightChangeDateController.changeDate(0);
            expect(DisruptionFlightChangeDateController.quadrigam).toBe('CIFFOW');
        });
        xit('test 2 for DisruptionFlightChangeDateController.changeDate', function () {

            DisruptionFlightChangeDateController.sisterCitiesData = {
                newSisterCitiesModel: {
                    'MADBIO20210731173500': {
                        origin: {
                            originSisterCities: [{code: 'MAD'}]
                        },
                        destination: {
                            destinationSisterCities: 'Bilbao'
                        },
                        originSisterCitiesNum: null,
                        destinationSisterCitiesNum: null,
                    },
                    referenceSliceId: "MADBIO20210731173500",
                    sisterCitiesOptionChecked: false,
                }
            };
            var object1 = {
                day: 3,
                month: 6,
                year: 2020,
                weekDay: 3
            }
            var object3 = {
                VIEW: 'view',
                LINK: 'link'
            }
            DisruptionFlightChangeDateTransformer.transformerDateSelected = jasmine.createSpy().and.returnValue(object1);
            MmBUtilService.isUserLogged = jasmine.createSpy().and.returnValue(false);
            //spyOn(DisruptionFlightChangeDateTransformer, 'transformerDateSelected').and.returnValue(object1);
            //spyOn(MmBUtilService, 'isUserLogged').and.returnValue(false);
            //spyOn(MmBDatalayerUtilsService, 'updateDatalayerWithQuadrigam').withArgs('CIFFRT', null, false);
            //spyOn(MmBDatalayerUtilsService, 'sendDatalayerEvent').withArgs('view');

            DatalayerConstants.DATALAYER_EVENT_TYPES = object3;
            DisruptionFlightChangeDateController.genericDisruption = true;
            DisruptionFlightChangeDateController.originalFirstFlightMinDate = null;
            DisruptionFlightChangeDateController.model = {
                optional: 'LCGMAD20220315092000',
                numberFlights: 2,
                slicesId: ['LCGMAD20220315092000','LCGMAD20220315092001'],
                flights: {LCGMAD20220315092000:{
                    optionalEnabled: false,
                    position: 1,
                    dateOptions: {
                        showWeeks: false,
                        maxMode: 'day',
                        minDate: {
                            _isAMomentObject: true,
                            _isUTC: false,
                            _pf: {
                                empty: false,
                                overflow: -2,
                                charsLeftOver: 0,
                                nullInput: false,
                                invalidMonth: null,
                                invalidFormat: false,
                                userInvalidated: false,
                                iso: false,
                                meridiem: null
                            },
                            _locale: {
                                _invalidDate: 'Invalid date',
                                _ordinal: '%dº',
                                _monthsParseExact: true,
                                _weekdaysParseExact: true,
                                _abbr: 'es'
                            },
                            _d: '2020-05-13T09:24:26.336Z',
                            _isValid: true
                        },
                        maxDate: {
                            _isAMomentObject: true,
                            _i: '2021-04-29T22:00:00.000Z',
                            _isUTC: false,
                            _pf: {
                                empty: false,
                                overflow: -2,
                                charsLeftOver: 0,
                                nullInput: false,
                                invalidMonth: null,
                                invalidFormat: false,
                                userInvalidated: false,
                                iso: false,
                                meridiem: null
                            },
                            _locale: {
                                _invalidDate: 'Invalid date',
                                _ordinal: '%dº',
                                _monthsParseExact: true,
                                _weekdaysParseExact: true,
                                _abbr: 'es'
                            },
                            _d: '2021-04-29T22:00:00.000Z',
                            _isValid: true
                        }
                    },
                    departureDateParsed: 0,
                    newDateSelected: true
                },
                LCGMAD20220315092001:
                {
                    optionalEnabled: false,
                    position: 0,
                    dateOptions: {
                        showWeeks: false,
                        maxMode: 'day',
                        minDate: {
                            _isAMomentObject: true,
                            _isUTC: false,
                            _pf: {
                                empty: false,
                                overflow: -2,
                                charsLeftOver: 0,
                                nullInput: false,
                                invalidMonth: null,
                                invalidFormat: false,
                                userInvalidated: false,
                                iso: false,
                                meridiem: null
                            },
                            _locale: {
                                _invalidDate: 'Invalid date',
                                _ordinal: '%dº',
                                _monthsParseExact: true,
                                _weekdaysParseExact: true,
                                _abbr: 'es'
                            },
                            _d: '2020-05-13T09:24:26.336Z',
                            _isValid: true
                        },
                        maxDate: {
                            _isAMomentObject: true,
                            _i: '2021-04-29T22:00:00.000Z',
                            _isUTC: false,
                            _pf: {
                                empty: false,
                                overflow: -2,
                                charsLeftOver: 0,
                                nullInput: false,
                                invalidMonth: null,
                                invalidFormat: false,
                                userInvalidated: false,
                                iso: false,
                                meridiem: null
                            },
                            _locale: {
                                _invalidDate: 'Invalid date',
                                _ordinal: '%dº',
                                _monthsParseExact: true,
                                _weekdaysParseExact: true,
                                _abbr: 'es'
                            },
                            _d: '2021-04-29T22:00:00.000Z',
                            _isValid: true
                        }
                    }
                }}
            };
            DisruptionFlightChangeDateController.changeDate(1);
            expect(DisruptionFlightChangeDateController.quadrigam).toBe(undefined);
        });
    });
});
