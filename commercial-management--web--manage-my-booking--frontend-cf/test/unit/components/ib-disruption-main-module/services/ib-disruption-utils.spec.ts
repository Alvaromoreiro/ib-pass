describe('test for DisruptionUtilService', function () {
    let DisruptionDashboardConstants;
    let EvaluatorConst;
    let  rootScope;
    let fakeMmBAppConstants = {
        QUADRIGAM: {
            FLEXIBILIZATION_INVOLUNTARY_SEARCH_ONE_WAY : {},
            FLEXIBILIZATION_INVOLUNTARY_SEARCH_WITH_RETURN : {},
            DISRUPTION_CHANGE_WITHOUT_ALTERNATIVE_WITHOUT_FLEXIBILIZATION: {},
            DISRUPTION_CHANGE_WITH_ALTERNATIVE_AND_FLEXIB_TOTAL : 'CITORE',
            DISRUPTION_CHANGE_WITH_ONLY_ALTERNATIVE_TOTAL: {},
            DISRUPTION_CHANGE_WITH_ALTERNATIVE_FLEXIB_PARCIAL: 'CIPARE',
            DISRUPTION_CHANGE_WITH_ONLY_ALTERNATIVE_PARCIAL: {},
            DISRUPTION_CHANGE_TIME: {},
            CONFIRMATION_CHANGE_WITH_ALTERNATIVE_AND_FLEXIB_TOTAL: 'CITOBK',
            CONFIRMATION_CHANGE_WITH_ALTERNATIVE_AND_FLEXIB_TOTAL_OPTIONAL: 'CIPTBK',
        },
    };
    let mockWarningSlice = {'order':{
        'slices':[
            {
                'segments' :[
                    {
                        'id' : 'sgm1',
                        'status':{
                            'code':'TK'
                        },
                        'flown': true,
                        'relatedDisruptedSegmentId':'ID001',
                        'warnings':[
                            {
                                'code': 'SSE_ORM_20013',
                                'description' : 'Descripción valida'
                            }
                        ]
                    }
                ]
            }
        ]
    }};
    let fakeDowngradeCodes = [{
        SEGMENT_WARNINGS: {
            'SAME_FLIGHT_SAME_TIME': 'SSE_ORM_9429',
            'DIFF_FLIGHT_OR_TIME': 'SSE_ORM_9430',
            'SAME_FLIGHT_SAME_TIME_UNTK': 'SSE_ORM_9433'
        }
    }];
    let fakeDatalayerUtilsService = {
        'updateDatalayerWithQuadrigam': jasmine.createSpy(),
        'sendDatalayerEvent': jasmine.createSpy(),
        'setProcessAndStep': jasmine.createSpy()
    };
    let fakeMmBUtilsSharedService = {
        'getProcessByStatus': jasmine.createSpy(),
        'updateQuadrigam': jasmine.createSpy()
    };
    var fakeDatalayerConstants = {
        DATALAYER_EVENT_TYPES: {
            'VIEW': 'TEST_4'
        },
        DIGITAL_DATA_PROCESS: {
            CIPARE: 'test'
        },
        DIGITAL_DATA_STEP: {
            CIPARE: 'test'
        },
    }
    let DisruptionUtilService;
    let localStorageService;
    beforeEach(function () {
        angular.mock.module('LocalStorageModule', 'ib-disruption-main-module', 'ib-MmB-filters-module', 'ngCookies', function ($provide) {
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('MMBDatalayerConstants', fakeDatalayerConstants);
            $provide.value('MmBUtilsSharedService', fakeMmBUtilsSharedService);
        });
        inject(function ($rootScope, _DisruptionUtilService_, _localStorageService_, _DisruptionDashboardConstants_, _EvaluatorConst_) {
            DisruptionUtilService = _DisruptionUtilService_;
            rootScope = $rootScope;
            localStorageService = _localStorageService_;
            DisruptionDashboardConstants = _DisruptionDashboardConstants_,
            EvaluatorConst = _EvaluatorConst_;

            localStorageService.set('downgradeCodes', fakeDowngradeCodes);
        });
        spyOn(DisruptionUtilService, 'getDisruptionType').and.returnValue(
            DisruptionDashboardConstants.DISRUPTION_TYPES.TYPE_CANCEL_REACOM
        );
    });
    describe('test for DisruptionUtilService', function () {

        it('DisruptionUtilService should be defined', function (done) {
            expect(DisruptionUtilService).toBeDefined();
            done();
        });



        describe('When evaluateRule is called', function(){
            it('When evaluateRule is called with a NOT operator', function(){
                let orderFlags, evalObject, result;
                evalObject = {
                    RULES :[
                        {'type' : 'oper', 'value' : 'NOT'},
                        {'type' : 'flag', 'value': 'FLAG_1'},
                    ]
                };
                orderFlags = [
                    {
                        type: 'FLAG_1',
                        enabled: false
                    }
                ];
                result = DisruptionUtilService.evaluateRule(orderFlags, evalObject);
                expect(result).toBe(true);
            });
            it('When evaluateRule is called without a NOT operator', function(){
                let orderFlags, evalObject, result;
                evalObject = {
                    RULES :[
                        {'type' : 'flag', 'value': 'FLAG_1'},
                        {'type' : 'oper', 'value' : 'OR'},
                        {'type' : 'flag', 'value': 'FLAG_2'},
                    ]
                };
                orderFlags = [
                    {
                        type: 'FLAG_1',
                        enabled: false
                    },
                    {
                        type: 'FLAG_2',
                        enabled: true
                    }
                ];
                result = DisruptionUtilService.evaluateRule(orderFlags, evalObject);
                expect(result).toBe(true);
            });
            it('When evaluateRule is called with several operators', function(){
                let orderFlags, evalObject, result;
                evalObject = {
                    RULES :[
                        {'type' : 'flag', 'value': 'FLAG_1'},
                        {'type' : 'oper', 'value' : 'AND'},
                        {'type' : 'flag', 'value': 'FLAG_2'},
                        {'type' : 'oper', 'value' : 'NAND'},
                        {'type' : 'flag', 'value' : 'FLAG_3'},
                    ]
                };
                orderFlags = [
                    {
                        type: 'FLAG_1',
                        enabled: true
                    },
                    {
                        type: 'FLAG_2',
                        enabled: true
                    },
                    {
                        type: 'FLAG_3',
                        enabled: false
                    }
                ];
                result = DisruptionUtilService.evaluateRule(orderFlags, evalObject);
                expect(result).toBe(true);
            });
        });


        it('test for DisruptionUtilService.isFlightRefundEnabled', function () {
            let array1 = [
                {
                    flag: 'VOUCHER_PARTIAL_REFUND '
                },
                {
                    flag: 'VOUCHER_TOTAL_REFUND'
                },
                {
                    flag: 'CASH_PARTIAL_REFUND '
                },
                {
                    flag: 'CASH_TOTAL_REFUND'
                }
            ]
            let array2 = [
                {
                    type: 'PRINT_ITINERARY',
                    enabled: false
                },
                {
                    type: 'ON_BUSINESS_MODIFICATION',
                    enabled: false
                },
                {
                    type: 'VOUCHER_TOTAL_REFUND',
                    enabled: false
                },
                {
                    type: 'VOUCHER_PARTIAL_REFUND',
                    enabled: false
                },
                {
                    type: 'CASH_TOTAL_REFUND',
                    enabled: false
                },
                {
                    type: 'CASH_PARTIAL_REFUND',
                    enabled: false
                }
            ]
            let object11 = {
                code: 'COVID19',
                description: ''
            }
            let ret;

            ret = DisruptionUtilService.isFlightRefundEnabled(array2, object11);

            expect(ret).toBe(false);
        });

        describe('tests for Criteria Functions', function(){
            it('Test criteriaScheduleChange with TK and return data ', function(done){
                let result, data;
                data = {
                    'segments' :[
                        {
                            'status':{
                                'code':'TK'
                            },
                            'relatedDisruptedSegmentId':'ID001'
                        }
                    ]
                }
                DisruptionUtilService.criteriaScheduleChange(data);
                done();
            });
            it('Test criteriaScheduleChange with TK and return data ', function(done){
                let result, data;
                data = {
                    'segments' :[
                        {
                            'status':{
                                'code':'TK'
                            },
                        }
                    ]
                }
                DisruptionUtilService.criteriaScheduleChange(data);
                done();
            });
            it('Test criteriaScheduleChange with UN and return based status ', function(done){
                let result, data;
                data = {
                    'segments' :[
                        {
                            'status':{
                                'code':'UN'
                            },
                            'relatedDisruptedSegmentId':'ID001'
                        }
                    ]
                }
                DisruptionUtilService.criteriaScheduleChange(data);
                done();
            });
            it('Test criteriaFlightChange with UN and return based status ', function(done){
                let result, data;
                data = {
                    'segments' :[
                        {
                            'status':{
                                'code':'UN'
                            },
                        }
                    ]
                }
                DisruptionUtilService.criteriaScheduleChange(data);
                done();
            });
            it('Test criteriaFlightChange with UN and return based status ', function(done){
                let result, data;
                data = {
                    'segments' :[
                        {
                            'status':{
                                'code':'UN'
                            },
                        }
                    ]
                }
                DisruptionUtilService.criteriaScheduleChange(data);
                done();
            });
            it('Test criteriaFlightChange with UN and return based status ', function(done){
                let result, data;
                data = {
                    'segments' :[
                        {
                            'status':{
                                'code':'TK'
                            },
                            'relatedDisruptedSegmentId':'ID001'
                        }
                    ]
                }
                DisruptionUtilService.criteriaFlightChange(data);
                done();
            });
            it('Test criteriaFlightConfirmed with UN and return based status ', function(done){
                let result, data;
                data = {
                    'segments' :[
                        {
                            'status':{
                                'code':'UN'
                            },
                            'relatedDisruptedSegmentId':'ID001'
                        },
                        {
                            'status':{
                                'code':'TK'
                            },
                            'relatedDisruptedSegmentId':'ID001'
                        }
                    ]
                }
                DisruptionUtilService.criteriaFlightConfirmed(data);
                done();
            });
            it('Test criteriaFlightConfirmed with UN and return based status ', function(done){
                let result, data;
                data = {
                    'segments' :[
                        {
                            'status':{
                                'code':'HK'
                            },
                            'flown': true,
                            'relatedDisruptedSegmentId':'ID001'
                        },
                    ]
                }
                DisruptionUtilService.criteriaFlightConfirmed(data);
                done();
            });
            it('Test criteriaFlightSearchEnabled with UN and return based status ', function(done){
                let result, data;
                data = {
                    'segments' :[
                        {
                            'status':{
                                'code':'HK'
                            },
                            'flown': true,
                            'relatedDisruptedSegmentId':'ID001'
                        },
                    ],
                    'passengerFlags':[
                        {
                            'flags':[
                                {
                                    'type': 'FLIGHT_MODIFICATION',
                                    'enabled': false
                                },
                                {
                                    'type': 'FLIGHT_REFUND',
                                    'enabled': false
                                },
                                {
                                    'type': 'FREQUENT_FLYER_MODIFICATION',
                                    'enabled': true
                                }
                            ]
                        }
                    ]
                }
                DisruptionUtilService.criteriaFlightSearchEnabled(data);
                done();
            });
            it('Test criteriaAlternmativeChange with UN and return based status ', function(done){
                let result, data;
                data = {
                    'segments' :[
                        {
                            'status':{
                                'code':'TK'
                            },
                            'flown': true,
                            'relatedDisruptedSegmentId':'ID001'
                        },
                        {
                            'status':{
                                'code':'UN'
                            },
                            'flown': true,
                            'relatedDisruptedSegmentId':'ID001'
                        },
                    ]
                }
                DisruptionUtilService.criteriaAlternmativeChange(data);
                done();
            });
            it('Test criteriaNone with UN and return based status ', function(done){
                let result, data;
                data = {
                    'segments' :[
                        {
                            'status':{
                                'code':'TK'
                            },
                            'flown': true,
                            'relatedDisruptedSegmentId':'ID001'
                        },
                        {
                            'status':{
                                'code':'UN'
                            },
                            'flown': true,
                            'relatedDisruptedSegmentId':'ID001'
                        },
                    ]
                }
                DisruptionUtilService.criteriaNone(data);
                done();
            });
        });

        it('Test getDisruptionType with CANCELATION_CHANGE_NO_REACOM_MISSCONECTION  ', function(done){
            localStorageService.set('bookingInfo', mockWarningSlice);
            DisruptionUtilService.getDisruptionType('UNCONFIRMED_CHANGES ', null, true);
            DisruptionUtilService.getDisruptionType('UNCONFIRMED_CHANGES ', {}, false);
            done();
        });
        it('Test getDisruptionType with UN a', function(done){
            localStorageService.set('bookingInfo', mockWarningSlice);
            DisruptionUtilService.getDisruptionType('ACCEPT_CHANGES_PENDING', null, true);
            DisruptionUtilService.getDisruptionType('ACCEPT_CHANGES_PENDING', {}, false);
            done();
        });
        it('Test getDisruptionType with UN b', function(done){
            localStorageService.set('bookingInfo', mockWarningSlice);
            DisruptionUtilService.getDisruptionType('ACCEPT_CHANGES_PENDING', {}, false);
            done();
        });
        it('Test getDisruptionType with UN c', function(done){
            localStorageService.set('bookingInfo', mockWarningSlice);
            DisruptionUtilService.getDisruptionType('ACCEPT_CHANGES_PENDING_TK', null, true);
            DisruptionUtilService.getDisruptionType('ACCEPT_CHANGES_PENDING_TK', {}, false);
            done();
        });
        it('Test getDisruptionType with UN d', function(done){
            localStorageService.set('bookingInfo', mockWarningSlice);
            DisruptionUtilService.getDisruptionType('UNCONFIRMED_CHANGES_MIXED', null, true);
            DisruptionUtilService.getDisruptionType('UNCONFIRMED_CHANGES_MIXED', {}, false);
            done();
        });
        it('Test getDisruptionType with UN e', function(done){
            localStorageService.set('bookingInfo', mockWarningSlice);
            DisruptionUtilService.getDisruptionType('ACCEPT_CHANGES_PENDING_MIXED', null, true);
            DisruptionUtilService.getDisruptionType('ACCEPT_CHANGES_PENDING_MIXED', {}, false);
            done();
        });
        it('Test getDisruptionType with UN f', function(done){
            localStorageService.set('bookingInfo', mockWarningSlice);
            DisruptionUtilService.getDisruptionType('CANCELATION_CHANGES', null, true);
            DisruptionUtilService.getDisruptionType('CANCELATION_CHANGES', {}, false);
            done();
        });
        it('Test getDisruptionType with UN g', function(done){
            localStorageService.set('bookingInfo', mockWarningSlice);
            DisruptionUtilService.getDisruptionType('WAITLIST_CONFIRMED_CHANGES', null, true);
            DisruptionUtilService.getDisruptionType('WAITLIST_CONFIRMED_CHANGES', {}, false);
            done();
        });
        it('Test getDisruptionType with UN h', function(done){
            localStorageService.set('bookingInfo', mockWarningSlice);
            DisruptionUtilService.getDisruptionType('DISRUPTION_CHANGES_MIXED', null, true);
            DisruptionUtilService.getDisruptionType('DISRUPTION_CHANGES_MIXED', {}, false);
            done();
        });

        it('test for DisruptionUtilService.searchSlices', function () {

            let object1 = {
                orderId: 'Qm9va2luZ0BJQmUyODI3MWI4ZGE2ZDRjMGZhN2IwNGY0YWM1NmU0NzA2T1A%3D',
                status: 'UNCONFIRMED_CHANGES',
                bookingReferences: [
                    {
                        provider: '1A',
                        reference: 'SLVOAU'
                    }
                ],
                orderItems: [
                    {
                        type: 'flight',
                        orderItemId: 'IBe28271b8da6d4c0fa7b04f4ac56e4706OP_01',
                        bookingReferences: [
                            {
                                provider: '1A',
                                reference: 'SLVOAU'
                            }
                        ],
                        price: {
                            fare: 308,
                            tax: 21.47,
                            total: 329.47,
                            currency: 'EUR',
                            ticketingFee: 0
                        },
                        sliceIds: [
                            'MADIBZ20200718114500',
                            'IBZPMI20200718143000'
                        ],
                        passengerPrices: [
                            {
                                fareCalculation: 'MAD IB IBZ223.00IB PMI85.00EUR308.00END',
                                passengerId: 'ADULT_01'
                            }
                        ]
                    }
                ],
                slices: [
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
                                arrivalUtcDateTime: '2020-07-18T11:00:00.000'
                            }
                        ],
                        overnight: false,
                        passengerFlags: [
                            {
                                passengerId: 'ADULT_01'
                            }
                        ]
                    },
                    {
                        sliceId: 'IBZPMI20200718143000',
                        type: 'REGULAR',
                        departureDateTime: '2020-07-18 14:30',
                        arrivalDateTime: '2020-07-18 15:15',
                        duration: 45,
                        stopsNumber: 0,
                        price: {
                            fare: 85,
                            currency: 'EUR'
                        },
                        detailedPrices: [
                            {
                                fare: 85,
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
                                id: 'IB851920200718',
                                duration: 45,
                                waitingTime: 0,
                                operatorLocator: null,
                                stop: null,
                                departureDateTime: '2020-07-18 14:30',
                                departureUtcDateTime: '2020-07-18T12:30:00.000',
                                arrivalDateTime: '2020-07-18 15:15',
                                arrivalUtcDateTime: '2020-07-18T13:15:00.000'
                            }
                        ],
                        overnight: false,
                        passengerFlags: [
                            {
                                passengerId: 'ADULT_01'
                            }
                        ]
                    }
                ],
                price: {
                    fare: 308,
                    tax: 21.47,
                    total: 329.47,
                    currency: 'EUR',
                    ticketingFee: 0
                },
                primaryContactInfo: {
                    phone: '34236558877',
                    email: 'ACCEPT@ACCEPT.COM',
                    phoneType: 'MOBILE'
                },
                optionalInformation: [],
                cashAviosPossibilities: [],
                specialDiscounts: [],
                checkedBagAllowances: [
                    {
                        type: 'PIECE',
                        segmentIds: [
                            'IB380820200718',
                            'IB851920200718'
                        ],
                        totalQuantity: 1
                    }
                ],
                aviosRedeemed: null,
                pointsRedeemed: null,
                phonesList: null
            }
            let ret = DisruptionUtilService.searchSlices(object1, jasmine.createSpy('function1')
                .and.returnValue({
                    isCriteriaOk: true,
                    filterSlice: object1.slices
                }));

            expect(ret).toBeDefined();
        });

        it('test for DisruptionUtilService.searchSlices', function () {

            let object1 = {
                orderId: 'Qm9va2luZ0BJQjQyYzNlMWI5M2FkYjQyNDhhYzZjNzM2YzExNmIyYWMzT1A%3D',
                status: 'UNCONFIRMED_CHANGES',
                bookingReferences: [
                    {
                        provider: 'IB',
                        reference: 'KYMEB'
                    },
                    {
                        provider: '1A',
                        reference: 'THFZCP'
                    }
                ],
                orderItems: [
                    {
                        type: 'flight',
                        orderItemId: 'IB42c3e1b93adb4248ac6c736c116b2ac3OP_01',
                        bookingReferences: [
                            {
                                provider: 'IB',
                                reference: 'KYMEB'
                            },
                            {
                                provider: '1A',
                                reference: 'THFZCP'
                            }
                        ],
                        price: {
                            fare: 385,
                            tax: 63.08,
                            total: 448.08,
                            currency: 'EUR',
                            ticketingFee: 0
                        },
                        sliceIds: [
                            'MADBIO20200618074000',
                            'BIOMAD20200619175000'
                        ],
                        passengerPrices: [
                            {
                                fareCalculation: 'MAD IB BIO115.00IB MAD115.00EUR230.00END',
                                passengerId: 'ADULT_01'
                            },
                            {
                                fareCalculation: 'MAD IB BIO77.05IB MAD77.05EUR154.10END',
                                passengerId: 'CHILD_01'
                            }
                        ]
                    },
                    {
                        type: 'seat',
                        orderItemId: 'IB42c3e1b93adb4248ac6c736c116b2ac3OP_02',
                        price: {
                            fare: 12,
                            tax: 0,
                            total: 12,
                            currency: 'EUR',
                            ticketingFee: 0
                        },
                        passengerId: 'ADULT_01',
                        row: '12',
                        column: 'C',
                        segmentId: 'IB044820200618',
                        emd: '0755565085009',
                        selected: true
                    },
                    {
                        type: 'seat',
                        orderItemId: 'IB42c3e1b93adb4248ac6c736c116b2ac3OP_03',
                        price: {
                            fare: 12,
                            tax: 0,
                            total: 12,
                            currency: 'EUR',
                            ticketingFee: 0
                        },
                        passengerId: 'CHILD_01',
                        row: '12',
                        column: 'D',
                        segmentId: 'IB044820200618',
                        emd: '0755565085018',
                        selected: true
                    },
                    {
                        type: 'baggage',
                        orderItemId: 'IB42c3e1b93adb4248ac6c736c116b2ac3OP_04',
                        price: {
                            fare: 120,
                            tax: 0,
                            total: 120,
                            currency: 'EUR',
                            ticketingFee: 0
                        },
                        passengerId: 'ADULT_01',
                        sliceId: 'BIOMAD20200619175000',
                        amount: 4,
                        emd: '0755565085021'
                    },
                    {
                        type: 'baggage',
                        orderItemId: 'IB42c3e1b93adb4248ac6c736c116b2ac3OP_05',
                        price: {
                            fare: 30,
                            tax: 0,
                            total: 30,
                            currency: 'EUR',
                            ticketingFee: 0
                        },
                        passengerId: 'ADULT_01',
                        sliceId: 'BIOMAD20200619175000',
                        amount: 1,
                        emd: '0755565085015'
                    },
                    {
                        type: 'baggage',
                        orderItemId: 'IB42c3e1b93adb4248ac6c736c116b2ac3OP_06',
                        price: {
                            fare: 20,
                            tax: 0,
                            total: 20,
                            currency: 'EUR',
                            ticketingFee: 0
                        },
                        passengerId: 'ADULT_01',
                        sliceId: 'BIOMAD20200619175000',
                        amount: 1,
                        emd: '0755565085014'
                    },
                    {
                        type: 'baggage',
                        orderItemId: 'IB42c3e1b93adb4248ac6c736c116b2ac3OP_07',
                        price: {
                            fare: 120,
                            tax: 0,
                            total: 120,
                            currency: 'EUR',
                            ticketingFee: 0
                        },
                        passengerId: 'CHILD_01',
                        sliceId: 'BIOMAD20200619175000',
                        amount: 4,
                        emd: '0755565085022'
                    },
                    {
                        type: 'baggage',
                        orderItemId: 'IB42c3e1b93adb4248ac6c736c116b2ac3OP_08',
                        price: {
                            fare: 30,
                            tax: 0,
                            total: 30,
                            currency: 'EUR',
                            ticketingFee: 0
                        },
                        passengerId: 'CHILD_01',
                        sliceId: 'BIOMAD20200619175000',
                        amount: 1,
                        emd: '0755565085017'
                    },
                    {
                        type: 'baggage',
                        orderItemId: 'IB42c3e1b93adb4248ac6c736c116b2ac3OP_09',
                        price: {
                            fare: 20,
                            tax: 0,
                            total: 20,
                            currency: 'EUR',
                            ticketingFee: 0
                        },
                        passengerId: 'CHILD_01',
                        sliceId: 'BIOMAD20200619175000',
                        amount: 1,
                        emd: '0755565085016'
                    },
                    {
                        type: 'baggage',
                        orderItemId: 'IB42c3e1b93adb4248ac6c736c116b2ac3OP_10',
                        price: {
                            fare: 120,
                            tax: 0,
                            total: 120,
                            currency: 'EUR',
                            ticketingFee: 0
                        },
                        passengerId: 'ADULT_01',
                        sliceId: 'MADBIO20200618074000',
                        amount: 4,
                        emd: '0755565085019'
                    },
                    {
                        type: 'baggage',
                        orderItemId: 'IB42c3e1b93adb4248ac6c736c116b2ac3OP_11',
                        price: {
                            fare: 30,
                            tax: 0,
                            total: 30,
                            currency: 'EUR',
                            ticketingFee: 0
                        },
                        passengerId: 'ADULT_01',
                        sliceId: 'MADBIO20200618074000',
                        amount: 1,
                        emd: '0755565085011'
                    },
                    {
                        type: 'baggage',
                        orderItemId: 'IB42c3e1b93adb4248ac6c736c116b2ac3OP_12',
                        price: {
                            fare: 20,
                            tax: 0,
                            total: 20,
                            currency: 'EUR',
                            ticketingFee: 0
                        },
                        passengerId: 'ADULT_01',
                        sliceId: 'MADBIO20200618074000',
                        amount: 1,
                        emd: '0755565085010'
                    },
                    {
                        type: 'baggage',
                        orderItemId: 'IB42c3e1b93adb4248ac6c736c116b2ac3OP_13',
                        price: {
                            fare: 120,
                            tax: 0,
                            total: 120,
                            currency: 'EUR',
                            ticketingFee: 0
                        },
                        passengerId: 'CHILD_01',
                        sliceId: 'MADBIO20200618074000',
                        amount: 4,
                        emd: '0755565085020'
                    },
                    {
                        type: 'baggage',
                        orderItemId: 'IB42c3e1b93adb4248ac6c736c116b2ac3OP_14',
                        price: {
                            fare: 30,
                            tax: 0,
                            total: 30,
                            currency: 'EUR',
                            ticketingFee: 0
                        },
                        passengerId: 'CHILD_01',
                        sliceId: 'MADBIO20200618074000',
                        amount: 1,
                        emd: '0755565085013'
                    },
                    {
                        type: 'baggage',
                        orderItemId: 'IB42c3e1b93adb4248ac6c736c116b2ac3OP_15',
                        price: {
                            fare: 20,
                            tax: 0,
                            total: 20,
                            currency: 'EUR',
                            ticketingFee: 0
                        },
                        passengerId: 'CHILD_01',
                        sliceId: 'MADBIO20200618074000',
                        amount: 1,
                        emd: '0755565085012'
                    }
                ],
                slices: [
                    {
                        sliceId: 'MADBIO20200618074000',
                        type: 'REGULAR',
                        departureDateTime: '2020-06-18 07:40',
                        arrivalDateTime: '2020-06-18 08:40',
                        duration: 60,
                        stopsNumber: 0,
                        price: {
                            fare: 192.05,
                            currency: 'EUR'
                        },
                        detailedPrices: [
                            {
                                fare: 115,
                                currency: 'EUR'
                            },
                            {
                                fare: 77.05,
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
                                id: 'IB044820200618',
                                duration: 60,
                                waitingTime: 0,
                                operatorLocator: null,
                                stop: null,
                                departureDateTime: '2020-06-18 07:40',
                                departureUtcDateTime: '2020-06-18T05:40:00.000',
                                arrivalDateTime: '2020-06-18 08:40',
                                arrivalUtcDateTime: '2020-06-18T06:40:00.000'
                            }
                        ],
                        overnight: false,
                        passengerFlags: [
                            {
                                passengerId: 'ADULT_01'
                            },
                            {
                                passengerId: 'CHILD_01'
                            }
                        ]
                    },
                    {
                        sliceId: 'BIOMAD20200619175000',
                        type: 'REGULAR',
                        departureDateTime: '2020-06-19 17:50',
                        arrivalDateTime: '2020-06-19 19:00',
                        duration: 70,
                        stopsNumber: 0,
                        price: {
                            fare: 192.05,
                            currency: 'EUR'
                        },
                        detailedPrices: [
                            {
                                fare: 115,
                                currency: 'EUR'
                            },
                            {
                                fare: 77.05,
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
                                id: 'IB044920200619',
                                duration: 70,
                                waitingTime: 0,
                                operatorLocator: null,
                                stop: null,
                                departureDateTime: '2020-06-19 17:50',
                                departureUtcDateTime: '2020-06-19T15:50:00.000',
                                arrivalDateTime: '2020-06-19 19:00',
                                arrivalUtcDateTime: '2020-06-19T17:00:00.000'
                            }
                        ],
                        overnight: false,
                        passengerFlags: [
                            {
                                passengerId: 'ADULT_01'
                            },
                            {
                                passengerId: 'CHILD_01'
                            }
                        ]
                    }
                ],
                price: {
                    fare: 1089,
                    tax: 63.08,
                    total: 1152.08,
                    currency: 'EUR',
                    ticketingFee: 0
                },
                primaryContactInfo: {
                    phone: '123456789',
                    email: 'BPARIENTE@VIEWNEXT.COM',
                    phoneType: 'HOME'
                },
                optionalInformation: [],
                cashAviosPossibilities: [],
                specialDiscounts: [],
                checkedBagAllowances: [
                    {
                        type: 'PIECE',
                        segmentIds: [
                            'IB044820200618',
                            'IB044920200619'
                        ],
                        totalQuantity: 0
                    }
                ],
                aviosRedeemed: null,
                pointsRedeemed: null,
                phonesList: {
                    RESERVAS: {
                        prefix: '(+34)',
                        telephone: '913894357',
                        text: '',
                        prefixAlt: '',
                        telephoneAlt: '',
                        textAlt: '',
                        timeText: ''
                    }
                }
            }
            let ret = DisruptionUtilService.searchSlices(object1, jasmine.createSpy('function1')
                .and.returnValue({
                    isCriteriaOk: false
                }));

            expect(ret).toBeNull();
        });

        describe('tests when getQuadrigam() is called', function(){
            it('test getQuadrigam() is called', function(){
                let model, orderStatus,orderSlices;
                model = {
                    'flagSelectorDate': true,
                    'selectorFlights':{
                        'flightsNumber' : 1,
                        'optional': true,
                        'flights' : [

                        ]
                    }
                };
                orderSlices = {
                    'canceledList':{
                        'list':[]
                    },
                    'reacomList':{
                        'list':[]
                    },
                    'confirmedList':{
                        'list':[]
                    }
                }
                orderStatus = 'UNCONFIRMED_CHANGES';
                localStorageService.set('bookingInfo', mockWarningSlice);
                DisruptionUtilService.getQuadrigam(model, orderStatus, orderSlices);
            });

            it('test getQuadrigam() is called', function(){
                let model, orderStatus,orderSlices;
                model = {
                    'flagSelectorDate': true,
                    'selectorFlights':{
                        'flightsNumber' : 3,
                        'optional': true,
                        'flights' : [

                        ]
                    }
                };
                orderSlices = {
                    'canceledList':{
                        'list':[]
                    },
                    'reacomList':{
                        'list':[]
                    },
                    'confirmedList':{
                        'list':[]
                    }
                }
                orderStatus = 'CANCELATION_CHANGE';
                localStorageService.set('bookingInfo', mockWarningSlice);
                DisruptionUtilService.getQuadrigam(model, orderStatus, orderSlices);
            });

            it('test quadrigam with Total UNTK', function(){
                let model, orderStatus, orderSlices;
                model = {
                    flagSelectorDate: true,
                    selectorFlights:{
                        flightsNumber : 2,
                        optional: null,
                        flights: [],
                        slices: []
                    }
                };
                orderSlices = {
                    canceledList:{
                        list: []
                    },
                    reacomList:{
                        list: []
                    },
                    confirmedList:{
                        list: null
                    }
                }

                orderStatus = 'ACCEPT_CHANGES_PENDING_TK';
                localStorageService.set('bookingInfo', mockWarningSlice);
                const quadrigamObj = DisruptionUtilService.getQuadrigam(model, orderStatus, orderSlices);
                
                expect(quadrigamObj.DISRUPTION_PAGE).toBe('CITORE');
                expect(quadrigamObj.TYPE_DISRUPTION_FLOW).toBe('ALT_TOTAL_WITH_FLEX');
            });

            it('test quadrigam with Parcial UNTK', function(){
                let model, orderStatus, orderSlices;
                model = {
                    flagSelectorDate: true,
                    selectorFlights:{
                        flightsNumber : 2,
                        optional: true,
                        flights: [],
                        slices: []
                    }
                };
                orderSlices = {
                    canceledList:{
                        list: []
                    },
                    reacomList:{
                        list: []
                    },
                    confirmedList:{
                        list: []
                    }
                }

                orderStatus = 'ACCEPT_CHANGES_PENDING_TK';
                localStorageService.set('bookingInfo', mockWarningSlice);
                const quadrigamObj = DisruptionUtilService.getQuadrigam(model, orderStatus, orderSlices);

                expect(quadrigamObj.DISRUPTION_PAGE).toBe('CIPARE');
                expect(quadrigamObj.TYPE_DISRUPTION_FLOW).toBe('ALT_PARC_WITH_FLEX');
            });
        });

        describe('tests when quadrigamByTypeFlow() is called', function(){
            it('test quadrigam with total flex', function(){
                const typeFlow = 'ALT_TOTAL_WITH_FLEX';

                const quadrigam = DisruptionUtilService.quadrigamByTypeFlow(typeFlow, true);

                expect(quadrigam).toBe('CITOBK');
            });

            it('test quadrigam with parcial flex', function(){
                const typeFlow = 'ALT_PARC_WITH_FLEX';

                const quadrigam = DisruptionUtilService.quadrigamByTypeFlow(typeFlow, true);

                expect(quadrigam).toBe('CIPTBK');
            });
        });

        describe('tests when checkDelayedFlights() is called', function () {
            it('should return delayed slices when disruptionTypes includes DELAY', function () {
                const slices = [
                    { disruptionTypes: ['DELAY', 'OTHER'], id: 's1' },
                    { disruptionTypes: ['CANCEL'], id: 's2' }
                ];

                const result = DisruptionUtilService.checkDelayedFlights(slices);

                expect(result.length).toBe(1);
                expect(result[0].id).toBe('s1');
            });

            it('should return empty array when slices is null', function () {
                const result = DisruptionUtilService.checkDelayedFlights(null);

                expect(result).toEqual([]);
            });
        });

        describe('tests when checkWarning() is called', function () {
            it('should return true when warning code SSE_ORM_9442 exists', function () {
                const warnings = [
                    { code: 'SSE_ORM_20013' },
                    { code: 'SSE_ORM_9442' }
                ];

                const result = DisruptionUtilService.checkWarning(warnings);

                expect(result).toBeTrue();
            });

            it('should return false when warning code SSE_ORM_9442 does not exist', function () {
                const warnings = [
                    { code: 'SSE_ORM_20013' }
                ];

                const result = DisruptionUtilService.checkWarning(warnings);

                expect(result).toBeFalse();
            });
        });

        describe('tests when checkDates() is called', function(){
            it('test check date less than 2 days in the future', function(){
                const initDate = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
                const result = DisruptionUtilService.checkDates(initDate);
                expect(result).toBeTrue();
            });
            
            it('test check date more than 2 days in the future', function(){
                const initDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
            
                const result = DisruptionUtilService.checkDates(initDate);

                expect(result).toBeFalse();
            });
        });
    });
});
