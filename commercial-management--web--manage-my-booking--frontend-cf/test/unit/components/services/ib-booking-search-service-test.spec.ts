import angular from "angular";
import { filterFake } from '@test/mocks/constants/filterTranslate-mock';
import { fakeInits1Mock, fakeInits2Mock, getAirlinesLogosRejectMock, getParameterByNameFalseMock, getParameterByNameTrueMock, MMB_MARKETS_ES_EU_Mock, sameCaseAirShuttleFalseMock, sameCaseAirShuttleMock } from './mocks/ib-booking-search-service-functions-mock';

describe('BookingSearchService test', () =>  {
    let BookingSearchService, localStorageService, testCookies, rootScope, $q, observerCallback ;
    let checkinId = 'checkinIdTest';
    let fakeFrequentFlyersCompaniesService = {
        'getFrequentFlyersCompaniesPromised': jasmine.createSpy()
    };

    let fakeCommercialInfobyMarketService = {
        'getCommercialInfo': jasmine.createSpy()
    };

    let fakeRetrieveOrderService = {
        'retrieveOrderByCheckinId': jasmine.createSpy(),
        'retrieveOrderPost': jasmine.createSpy(),
        'retrieveOrder': jasmine.createSpy(),
        'retrieveOrderConsent': jasmine.createSpy(),
        'retrieveOrderByDeepLink': jasmine.createSpy(),
        'retrieveOrderByFlightId': jasmine.createSpy(),
    };

    let fakeDatalayerUtilsService = {
        'sendDatalayerErrorEvent': jasmine.createSpy()
    };

    let fakeFlagsTransformer = {
        'generateFlagsMenu': jasmine.createSpy()
    };

    let fakeCashRefundService = {
        'getCashRefundInformation' : jasmine.createSpy()
    };

    let fakeMmBAppConstants = {
        'market': 'US',
        'defaultMarket': 'ES',
        'COOKIES': { 'AIR_SHUTTLE_ERROR': 'AIR_SHUTTLE_ERROR', 'CHECKIN_ID': 'CHECKIN_ID', 'DEFAULT_PATH': '/' },
        'GDR_PA_ERRORS': { 'ERR_1': 'ERR_1' },
        'SLICE_TYPES': { 'SHUTTLE': 'SHUTTLE' },
        'PAGES_URL': {
            'BOOKING_MANAGE': 'BOOKING_MANAGE',
            'CHANGE_FLIGHT': 'CHANGE_FLIGHT',
            'CONFIRM_ON_HOLD': 'CONFIRM_ON_HOLD',
            'AIR_SHUTTLE_PAGE': '/air-shuttle',
            'DISRUPTED_PAGE': '/disrupted',
            'ON_HOLD': 'ON_HOLD',
            'SEARCH': '/search',
            'MMB_DASHBOARD': '/dashboard'},
        'STEP_PARAM_VALUES': { 'CHANGE_FLIGHT': 'step' },
        'SLICE_STATUS': {
            'ISSUED': 'ISSUED',
            'HOLD': 'ON_HOLD',
            'ON_HOLD_CONFIRMABLE': 'ON_HOLD_CONFIRMABLE',
            'FRAUD_ONHOLD': 'FRAUD_ONHOLD'
        },
        'MMB_MARKETS': ['ES', 'EU'],
        'ON_HOLD_MARKETS': ['ES', 'EU'],
        'PAGE_TYPE_CHANNEL': { 'MOBI': 'test' },
        'GDR_CODE_ERRORS': { 'UNEXPECTED_TECHNICAL_EXCEPTION': 'test' },
        'voucherInfoURI' : '/',
        'GENERAL_ERRORS_SERVICE':{
            'SERVICE_GENERAL_ERROR':'ERROR'
        },
        'ORDER_STATUS_VALUES': {
            'ISSUED':'ISSUED',
            'INVOLUNTARY_FLAG': 'ACCEPT_CHANGES_PENDING',
            'CANCELATION_FLAG': 'UNCONFIRMED_CHANGES',
            'CANCELATION_REACOM_FLAG': 'ACCEPT_CHANGES_PENDING',
            'SCHEDULE_CHANGE': 'ACCEPT_CHANGES_PENDING_TK',
            'CANCELATION_MIXED_CHANGE': 'UNCONFIRMED_CHANGES_MIXED',
            'CANCELATION_REACOM_MIXED_CHANGE': 'ACCEPT_CHANGES_PENDING_MIXED',
            'CANCELATION_CHANGES': 'CANCELATION_CHANGES',
            'WAITLIST_CONFIRMED_CHANGES': 'WAITLIST_CONFIRMED_CHANGES',
            'DISRUPTION_CHANGES_MIXED': 'DISRUPTION_CHANGES_MIXED'
        },
        'TITLES_APP': {
            'MANAGEMYBOOKING_ANCILLARIES': 'MMBANC',
        },
        'WARNING_MESSAGES': {
            'SAME_SURNAME_WARNING': 'test'
        },
        INT_HOSTNAME: 'test.hostname.com',
        PRE_HOSTNAME: 'pre.iberia.com',
        URL_PARAMETERS:{
            FLIGHT_ID: 'flightId'
        }
    };

    let fakeDatalayerConstants = {
        'DATALAYER_MODAL_ID': { 'INFO_CONFIDENTIALITY': 'INFO_CONFIDENTIALITY', 'ADVICE_PA_BOOKING': 'ADVICE_PA_BOOKING' }
    };

    let fakeVipLoungesService = {
        getVipLounges: jasmine.createSpy(),
        getExclusiveServicesLauncherComponent: jasmine.createSpy(),
        getVipInvitationsComponent: jasmine.createSpy(),
        getFastTrackCardComponent: jasmine.createSpy()
    };

    let fakeMmBModalService = {
        'showWaitingModal': jasmine.createSpy('showWaitingModal').and.callFake(angular.noop),
        'showGenericModal': jasmine.createSpy(),
        'finishWaiting': jasmine.createSpy('finishWaiting').and.callFake(angular.noop),
        'showGenericError': jasmine.createSpy('showGenericError').and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve();
            return { result: deferred.promise };
        })
    };

    let fakeMmBUtilService = {
        'getParameterByName': jasmine.createSpy('getParameterByName').and.callFake(angular.noop),
        'formatDisruptionAndFlexibilizationDates': jasmine.createSpy('formatDisruptionAndFlexibilizationDates').and.callFake(angular.noop),
        'getBasicSegmentInformation': jasmine.createSpy(),
        'transformVoucherPriceInfo': jasmine.createSpy(),
        'transformCashPriceInfo': jasmine.createSpy(),
        'isUserLogged': jasmine.createSpy('isUserLogged').and.returnValue(false)
    };

    let fakeMmBUtilsSharedService = {
        'getFlagValue': jasmine.createSpy(),
        'getDisruptionType': jasmine.createSpy(),
    };

    let fakeDigitalBoardingService = {
        'getDigitalBoardingAvailability': jasmine.createSpy()
    };

    let fakeCommonsAncillariesService = {
        'getAncillaries': jasmine.createSpy(),
        'getAncillarieSummary': jasmine.createSpy()
    };

    let fakeCalculatePointsTransformer = {
        'generateCalcPointsRequest': jasmine.createSpy(),
        'TransCalcPointsData': jasmine.createSpy(),
        'TransCalcPointsForPassenger': jasmine.createSpy(),
        'genCalAviosSummary': jasmine.createSpy(),
    };

    let fakeAttendanceVoucherTransformer = {
        'transformAttendanceVoucher': jasmine.createSpy(),
    };

    let fakeMmBAirlinesLogoService = {
        'getAirlinesLogos': jasmine.createSpy()
    };

    let fakeChangleFlightsService = {
        'getDisruptionPeriods':jasmine.createSpy()
    };

    let fakeRedirectionService = {
        'externalRedirect': jasmine.createSpy('externalRedirect').and.callFake(angular.noop)
    };

    let fakeMmbInvoluntaryChangeService = {
        'hasInvoluntaryChange': jasmine.createSpy()
    };

    let fakeTFakeBookingManagementService = {
        'getBookingInfo': jasmine.createSpy()
    };

    let fakeCalculatePointsService = {
        'getCalculatePoints': jasmine.createSpy()
    }

    let fakeVoucherInformationService = {
        'getVoucherAmount': jasmine.createSpy()
    };

    let fakeSisterCitiesService = {
        'getSisterCities': jasmine.createSpy()
    };
    let fakeReshopConditionsService = {
        'getReshopConditions': jasmine.createSpy()
    };

    let mockCommercialInfo = [
        {
            'market': {
                'code': 'AO',
                'description': 'Angola'
            },

        },
        {
            'market': {
                'code': 'ES',
                'description': 'Espa�a'
            },

        }
    ];
    let mockBookingData = require('@test/mocks/storage/booking-info-to-service.json');
    let mockBookingDataAirShuttle = require('@test/mocks/storage/booking-info-air-shuttle-to-service.json');

    let mockFlagInfo = require('@test/mocks/storage/flag-info-mock.json');
    let mockAncillariesResponse = {
        'currencies': [
            {
                'code': 'EUR',
                'description': 'Euro',
                'symbol': '�',
                'alignment': 'R',
                'groupingSeparator': '.',
                'decimalSeparator': ',',
                'decimals': 2,
                'recommendedDisplay': 'symbol'
            }
        ],
        'slices': [
            {
                'id': 'JFKMAD20210614170500',
                'segmentIds': [
                    'IB625020210614'
                ]
            }
        ]
    };
    let mockBreakDownResponse = {
        'currencies': [
            {
                'code': 'EUR',
                'description': 'Euro',
                'symbol': '�',
                'alignment': 'R',
                'groupingSeparator': '.',
                'decimalSeparator': ',',
                'decimals': 2,
                'recommendedDisplay': 'symbol'
            }
        ],


        'pendingPaymentItems': [],
        'pendingIssuanceItems': [],
        'issuedItems': [
            {
                'type': 'UPGRADING_BID'
            },
            {
                'type': 'PREORDER'
            }
        ],
        'voucherDiscount': null
    };
    let mockManagementResponse = {
        'bookingCode': 'JEV5N',
        'segments': [],
        'passengers': [
            {
                'personalInfo': {
                    'name': 'IBERIA',
                    'surname': 'TESTUNOTESTDOS',
                    'birthDate': null
                },
            }
        ],
        'optionalInformation': false,
        'hasSavedChangesSuccess': false,
        'showSpecialNeeds': true,
        'haveSpecialPassenger': false,
        'showCopyOfTickets': false
    };

    let fakeCommonsUtilService = {
        'setTitlePage': jasmine.createSpy()
    };
    let fakeCurrencyService = {
        getCurrencyObject: jasmine.createSpy(),
        formatPrice: jasmine.createSpy('formatPrice').and.returnValue('10�'),
    };

    let bookingDataIsDisruption = {
        'order': {
            'slices': [{ 'type': 'other', 'segments': [{ 'id': 'segmentId' }] }],
            'status' : 'DISRUPTION_CHANGES_MIXED'
        },
        'passengers': [{}, {}],
        'isAirShuttle': false,
        'isOnHold': false,
        'contextMetadata': {
            'currencies': [
                {
                    'code': 'EUR',
                    'description': 'Euro',
                    'symbol': '�',
                    'alignment': 'R',
                    'groupingSeparator': '.',
                    'decimalSeparator': ',',
                    'decimals': 2,
                    'recommendedDisplay': 'symbol'
                }
            ]
        },
        qualifiers: [{name: 'IBDPHOLIDAYS'}]
    };
    let bookingDataNotShuttle = {
        'order': {
            'slices': [{ 'type': 'other', 'segments': [{ 'id': 'segmentId' }] }],
            'status' : 'other'
        },
        'passengers': [{}, {}],
        'isAirShuttle': false,
        'isOnHold': false,
        'contextMetadata': {
            'currencies': [
                {
                    'code': 'EUR',
                    'description': 'Euro',
                    'symbol': '�',
                    'alignment': 'R',
                    'groupingSeparator': '.',
                    'decimalSeparator': ',',
                    'decimals': 2,
                    'recommendedDisplay': 'symbol'
                }
            ]
        },
        qualifiers: [{name: 'IBDPHOLIDAYS'}]
    };
    let bookingDataEmpty = {
        'flowId': 'flowId',
        'order': {
            'slices': [{ 'type': 'other', 'segments': [{ 'id': 'segmentId' }] }],
            'status' : 'other'
        },
        'passengers': [{}, {}],
        'isAirShuttle': false,
        'isOnHold': false,
    };
    let bookingDataOnHold = {
        'order': {
            'slices': [{ 'type': 'other', 'segments': [{ 'id': 'segmentId' }] }],
            'status' : 'other'
        },
        'passengers': [{}, {}],
        'isAirShuttle': false,
        'isOnHold': true,
    };
    let bookingDataAirShuttle = {
        'order': {
            'slices': [{ 'type': fakeMmBAppConstants.SLICE_TYPES.SHUTTLE, 'segments': [{ 'id': 'segmentId' }] }],
            'status' : 'other'
        },
        'passengers': [{}, {}],
        'isAirShuttle': true,
        'isOnHold': false,
    };
    let bookingData = {
        'order': {
            'slices': [{ 'type': fakeMmBAppConstants.SLICE_TYPES.SHUTTLE, 'segments': [{ 'id': 'segmentId' }] }],
            'status' : 'other'
        },
        'passengers': [{}, {}],
        'isAirShuttle': false,
        'isOnHold': false,
    };
    let bookingInfo = bookingData;

    let fakeBookingNameService = {
        checkName: jasmine.createSpy()
    };

    let fakeCommonsModalService = {
        showGenericError: jasmine.createSpy()
    };

    let fakeDigitalMenuStatusService = {
        getDigitalMenuStatus: jasmine.createSpy('getDigitalMenuStatus').and.callFake(() =>  {
            let defer = $q.defer();
            defer.resolve({},{nextStep: 'test'});
            return defer.promise;
        })
    };

    let fakeGastroOfferService = {
        importGastronomicProposalComponent: jasmine.createSpy()
    };

    let fakeAttendanceVoucherService = {
        mockAttendanceVoucher: jasmine.createSpy()
    };

    let fakeibCCalculatePointsService = {
        getCalculateFlightsAvios: jasmine.createSpy()
    };

    let fakeFlagsObject = {
        showCashRefundOnline: true,
        showRefundVoucherSection: true,
        sisterCitiesData: {
            hasSistercitiesPossibility: true,
            allowedSlices: [
                {
                    originalDisruptionSliceInformation: {
                        departure: {
                            city: {
                                code: 'test'
                            }
                        },
                        arrival: {
                            city: {
                                code: 'test'
                            }
                        }
                    },
                    segments: [
                        {
                            departureCity: {
                                code: 'test'
                            },
                            arrivalCity: {
                                code: 'test'
                            }
                        }
                    ]
                }

            ]
        }
    };

    let getSisterResponse = {
        cities:[
            {
                sisterCities:[
                    {
                        sister: 'true'
                    },
                    {
                        sister: 'true'
                    }
                ]
            }
        ]
    };

    let fakeLoadingSpinnerService = {
        show: jasmine.createSpy('show'),
        hide: jasmine.createSpy('hide')
    };

    let fakeIbMmbOrderHandlerService = {
        retrieveOrderHandler: jasmine.createSpy('retrieveOrderHandler')
    };

    let fakeLocation = {
        'path': jasmine.createSpy(),
        'search':jasmine.createSpy('search').and.returnValue({'quadrigam':'test'}),
    };

    let fakeIbMmbRetrieveOrderOtpProtectedService = {
        retrieveOrder: jasmine.createSpy('retrieveOrder')
    };

    beforeEach(() =>  {
        angular.mock.module('LocalStorageModule', 'ngCookies','ib-MmB-services-module', ($provide) => initProviders($provide));
        inject((_BookingSearchService_, _localStorageService_, $cookies, $rootScope, _$q_) => {
            BookingSearchService = _BookingSearchService_;
            localStorageService = _localStorageService_;
            testCookies = $cookies;
            rootScope = $rootScope;
            $q = _$q_;

            let params = {fakeMmBAppConstants, serviceResolve, bookingInfo, mockCommercialInfo, mockBookingData,  fakeTFakeBookingManagementService, fakeFrequentFlyersCompaniesService, fakeCommercialInfobyMarketService, fakeMmBAirlinesLogoService, fakeRetrieveOrderService, fakeCalculatePointsTransformer};
            let fakeInits2Params = { serviceResolve, fakeAttendanceVoucherTransformer, fakeCalculatePointsService, fakeReshopConditionsService, fakeFlagsTransformer, mockFlagInfo, fakeVipLoungesService, fakeGastroOfferService, fakeRetrieveOrderService, mockBookingData, rootScope};
            fakeInits1(params);
            fakeInits2(fakeInits2Params);
            // fakeIbMmbOrderHandlerService.retrieveOrderHandler.and.returnValue({
            //     subscribe: (callbacks) => {
            //         observerCallback = callbacks;
            //         return { unsubscribe: jasmine.createSpy('unsubscribe') };
            //     }
            // });
        });
    });

    const serviceResolve = (service, method, data, isPromiseResult?, stateValue?) => {
        service[method] = jasmine.createSpy(method).and.callFake(() => {
            let deferred = $q.defer();
            deferred.resolve(data);
            if (stateValue) return deferred.promise.$$state.value;
            if (isPromiseResult) return {'result': deferred.promise};
            return deferred.promise;
        });
    };

    const serviceReject = (service, method, data) => {
        service[method] = jasmine.createSpy(method).and.callFake(() => {
            let deferred = $q.defer();
            deferred.reject(data);
            return deferred.promise;
        });
    };

    const fakeInits1 = fakeInits1Mock;
    const fakeInits2 = fakeInits2Mock;
    const getParameterByNameFalse = getParameterByNameFalseMock;
    const getParameterByNameTrue = getParameterByNameTrueMock;
    const MMB_MARKETS_ES_EU = MMB_MARKETS_ES_EU_Mock;
    const sameCaseAirShuttle = sameCaseAirShuttleMock;
    const sameCaseAirShuttleFalse = sameCaseAirShuttleFalseMock;
    const getAirlinesLogosReject = getAirlinesLogosRejectMock;

    const someServicesSameReject = () => {
        serviceReject(fakeChangleFlightsService, 'getDisruptionPeriods', {});
        serviceReject(fakeDigitalBoardingService, 'getDigitalBoardingAvailability', {});
        serviceReject(fakeCommonsAncillariesService, 'getAncillaries', {});
        serviceReject(fakeChangleFlightsService, 'getDigitalMenuStatus', {});
    };

    const initProviders = ($provide) => {
        $provide.value('FrequentFlyersCompaniesService', fakeFrequentFlyersCompaniesService);
        $provide.value('CommonsCommercialInfobyMarketService', fakeCommercialInfobyMarketService);
        $provide.value('RetrieveOrderService', fakeRetrieveOrderService);
        $provide.value('$location', fakeLocation);
        $provide.value('MmBAppConstants', fakeMmBAppConstants);
        $provide.value('MmBModalService', fakeMmBModalService);
        $provide.value('MmBUtilService', fakeMmBUtilService);
        $provide.value('MmBAirlinesLogoService', fakeMmBAirlinesLogoService);
        $provide.value('DigitalBoardingService', fakeDigitalBoardingService);
        $provide.value('MMBDatalayerConstants', fakeDatalayerConstants);
        $provide.value('MmbInvoluntaryChangeService', fakeMmbInvoluntaryChangeService);
        $provide.value('BookingManagementService', fakeTFakeBookingManagementService);
        $provide.value('IbFlagsTransformer', fakeFlagsTransformer);
        $provide.value('CashRefundService', fakeCashRefundService);
        $provide.value('CommonsAncillariesService', fakeCommonsAncillariesService);
        $provide.value('AttendanceVoucherTransformer', fakeAttendanceVoucherTransformer);
        $provide.value('CalculatePointsTransformer', fakeCalculatePointsTransformer);
        $provide.value('ChangleFlightsService', fakeChangleFlightsService);
        $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
        $provide.value('VoucherInformationService', fakeVoucherInformationService);
        $provide.value('SisterCitiesService', fakeSisterCitiesService);
        $provide.value('ReshopConditionsService', fakeReshopConditionsService);
        $provide.value('CommonsUtilService', fakeCommonsUtilService);
        $provide.value('CurrencyService', fakeCurrencyService);
        $provide.value('BookingNameService', fakeBookingNameService);
        $provide.value('CommonsModalService', fakeCommonsModalService);
        $provide.value('AttendanceVoucherService', fakeAttendanceVoucherService);
        $provide.value('DigitalMenuStatusService', fakeDigitalMenuStatusService);
        $provide.value('GastroOfferService', fakeGastroOfferService);
        $provide.value('VipLoungesService', fakeVipLoungesService);
        $provide.value('ibCCalculatePointsService', fakeibCCalculatePointsService);
        $provide.value('$filter', filterFake);
        $provide.value('RedirectionService', fakeRedirectionService);
        $provide.value('IbMmbOrderHandlerService', fakeIbMmbOrderHandlerService);
        $provide.value('LoadingSpinnerService', fakeLoadingSpinnerService);
        $provide.value('MmBUtilsSharedService', fakeMmBUtilsSharedService);
        $provide.value('IbMmbRetrieveOrderOtpProtectedService', fakeIbMmbRetrieveOrderOtpProtectedService);
    };

    describe('when searchFlightsPassengers is called', () =>  {
        let sameCase = (done) => {

            localStorageService.set('deepLinkParams', false);
            testCookies.putObject(fakeMmBAppConstants.COOKIES.CHECKIN_ID, { 'checkinId': checkinId }, { 'path': fakeMmBAppConstants.COOKIES.DEFAULT_PATH });
            BookingSearchService.searchFlightsPassengers('surname', 'pnr', false).then((returnedInfo) => {
                expect(returnedInfo).toEqual(mockBookingData);
            }, angular.noop);

            rootScope.$digest();
            done();
        };

        let sameCaseAirShuttle = (done) => {
            BookingSearchService.searchFlightsPassengers('surname', 'pnr', false).then((returnedInfo) => {
                expect(returnedInfo).toEqual(mockBookingDataAirShuttle);
            }, angular.noop);

            rootScope.$digest();
            done();
        };
        it('and FrequentFlyersCompaniesService.getFrequentFlyersCompaniesPromised is reject', (done) =>  {
            inject(() => {
                mockBookingData.order.status = fakeMmBAppConstants.SLICE_STATUS.ISSUED;
                getParameterByNameFalse(fakeMmBUtilService);
                serviceReject(fakeFrequentFlyersCompaniesService, 'getFrequentFlyersCompaniesPromised', {errorCode: 400});
            });

            localStorageService.set('deepLinkParams', false);
            BookingSearchService.searchFlightsPassengers('surname', 'pnr', false).then(angular.noop, (error) => {
                expect(error.errorCode).toBe(400);
                done();
            });

            rootScope.$digest();
        });
        let sameInject = () => {
            mockBookingData.order.status = fakeMmBAppConstants.SLICE_STATUS.ISSUED;
            getAirlinesLogosReject(serviceReject, fakeMmBAirlinesLogoService);
            getParameterByNameFalse(fakeMmBUtilService);
        };
        it('should set retreturnedInfo correcty with deepLinkParams true and retrieveOrderByDeepLink resolve', (done) =>  {
            inject(() => {
                sameInject();
                serviceResolve(fakeRetrieveOrderService, 'retrieveOrderByDeepLink', mockBookingDataAirShuttle);
            });
            localStorageService.set('deepLinkParams', true);
            sameCaseAirShuttle(done);
        });
        it('should set retreturnedInfo correcty with deepLinkParams true and retrieveOrderByDeepLink reject', (done) =>  {
            inject(() => {
                sameInject();
                serviceReject(fakeRetrieveOrderService, 'retrieveOrderByDeepLink', {});
            });
            localStorageService.set('deepLinkParams', true);
            sameCaseAirShuttle(done);
        });

        it('should set retreturnedInfo correcty with deepLinkParams true and retrieveOrderPost called and reject', (done) =>  {
            inject(() => {
                mockBookingData.order.status = fakeMmBAppConstants.SLICE_STATUS.ISSUED;
                getAirlinesLogosReject(serviceReject, fakeMmBAirlinesLogoService);
                getParameterByNameFalse(fakeMmBUtilService);
                serviceReject(fakeRetrieveOrderService, 'retrieveOrderPost', {});
            });
            localStorageService.set('deepLinkParams', false);
            BookingSearchService.searchFlightsPassengers('surname', 'pnr', false).then((returnedInfo) => {
                expect(returnedInfo).toEqual(mockBookingDataAirShuttle);
            }, angular.noop);

            rootScope.$digest();
            done();
        });


        it('should set retreturnedInfo correcty without deepLinkParams and retrieveOrderPost called and getCommercialInfo reject', (done) =>  {
            mockBookingData.order.status = fakeMmBAppConstants.SLICE_STATUS.ISSUED;
            serviceReject(fakeCommercialInfobyMarketService, 'getCommercialInfo', {errorCode: 400});
            sameCase(done);
        });
        it('should set retreturnedInfo correcty without deepLinkParams and retrieveOrderByCheckinId called and getCalculateFlightsAvios resolve', (done) =>  {
            inject(() =>  {
                mockBookingData.order.status = fakeMmBAppConstants.SLICE_STATUS.ON_HOLD_CONFIRMABLE;
                getParameterByNameTrue(fakeMmBUtilService);

                serviceResolve(fakeCalculatePointsTransformer, 'genCalAviosSummary', {});
                serviceResolve(fakeibCCalculatePointsService, 'getCalculateFlightsAvios', {});
                serviceResolve(fakeCalculatePointsTransformer, 'TransCalcPointsData', {});
                serviceResolve(fakeCalculatePointsTransformer, 'TransCalcPointsForPassenger', {});

            });
            localStorageService.set('deepLinkParams', false);
            testCookies.putObject(fakeMmBAppConstants.COOKIES.CHECKIN_ID, { 'checkinId': checkinId }, { 'path': fakeMmBAppConstants.COOKIES.DEFAULT_PATH });
            BookingSearchService.searchFlightsPassengers('surname', 'pnr', {}).then((returnedInfo) => {
                expect(returnedInfo).toEqual(mockBookingData);
            }, angular.noop);

            rootScope.$digest();
            done();
        });

        it('should set retreturnedInfo correcty without deepLinkParams and retrieveOrderByCheckinId resolve and getCalculateFlightsAvios reject', (done) =>  {
            inject(() =>  {
                mockBookingData.order.status = fakeMmBAppConstants.SLICE_STATUS.FRAUD_ONHOLD;
                getParameterByNameTrue(fakeMmBUtilService);

                serviceResolve(fakeRetrieveOrderService, 'retrieveOrderByCheckinId', mockBookingData);
                serviceResolve(fakeCalculatePointsTransformer, 'genCalAviosSummary', {});
                serviceReject(fakeibCCalculatePointsService, 'getCalculateFlightsAvios', {});
            });
            sameCase(done);
        });
        it('should set retreturnedInfo correcty without deepLinkParams and retrieveOrderByCheckinId reject', (done) =>  {
            inject(() =>  {
                mockBookingData.order.status = fakeMmBAppConstants.SLICE_STATUS.FRAUD_ONHOLD;
                getParameterByNameTrue(fakeMmBUtilService);

                serviceReject(fakeRetrieveOrderService, 'retrieveOrderByCheckinId', {});
            });
            sameCase(done);
        });
        it('should set retreturnedInfo correcty without deepLinkParams and retrieveOrderByCheckinId called and getCalculatePoints failed', (done) =>  {
            inject(() => {
                mockBookingData.order.status = fakeMmBAppConstants.SLICE_STATUS.ISSUED;
                getParameterByNameTrue(fakeMmBUtilService);
                serviceReject(fakeCalculatePointsService, 'getCalculatePoints', {});
            });
            sameCase(done);
        });

        it('should set retreturnedInfo correcty without deepLinkParams and retrieveOrderByFlightId reject', (done) =>  {
            inject(() => {
                fakeMmBAppConstants.market = 'US';
                mockBookingData.order.status = fakeMmBAppConstants.SLICE_STATUS.ISSUED;
                getParameterByNameTrue(fakeMmBUtilService);
                serviceReject(fakeRetrieveOrderService, 'retrieveOrderByFlightId', {});
            });
            localStorageService.set('deepLinkParams', false);
            testCookies.putObject(fakeMmBAppConstants.COOKIES.CHECKIN_ID, null);
            BookingSearchService.searchFlightsPassengers('surname', 'pnr', false).then((returnedInfo) => {
                expect(returnedInfo).toEqual(mockBookingData);
            }, angular.noop);

            rootScope.$digest();
            done();
        });
        it('should set continueWithCommercialInfo with market', (done) => {
            inject(() => {
                fakeMmBAppConstants.market = 'ES';
                mockBookingData.order.status = fakeMmBAppConstants.SLICE_STATUS.ISSUED;
                getAirlinesLogosReject(serviceReject, fakeMmBAirlinesLogoService);
                getParameterByNameFalse(fakeMmBUtilService);
                serviceResolve(fakeRetrieveOrderService, 'retrieveOrderByDeepLink', mockBookingDataAirShuttle);
            });
            localStorageService.set('deepLinkParams', true);
            sameCaseAirShuttle(done);
        });

        it('should call handleRetrievalFlow when no special conditions exist (standard PNR flow)', (done) => {
            mockBookingData.order.status = fakeMmBAppConstants.SLICE_STATUS.ISSUED;
            mockBookingData.order.bookingReferences = [{ reference: 'ABC123' }];
            mockBookingData.passengers = [{ personalInfo: { surname: 'TESTUSER' } }];
            mockBookingData.order.slices = [{ type: 'other' }];

            fakeMmBUtilService.getParameterByName = jasmine.createSpy('getParameterByName').and.callFake((paramName) => {
                if (paramName === 'step') return null;
                if (paramName === fakeMmBAppConstants.URL_PARAMETERS.FLIGHT_ID) return null;
                return null;
            });

            fakeFrequentFlyersCompaniesService.getFrequentFlyersCompaniesPromised = jasmine.createSpy('getFrequentFlyersCompaniesPromised').and.callFake(() => {
                let deferred = $q.defer();
                deferred.resolve({});
                return deferred.promise;
            });

            serviceResolve(fakeCommercialInfobyMarketService, 'getCommercialInfo', mockCommercialInfo);
            serviceResolve(fakeMmBAirlinesLogoService, 'getAirlinesLogos', {});

            localStorageService.remove('deepLinkParams');
            testCookies.remove(fakeMmBAppConstants.COOKIES.CHECKIN_ID, { path: fakeMmBAppConstants.COOKIES.DEFAULT_PATH });

            spyOn(BookingSearchService, 'handleRetrievalFlow').and.callFake((params) => {
                expect(params.pnr).toBe('ABC123');
                expect(params.surname).toBe('TESTUSER');
                expect(params.resolveData).toBeDefined();
                expect(params.reject).toBeDefined();
                expect(params.serviceError).toBeDefined();
                params.resolveData(mockBookingData);
            });

            BookingSearchService.searchFlightsPassengers('TESTUSER', 'ABC123', false).then((returnedInfo) => {
                expect(BookingSearchService.handleRetrievalFlow).toHaveBeenCalled();
                expect(returnedInfo).toBeDefined();
                expect(returnedInfo.isAirShuttle).toBe(false);
                expect(returnedInfo.isOnHold).toBe(false);

                done();
            }, (error) => {
                fail('Should not reject: ' + JSON.stringify(error));
                done();
            });
            rootScope.$digest();
        });

        xit('should call retrieveOrderPost and handle rejection when flowBob param exists', inject(($rootScope, $q, BookingSearchService) => {
            const mockUrl = new URL('http://fake.url?flowBob=true');
            spyOn(window, 'URL').and.returnValue(mockUrl as any);

            BookingSearchService.RetrieveOrderService = {
                retrieveOrderPost: jasmine.createSpy('retrieveOrderPost').and.callFake(() => {
                    const deferred = $q.defer();
                    deferred.reject('mockError');
                    return deferred.promise;
                })
            };

            BookingSearchService.LoadingSpinnerService = {
                hide: jasmine.createSpy('hide')
            };

            const params = {
                pnr: 'ABC123',
                surname: 'TESTUSER',
                resolveData: jasmine.createSpy('resolveData'),
                reject: jasmine.createSpy('reject'),
                serviceError: jasmine.createSpy('serviceError'),
            };

            BookingSearchService.handleRetrievalFlow(params);

            $rootScope.$digest();

            expect(BookingSearchService.IbMmbRetrieveOrderOtpProtectedService.retrieveOrder).toHaveBeenCalledWith('TESTUSER', 'ABC123');
            expect(BookingSearchService.LoadingSpinnerService.hide).toHaveBeenCalled();
            expect(params.reject).toHaveBeenCalledWith('mockError');
        }));

        afterEach(() => {
            fakeMmBAppConstants.market = 'US';
            mockBookingData.order.status = fakeMmBAppConstants.SLICE_STATUS.ISSUED;
        });
    });

    //NEW
    describe('when searchFlightsPassengersEvent is called', () =>  {
        let sameCaseOnHold = (done) => {
            BookingSearchService.searchFlightsPassengersEvent(null, { 'pnr': 'pnrTest', 'surname': 'surnameTest', 'isOnHold': true });
            rootScope.$digest();
            done();
        };

        beforeEach(() => {
            fakeMmBAppConstants.MMB_MARKETS = [];
            serviceResolve(fakeFlagsTransformer, 'generateFlagsMenu', fakeFlagsObject, false, true);
            serviceResolve(BookingSearchService, 'searchFlightsPassengers', bookingDataEmpty);
            serviceReject(fakeChangleFlightsService, 'getDisruptionPeriods', {});
            serviceResolve(fakeMmBModalService, 'showGenericError', {}, true);
            serviceResolve(fakeMmBUtilsSharedService, 'getFlagValue', true);
            serviceResolve(fakeMmBUtilsSharedService, 'getDisruptionType', {disruptionType: 'test', disruptionId: 'test'});
            serviceResolve(fakeSisterCitiesService, 'getSisterCities', getSisterResponse);
            serviceResolve(fakeVoucherInformationService, 'getVoucherAmount', {price: {refundPercent: 30, fare: 'BUSINESS', currency: 'EUR' }, orderItems: [{subtype: 'VOUCHER_REFUND', percentage: 0}], refundedOrderItems: ['test'], notifications: [{email: 'test@test.com'}], currencies: true, vouchers: true, refundFees: true});
            serviceResolve(fakeMmBUtilService, 'transformVoucherPriceInfo', {});
            serviceResolve(fakeMmBUtilService, 'transformCashPriceInfo', {});
            serviceResolve(fakeCashRefundService, 'getCashRefundInformation', {
                notifications: [{email: 'test@test.com'}],
                orderitems : '',
                currencies : 'EUR',
                refundTotalAmountInfos : true,
            });
        });
        it('and getVoucherAndCashData called and setVoucherPrice called', (done) =>  {
            sameCaseOnHold(done);
        });

        it('and getVoucherAndCashData called and setVoucherPrice called and createSisterCitiesRequest isDisruption', (done) =>  {
            inject(() => {
                bookingDataEmpty.order.status = fakeMmBAppConstants.ORDER_STATUS_VALUES.CANCELATION_FLAG;
            });

            sameCaseOnHold(done);
        });

        it('and searchFlightsPassengers resolve with notAirShuttle , not onHold, not disruption, OTHER', (done) =>  {
            inject(() => {
                fakeMmBAppConstants.MMB_MARKETS = [];
                serviceResolve(fakeFlagsTransformer, 'generateFlagsMenu', {showRefundVoucherSection: true, sisterCitiesData: {hasSistercitiesPossibility: true, allowedSlices: [{test1: '1', test2: '2'}]}});
                serviceResolve(BookingSearchService, 'searchFlightsPassengers', bookingDataEmpty);
                serviceReject(fakeChangleFlightsService, 'getDisruptionPeriods', {});
                serviceReject(fakeDigitalBoardingService, 'getDigitalBoardingAvailability', {});
                serviceReject(fakeCommonsAncillariesService, 'getAncillaries', {});
                serviceReject(fakeGastroOfferService, 'importGastronomicProposalComponent', {});
                serviceReject(fakeDigitalMenuStatusService, 'getDigitalMenuStatus', {});
                serviceResolve(fakeMmBModalService, 'showGenericError', {}, true);
                serviceResolve(fakeReshopConditionsService, 'getReshopConditions', {
                    flightChangeCapabilities: true,
                    disruptionSeatChangeCapabilites: true
                });
            });

            sameCaseOnHold(done);
        });
        it('and searchFlightsPassengers resolve with isOnHold true', (done) =>  {
            inject(() => {
                MMB_MARKETS_ES_EU(fakeMmBAppConstants);
                fakeFlagsTransformer.generateFlagsMenu = jasmine.createSpy('generateFlagsMenu').and.callFake(() =>  {
                    let defer = $q.defer();
                    defer.resolve({showCashRefundOnline: true});
                    return defer.promise;
                });
                serviceResolve(BookingSearchService, 'searchFlightsPassengers', bookingDataOnHold);

                someServicesSameReject();
            });

            sameCaseOnHold(done);
        });

        let sameCaseAirtShuttleAndDone = (done) => {
            sameCaseAirShuttle(BookingSearchService, rootScope);
            done();
        };
        it('and searchFlightsPassengers resolve with isAirShuttle true', (done) =>  {
            inject(() => {
                MMB_MARKETS_ES_EU(fakeMmBAppConstants);
                serviceResolve(BookingSearchService, 'searchFlightsPassengers', bookingDataAirShuttle);
                someServicesSameReject();
            });
            sameCaseAirtShuttleAndDone(done);
        });
        it('and searchFlightsPassengers resolve with hasInvoluntaryChange false', (done) =>  {
            inject(() => {
                MMB_MARKETS_ES_EU(fakeMmBAppConstants);
                serviceResolve(BookingSearchService, 'searchFlightsPassengers', bookingData);
                someServicesSameReject();
                fakeMmbInvoluntaryChangeService.hasInvoluntaryChange = jasmine.createSpy('hasInvoluntaryChange').and.callFake(() =>  {
                    return false;
                });
            });

            sameCaseAirShuttle(BookingSearchService, rootScope);
            done();
        });

        it('and searchFlightsPassengers resolve with isDisruptionOrder true and qualifiers is empty', (done) =>  {
            inject(() => {
                MMB_MARKETS_ES_EU(fakeMmBAppConstants);
                bookingDataIsDisruption.qualifiers = [];
                serviceResolve(BookingSearchService, 'searchFlightsPassengers', bookingData);
                someServicesSameReject();
            });

            sameCaseAirtShuttleAndDone(done);
        });
        it('and searchFlightsPassengers resolve with isDisruptionOrder true', (done) =>  {
            inject(() => {
                MMB_MARKETS_ES_EU(fakeMmBAppConstants);
                bookingDataIsDisruption.qualifiers = [];
                serviceResolve(BookingSearchService, 'searchFlightsPassengers', bookingDataIsDisruption);

                serviceReject(fakeChangleFlightsService, 'getDisruptionPeriods', {});
                serviceReject(fakeDigitalBoardingService, 'getDigitalBoardingAvailability', {});

                serviceResolve(fakeCommonsAncillariesService, 'getAncillaries', mockAncillariesResponse);
                serviceResolve(fakeCommonsAncillariesService, 'getAncillarieSummary', mockBreakDownResponse);
                serviceResolve(fakeGastroOfferService, 'importGastronomicProposalComponent', {});

                serviceReject(fakeTFakeBookingManagementService, 'getBookingInfo', {});
                serviceReject(fakeDigitalMenuStatusService, 'getDigitalMenuStatus', {});

            });
            sameCaseAirShuttle(BookingSearchService, rootScope);
            done();
        });

        let sameCaseAirShuttleAndExpect = (done) => {
            BookingSearchService.searchFlightsPassengersEvent(null, { 'pnr': 'pnrTest', 'surname': 'surnameTest', 'isAirShuttle': true })
            .catch(angular.noop);
            rootScope.$digest();
            expect(fakeCommonsModalService.showGenericError).toHaveBeenCalled();
            done();
        };

        it('and searchFlightsPassengers reject the promise with 500, an error modal should be fired', (done) =>  {
            let errorMessage = {errorCode: 500};
            inject(() => {
                MMB_MARKETS_ES_EU(fakeMmBAppConstants);
                serviceReject(BookingSearchService, 'searchFlightsPassengers', errorMessage);
            });
            sameCaseAirShuttleAndExpect(done);
        });

        it('and searchFlightsPassengers with markets ES reject the promise with 503, an error modal should be fired', (done) =>  {
            let errorMessage = {errorCode: 503};
            inject(() => {
                fakeMmBAppConstants.MMB_MARKETS = ['ES'];
                serviceReject(BookingSearchService, 'searchFlightsPassengers', errorMessage);
            });
            sameCaseAirShuttleFalse(BookingSearchService, angular, rootScope);
            expect(fakeMmBModalService.showGenericError).toHaveBeenCalled();
            done();
        });

        it('and searchFlightsPassengers reject the promise with 412, an error modal should be fired', (done) =>  {
            let errorMessage = {errorCode: 412};
            bookingData.isAirShuttle = true;
            inject(() =>  {
                MMB_MARKETS_ES_EU(fakeMmBAppConstants);
                localStorageService.set('sendReloadEvent', true);
                serviceReject(BookingSearchService, 'searchFlightsPassengers', errorMessage);

                fakeMmBModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.callFake(() =>  {
                    let deferred = $q.defer();
                    deferred.resolve();
                    return { 'result': deferred.promise }
                });
                serviceResolve(fakeRetrieveOrderService, 'retrieveOrderConsent', bookingDataNotShuttle);
                serviceResolve(fakeChangleFlightsService, 'getDisruptionPeriods', {
                    blackOutPeriods : true,
                    allowedPeriods : true,
                });

                fakeMmBUtilService.getParameterByName = jasmine.createSpy('getParameterByName').and.callFake(() =>  {
                    return fakeMmBAppConstants.STEP_PARAM_VALUES.CHANGE_FLIGHT;
                });

                serviceResolve(fakeDigitalBoardingService, 'getDigitalBoardingAvailability', {
                    hasData: true,
                    data:{}
                });
                serviceResolve(fakeCommonsAncillariesService, 'getAncillaries', mockAncillariesResponse);
                serviceResolve(fakeCommonsAncillariesService, 'getAncillarieSummary', mockBreakDownResponse);
                serviceResolve(fakeTFakeBookingManagementService, 'getBookingInfo', mockManagementResponse);
                serviceResolve(fakeDigitalMenuStatusService, 'getDigitalMenuStatus', {});

            });
            BookingSearchService.searchFlightsPassengersEvent(null, 'bookingName')
            .catch(angular.noop);
            rootScope.$digest();
            expect(fakeMmBModalService.showWaitingModal).toHaveBeenCalled();
            expect(fakeMmBModalService.finishWaiting).toHaveBeenCalled();
            done();
        });

        it('and searchFlightsPassengers reject and getDigitalMenuStatus, getBookingInfo, getAncillaries  reject', (done) =>  {
            let errorMessage = {errorCode: 412};
            inject(() =>  {
                MMB_MARKETS_ES_EU(fakeMmBAppConstants);
                serviceReject(BookingSearchService, 'searchFlightsPassengers', errorMessage);
                fakeMmBModalService.showGenericModal = jasmine.createSpy('showGenericModal').and.callFake(() =>  {
                    let deferred = $q.defer();
                    deferred.resolve();
                    return { 'result': deferred.promise }
                });
                serviceResolve(fakeRetrieveOrderService, 'retrieveOrderConsent', bookingDataNotShuttle);

                serviceReject(fakeChangleFlightsService,'getDisruptionPeriods',{});

                fakeMmBUtilService.getParameterByName = jasmine.createSpy('getParameterByName').and.callFake(() =>  {
                    return fakeMmBAppConstants.STEP_PARAM_VALUES.CHANGE_FLIGHT;
                });
                fakeMmbInvoluntaryChangeService.hasInvoluntaryChange = jasmine.createSpy('hasInvoluntaryChange').and.callFake(() =>  {
                    return true;
                });

                serviceReject(fakeDigitalBoardingService,'getDigitalBoardingAvailability',{});
                serviceReject(fakeCommonsAncillariesService,'getAncillaries',{});
                serviceReject(fakeGastroOfferService,'importGastronomicProposalComponent',{});
                serviceReject(fakeCommonsAncillariesService,'getAncillarieSummary',{});
                serviceReject(fakeDigitalMenuStatusService,'getDigitalMenuStatus',{});
            });
            sameCaseAirShuttleFalse(BookingSearchService, angular, rootScope);
            expect(fakeMmBModalService.finishWaiting).toHaveBeenCalled();
            expect(fakeGastroOfferService.importGastronomicProposalComponent).toHaveBeenCalled();
            done();
        });

        it('and searchFlightsPassengers reject the promise with 410, and showGenericError called', (done) =>  {
            let errorMessage = {errorCode: 410, internalErrorCode: 'SSE_ORM_test'};
            inject(() => {
                MMB_MARKETS_ES_EU(fakeMmBAppConstants);
                serviceReject(BookingSearchService, 'searchFlightsPassengers', errorMessage);
            });
            sameCaseAirShuttleAndExpect(done);
        });

        it('and searchFlightsPassengers reject the promise with 409, and finishWaiting called', (done) =>  {
            let errorMessage = {errorCode: 409, internalErrorCode: fakeMmBAppConstants.WARNING_MESSAGES.SAME_SURNAME_WARNING};
            inject(() => {
                MMB_MARKETS_ES_EU(fakeMmBAppConstants);
                serviceReject(BookingSearchService, 'searchFlightsPassengers', errorMessage);
            });
            BookingSearchService.searchFlightsPassengersEvent(null, { 'pnr': 'pnrTest', 'surname': 'surnameTest', 'isAirShuttle': true })
            .catch(angular.noop);
            rootScope.$digest();
            expect(fakeMmBModalService.finishWaiting).toHaveBeenCalled();
            done();
        });

        it('and searchFlightsPassengers reject the promise with other, and showGenericError called', (done) =>  {
            let errorMessage = {errorCode: 600, internalErrorCode: 'test'};
            inject(() => {
                MMB_MARKETS_ES_EU(fakeMmBAppConstants);
                serviceReject(BookingSearchService, 'searchFlightsPassengers', errorMessage);
            });
            sameCaseAirShuttleAndExpect(done);
        });

        it('should remove "isRefreshCall" from localStorage in CommonsAncillariesService.getAncillarieSummary finally block', (done) => {
              inject(() => {
                spyOn(localStorageService, 'remove').and.callThrough();

                MMB_MARKETS_ES_EU(fakeMmBAppConstants);
                bookingDataIsDisruption.qualifiers = [{name: 'IBDPHOLIDAYS'}];
                serviceResolve(BookingSearchService, 'searchFlightsPassengers', bookingDataIsDisruption);
                serviceReject(fakeChangleFlightsService,'getDisruptionPeriods',{});
                serviceReject(fakeDigitalBoardingService,'getDigitalBoardingAvailability',null);
                serviceResolve(fakeCommonsAncillariesService, 'getAncillaries', mockAncillariesResponse);
                serviceResolve(fakeCommonsAncillariesService, 'getAncillarieSummary', mockBreakDownResponse);
                serviceResolve(fakeGastroOfferService, 'importGastronomicProposalComponent', {});
                serviceResolve(fakeDigitalMenuStatusService, 'getDigitalMenuStatus', {});
            });
            localStorageService.set('isRefreshCall', true)
            sameCaseAirShuttle(BookingSearchService, rootScope);
            expect(localStorageService.remove).toHaveBeenCalledWith('isRefreshCall');

            localStorageService.remove('isRefreshCall')
            done();
        });
    });

    describe('when isDisruptionOrder is called ', () => {
        const fakeTickets = [{ticketNumbers: ['0752389700558']}];
        const scenarios = [
            {type: 'UNCONFIRMED_CHANGES', tickets: fakeTickets},
            {type: 'ACCEPT_CHANGES_PENDING', tickets: fakeTickets},
            {type: 'ACCEPT_CHANGES_PENDING_TK', tickets: fakeTickets},
            {type: 'UNCONFIRMED_CHANGES_MIXED', tickets: fakeTickets},
            {type: 'ACCEPT_CHANGES_PENDING_MIXED', tickets: fakeTickets},
            {type: 'CANCELATION_CHANGES', tickets: fakeTickets},
            {type: 'CANCELATION_CHANGES', tickets: null},
            {type: 'WAITLIST_CONFIRMED_CHANGES', tickets: fakeTickets},
            {type: 'WAITLIST_CONFIRMED_CHANGES', tickets: null},
            {type: 'DISRUPTION_CHANGES_MIXED', tickets: fakeTickets},

        ]
        const data = {
            flowId: 'TWFuYWdlTXlCb29raW5nQElCOWM3MmM3ZDZiYzZkNGYzN2EwMTA5MzRmYjRjZDFhODU%3D',
            order: {
                status: 'UNCONFIRMED_CHANGES'
            },
            tickets: fakeTickets,
            flexibilizationCapabilitiesInformation: {
                code: 'COVID19',
                description: ''
            }
        };
        scenarios.forEach(({ type, tickets }) => {
            it(`should test for BookingSearchService.isDisruptionOrder and (${type})`, (done) => {
                data.order.status = type;
                data.tickets = tickets;
                expect(BookingSearchService.isDisruptionOrder(data)).toEqual(true);
                done();
            });
        });
        it('should return true for special status when there are no tickets', () => {
            const data = {
                order: { status: BookingSearchService.MmBAppConstants.ORDER_STATUS_VALUES.CANCELATION_CHANGES },
                tickets: null,
                flexibilizationCapabilitiesInformation: {},
                genericDisruptionCapabilitiesInformation: {}
            };

            const result = BookingSearchService.isDisruptionOrder(data);
            expect(result).toBeTrue();
        });
    });

    describe('when isSisterCitiesEnabled is called ', () => {
        it('test isSisterCitiesEnabled() and return true', (done) => {
            let sisterResponse = {
                cities:[
                    {
                        sisterCities:[
                            {
                                sister: 'true'
                            },
                            {
                                sister: 'true'
                            }
                        ]
                    }
                ]
            }
            expect(BookingSearchService.isSisterCitiesEnabled(sisterResponse)).toEqual(true);
            done();
        });
    });

    describe('when externalFlowsRedirections is called', () => {
        const scenarios = [
            {type: 'AIR_SHUTTLE_FIXED', flexibleDisruptedStatus: 'NONE', status: 'ISSUED', location: '/air-shuttle'},
            {type: 'AIR_SHUTTLE_OPEN', flexibleDisruptedStatus:'NONE', status: 'ISSUED', location: '/air-shuttle'},
            {type: 'PURE_IB', flexibleDisruptedStatus:'DISRUPTED', status: 'ISSUED', location: '/disrupted'},
            {type: 'ISSUE', flexibleDisruptedStatus:'NONE', status: 'REGULAR', location: '/dashboard'},
            {type: 'ON_HOLD', flexibleDisruptedStatus: 'NONE', status: 'ON_HOLD', location: null},
            {type: 'PNR_GROUP', flexibleDisruptedStatus:'NONE', status: 'ISSUED', location: null},
        ]
        let mockLightData;
        let urlWindow = 'https://www.int.iberia.com';
        beforeEach(() => {
            mockLightData = {
                order: {
                    clientLocator: 'PMYST',
                    type: 'PURE_IB',
                    flexibleDisruptedStatus: 'NONE',
                    status: 'ISSUED'
                },
                passengers: [{personalInfo: {surname: 'TESTUSER'}}]
            };

            BookingSearchService.$window = {location: {origin: urlWindow}};

            rootScope.appMarket = 'ES';
            rootScope.appLang = 'ES';
            fakeRedirectionService.externalRedirect.calls.reset();
            fakeLocation.path.calls.reset();
        });
        const conditionalCasesResult = (type, flexibleDisruptedStatus) => {
            return (type !== "ON_HOLD" && type !== "AIR_SHUTTLE_OPEN" && type !== "AIR_SHUTTLE_FIXED" && flexibleDisruptedStatus !== 'DISRUPTED');
        };

        scenarios.forEach(({ type, flexibleDisruptedStatus, status, location }) => {
            it(`should redirect to ${type}`, (done) => {
                mockLightData.order.type = type;
                mockLightData.order.flexibleDisruptedStatus = flexibleDisruptedStatus;
                mockLightData.order.status = status;

                BookingSearchService.externalFlowsRedirections(mockLightData);

                if (type === 'ON_HOLD') {
                    expect(fakeRedirectionService.externalRedirect).toHaveBeenCalled();
                }
                else if (type === "AIR_SHUTTLE_FIXED" || type === "AIR_SHUTTLE_OPEN") {
                    expect(fakeLocation.path).toHaveBeenCalledWith(location);
                }
                else if (flexibleDisruptedStatus === 'DISRUPTED') {
                    expect(fakeLocation.path).toHaveBeenCalledWith(location);
                } else if (type === 'PNR_GROUP') {
                    expect(fakeLocation.path).not.toHaveBeenCalled();
                    expect(fakeRedirectionService.externalRedirect).not.toHaveBeenCalled();
                } else {
                    expect(fakeLocation.path).toHaveBeenCalledWith(location);
                }

                done();
            });
        });
    });

    xdescribe('when handleParallelOrderRetrieval is called', () => {
        const sameCase = (handlePromise, done) => {
            handlePromise.then(result => {
                expect(result).toEqual(mockBookingData);
                done();
            });
            rootScope.$digest();
        };
        const mockOrder = (typeOrder) => {
            return {
                order: {
                    type: typeOrder,
                    flexibleDisruptedStatus: 'NONE',
                    status: 'ISSUED'
                }
            }
        };
        it('should resolve with importOrderPromise result when both requests succeed', (done) => {
            const mockLightData = mockOrder('REGULAR');

            const handlePromise = BookingSearchService['handleParallelOrderRetrieval']('TEST123', 'SURNAME');
            // observerCallback.next({ data: mockLightData });

            sameCase(handlePromise, done);

        });

        it('should handle orderHandler$ error and still resolve with importOrderPromise result', (done) => {

            const handlePromise = BookingSearchService['handleParallelOrderRetrieval']('TEST123', 'SURNAME');
            // observerCallback.error(new Error('Test error'));

            sameCase(handlePromise, done);
        });

        it('should set needsToWaitForImportOrder to true and not hide spinner when redirection is needed', (done) => {
            const mockLightData = mockOrder('AIR_SHUTTLE_FIXED');
            fakeLoadingSpinnerService.hide.calls.reset();

            const handlePromise = BookingSearchService['handleParallelOrderRetrieval']('TEST123', 'SURNAME');
            // observerCallback.next({ data: mockLightData });

            sameCase(handlePromise, done);
        });
    });
    describe('When GastroOffer Web component is loaded', ()=> {
        beforeEach(()=> {
            inject(() => {
                MMB_MARKETS_ES_EU(fakeMmBAppConstants);
                bookingDataIsDisruption.qualifiers = [{name: 'IBDPHOLIDAYS'}];
                serviceResolve(BookingSearchService, 'searchFlightsPassengers', bookingDataIsDisruption);
                serviceReject(fakeChangleFlightsService, 'getDisruptionPeriods', {});
                serviceReject(fakeDigitalBoardingService, 'getDigitalBoardingAvailability', {});
                serviceResolve(fakeCommonsAncillariesService, 'getAncillaries', mockAncillariesResponse);
                serviceResolve(fakeCommonsAncillariesService, 'getAncillarieSummary', mockBreakDownResponse);
                serviceResolve(fakeGastroOfferService, 'importGastronomicProposalComponent', {});
            });
        });
        it('And  getBookingInfo resolve success, should call gastroOfferService', (done) =>  {
            inject(() => {
                serviceResolve(fakeTFakeBookingManagementService, 'getBookingInfo', {});
            });

            sameCaseAirShuttle(BookingSearchService, rootScope);
            expect(fakeGastroOfferService.importGastronomicProposalComponent).toHaveBeenCalled();
            done();
        });
        it('And getBookingInfo resolve success and gastroOffer resolve error, should call digitalMenuStatusError', (done)=> {
            inject(() => {
                serviceResolve(fakeTFakeBookingManagementService, 'getBookingInfo', {});
                serviceReject(fakeGastroOfferService, 'importGastronomicProposalComponent', {});
            });

            sameCaseAirShuttle(BookingSearchService, rootScope);
            expect(fakeGastroOfferService.importGastronomicProposalComponent).toHaveBeenCalled();
            done();
        });
        it('And getBookingInfo resolve error, and gastroOffer resolve error should call gastroOfferService', (done) =>  {
            inject(() => {
                serviceReject(fakeTFakeBookingManagementService, 'getBookingInfo', {});
                serviceReject(fakeGastroOfferService, 'importGastronomicProposalComponent', {});
            });

            sameCaseAirShuttle(BookingSearchService, rootScope);
            expect(fakeGastroOfferService.importGastronomicProposalComponent).toHaveBeenCalled();
            done();
        });
        it('And getBookingInfo resolve error, and gastroOffer resolve success should call gastroOfferService', (done) =>  {
            inject(() => {
                serviceReject(fakeTFakeBookingManagementService, 'getBookingInfo', {});
            });

            sameCaseAirShuttle(BookingSearchService, rootScope);
            expect(fakeGastroOfferService.importGastronomicProposalComponent).toHaveBeenCalled();
            done();
        });
    });
    describe('vipLoungesError function coverage tests', () => {
        it('should call vipLoungesError and set vipLoungesInvitations to null', () => {
            inject(() => {
                const bookingData = {nextStep: '/dashboard'};

                spyOn(BookingSearchService, 'vipLoungesError').and.callThrough();
                spyOn(localStorageService, 'set').and.callThrough();
                BookingSearchService['vipLoungesError'](bookingData);

                expect(localStorageService.set).toHaveBeenCalledWith('vipLoungesInvitations', null);
            });
        });
    });

    describe('loadVipLoungesData function tests', () => {
        let mockBookingData;
        let mockCustomerData;
        let responseGeneral = { hasData: true, data: {} };
        const localStorageServiceKey = (data) => {
            localStorageService.get.and.callFake((key) => {
                if (key === 'customerData') return data;
                return null;
            });
        };
        const sameCaseLoadVipLoungesData = (data) => {
            BookingSearchService.shouldCallVipLounges.and.returnValue(true);
            localStorageServiceKey(data);
            serviceResolve(fakeVipLoungesService, 'getVipLounges', responseGeneral);

            BookingSearchService['loadVipLoungesData']('/dashboard', mockBookingData);
            expect(fakeVipLoungesService.getVipLounges).toHaveBeenCalledWith(
                mockBookingData.flowId,
                undefined
            );
        };

        beforeEach(() => {
            mockBookingData = {
                flowId: 'test-flow-id-123'
            };

            mockCustomerData = {
                personalInfo: {
                    ibPlusNumber: 'IB12345678'
                }
            };

            fakeVipLoungesService.getVipLounges.calls.reset();
            spyOn(BookingSearchService, 'shouldCallVipLounges').and.callThrough();
            spyOn(BookingSearchService, 'vipLoungesSuccess').and.callThrough();
            spyOn(BookingSearchService, 'vipLoungesError').and.callThrough();
            spyOn(localStorageService, 'get').and.callThrough();
        });

        it('should not call VipLoungesService when shouldCallVipLounges returns false', () => {
            BookingSearchService.shouldCallVipLounges.and.returnValue(false);
            BookingSearchService['loadVipLoungesData']('/dashboard', mockBookingData);

            expect(BookingSearchService.shouldCallVipLounges).toHaveBeenCalled();
            expect(fakeVipLoungesService.getVipLounges).not.toHaveBeenCalled();
            expect(localStorageService.get).not.toHaveBeenCalledWith('customerData');
        });

        it('should call VipLoungesService with correct parameters when shouldCallVipLounges returns true', () => {
            BookingSearchService.shouldCallVipLounges.and.returnValue(true);
            localStorageServiceKey(mockCustomerData);
            serviceResolve(fakeVipLoungesService, 'getVipLounges', responseGeneral);

            BookingSearchService['loadVipLoungesData']('/dashboard', mockBookingData);
            expect(BookingSearchService.shouldCallVipLounges).toHaveBeenCalled();
            expect(localStorageService.get).toHaveBeenCalledWith('customerData');
            expect(fakeVipLoungesService.getVipLounges).toHaveBeenCalledWith(
                mockBookingData.flowId,
                mockCustomerData.personalInfo.ibPlusNumber
            );
        });

        it('should handle undefined customerData gracefully', () => {
            sameCaseLoadVipLoungesData(null);
        });

        it('should handle customerData without personalInfo', () => {
            const customerDataWithoutPersonalInfo = { someOtherData: 'test' };
            sameCaseLoadVipLoungesData(customerDataWithoutPersonalInfo);
        });

        it('should handle customerData with personalInfo but without ibPlusNumber', () => {
            const customerDataWithoutIbPlus = {
                personalInfo: {
                    name: 'John Doe'
                }
            };
            sameCaseLoadVipLoungesData(customerDataWithoutIbPlus);
        });

        it('should call vipLoungesSuccess when VipLoungesService resolves successfully', (done) => {
            BookingSearchService.shouldCallVipLounges.and.returnValue(true);
            const mockResponse = { hasData: true, data: { lounges: ['lounge1'] } };
            localStorageServiceKey(mockCustomerData);

            serviceResolve(fakeVipLoungesService, 'getVipLounges', mockResponse);
            BookingSearchService['loadVipLoungesData']('/dashboard', mockBookingData);
            rootScope.$digest();
            setTimeout(() => {
                expect(BookingSearchService.vipLoungesSuccess).toHaveBeenCalledWith(
                    mockResponse,
                    '/dashboard'
                );
                expect(BookingSearchService.vipLoungesError).not.toHaveBeenCalled();
                done();
            }, 0);
        });

        it('should call vipLoungesError when VipLoungesService rejects', (done) => {
            BookingSearchService.shouldCallVipLounges.and.returnValue(true);
            localStorageServiceKey(mockCustomerData);

            fakeVipLoungesService.getVipLounges.and.callFake(() => {
                const deferred = $q.defer();
                deferred.reject(new Error('Service error'));
                return deferred.promise;
            });

            BookingSearchService['loadVipLoungesData']('/dashboard', mockBookingData);
            rootScope.$digest();

            setTimeout(() => {
                expect(BookingSearchService.vipLoungesError).toHaveBeenCalledWith('/dashboard');
                expect(BookingSearchService.vipLoungesSuccess).not.toHaveBeenCalled();
                done();
            }, 0);
        });

        it('should work with different nextStep values', () => {
            BookingSearchService.shouldCallVipLounges.and.returnValue(true);
            localStorageServiceKey(mockCustomerData);

            serviceResolve(fakeVipLoungesService, 'getVipLounges', responseGeneral);

            const testNextSteps = ['/dashboard', '/booking-manage', '/some-other-path'];

            testNextSteps.forEach(nextStep => {
                fakeVipLoungesService.getVipLounges.calls.reset();

                BookingSearchService['loadVipLoungesData'](nextStep, mockBookingData);
                expect(fakeVipLoungesService.getVipLounges).toHaveBeenCalledWith(
                    mockBookingData.flowId,
                    mockCustomerData.personalInfo.ibPlusNumber
                );
            });
        });

        it('should handle empty flowId', () => {
            BookingSearchService.shouldCallVipLounges.and.returnValue(true);
            const bookingDataWithEmptyFlowId = { flowId: '' };
            localStorageServiceKey(mockCustomerData);

            serviceResolve(fakeVipLoungesService, 'getVipLounges', responseGeneral);

            BookingSearchService['loadVipLoungesData']('/dashboard', bookingDataWithEmptyFlowId);

            expect(fakeVipLoungesService.getVipLounges).toHaveBeenCalledWith('', mockCustomerData.personalInfo.ibPlusNumber);
        });
    });
    describe('vipLoungesSuccess function tests', () => {
        let mockVipLoungesResponse;
        let nextStep;

        beforeEach(() => {
            mockVipLoungesResponse = {
                hasData: true,
                data: { lounges: ['lounge1', 'lounge2'] }
            };
            nextStep = '/dashboard';

            spyOn(localStorageService, 'set').and.callThrough();
            spyOn(rootScope, '$broadcast').and.callThrough();
            spyOn(fakeLocation, 'path').and.callThrough();
            fakeVipLoungesService.getExclusiveServicesLauncherComponent.calls.reset();
            fakeVipLoungesService.getVipInvitationsComponent.calls.reset();
            fakeVipLoungesService.getFastTrackCardComponent.calls.reset();
        });

        const setUpRejectComponent = (component, exception) => component.and.callFake(() => Promise.reject(exception));
        const setUpResolveComponent = (component, payload) => component.and.callFake(() => Promise.resolve(payload));
        const assertNullData = () => {
            expect(localStorageService.set).toHaveBeenCalledWith('vipLoungesInvitations', null);
            expect(rootScope.$broadcast).toHaveBeenCalledWith('vipLoungesDataReady', null);
            expect(fakeLocation.path).toHaveBeenCalledWith(nextStep);
        }

        const testCases = [
            { alias: 'all', setup: () => {
                setUpRejectComponent(fakeVipLoungesService.getExclusiveServicesLauncherComponent, new Error('Exclusive services error'));
                setUpRejectComponent(fakeVipLoungesService.getVipInvitationsComponent, new Error('VIP Invitations component error'));
                setUpRejectComponent(fakeVipLoungesService.getFastTrackCardComponent, new Error('Fast Track Card component error'));
            }},
            { alias: 'first', setup: () => {
                setUpRejectComponent(fakeVipLoungesService.getExclusiveServicesLauncherComponent, new Error('Exclusive services error'));
                setUpResolveComponent(fakeVipLoungesService.getVipInvitationsComponent, { success: true });
                setUpResolveComponent(fakeVipLoungesService.getFastTrackCardComponent, { success: true });
            }},
            { alias: 'second', setup: () => {
                setUpResolveComponent(fakeVipLoungesService.getExclusiveServicesLauncherComponent, { success: true });
                setUpRejectComponent(fakeVipLoungesService.getVipInvitationsComponent, new Error('VIP lounge component error'));
                setUpResolveComponent(fakeVipLoungesService.getFastTrackCardComponent, { success: true });
            }},
            { alias: 'third', setup: () => {
                setUpResolveComponent(fakeVipLoungesService.getExclusiveServicesLauncherComponent, { success: true });
                setUpResolveComponent(fakeVipLoungesService.getVipInvitationsComponent, { success: true });
                setUpRejectComponent(fakeVipLoungesService.getFastTrackCardComponent, new Error('Fast Track Card component error'));
            }},
        ]

        for (const { alias, setup } of testCases) {
            it(`should handle Promise.all rejection when ${alias} service fails`, (done) => {
                setup();
                BookingSearchService['vipLoungesSuccess'](mockVipLoungesResponse, nextStep);
                setTimeout(() => {
                    expect(localStorageService.set).toHaveBeenCalledWith('vipLoungesInvitations', mockVipLoungesResponse);
                    assertNullData();
                    done();
                }, 10);
            });
        }

        it('should handle Promise.all success path for comparison', (done) => {
            setUpResolveComponent(fakeVipLoungesService.getExclusiveServicesLauncherComponent, { success: true });
            setUpResolveComponent(fakeVipLoungesService.getVipInvitationsComponent, { success: true });
            setUpResolveComponent(fakeVipLoungesService.getFastTrackCardComponent, { success: true });

            BookingSearchService['vipLoungesSuccess'](mockVipLoungesResponse, nextStep);

            setTimeout(() => {
                expect(localStorageService.set).toHaveBeenCalledWith('vipLoungesInvitations', mockVipLoungesResponse);
                expect(rootScope.$broadcast).toHaveBeenCalledWith('vipLoungesDataReady', mockVipLoungesResponse);
                expect(fakeLocation.path).toHaveBeenCalledWith(nextStep);
                expect(localStorageService.set).not.toHaveBeenCalledWith('vipLoungesInvitations', null);
                expect(rootScope.$broadcast).not.toHaveBeenCalledWith('vipLoungesDataReady', null);
                done();
            }, 10);
        });

        it('should verify the sequence of calls in error scenario', (done) => {
            const setCallOrder = [];
            const broadcastCallOrder = [];

            spyOn(localStorageService, 'set').and.callFake((key, value) => {
                setCallOrder.push({ key, value });
            });

            spyOn(rootScope, '$broadcast').and.callFake((event, data) => {
                broadcastCallOrder.push({ event, data });
            });

            setUpRejectComponent(fakeVipLoungesService.getExclusiveServicesLauncherComponent, new Error('Exclusive services error'));
            setUpRejectComponent(fakeVipLoungesService.getVipInvitationsComponent, new Error('VIP Invitations component error'));
            setUpRejectComponent(fakeVipLoungesService.getFastTrackCardComponent, new Error('Fast Track Card component error'));
            BookingSearchService['vipLoungesSuccess'](mockVipLoungesResponse, nextStep);

            setTimeout(() => {
                expect(setCallOrder.length).toBe(2);
                expect(setCallOrder[0]).toEqual({
                    key: 'vipLoungesInvitations',
                    value: mockVipLoungesResponse
                });
                expect(setCallOrder[1]).toEqual({
                    key: 'vipLoungesInvitations',
                    value: null
                });

                expect(broadcastCallOrder).toContain({
                    event: 'vipLoungesDataReady',
                    data: null
                });
                done();
            }, 10);
        });

        it('should handle different nextStep values in error scenario', (done) => {
            const testNextSteps = ['/booking-manage', '/some-other-path', '/dashboard'];
            let completedTests = 0;

            testNextSteps.forEach((testNextStep) => {
                setUpRejectComponent(fakeVipLoungesService.getExclusiveServicesLauncherComponent, new Error('Exclusive services error'));
                setUpRejectComponent(fakeVipLoungesService.getVipInvitationsComponent, new Error('VIP Invitations component error'));
                setUpRejectComponent(fakeVipLoungesService.getFastTrackCardComponent, new Error('Fast Track Card component error'));

                fakeLocation.path.calls.reset();

                BookingSearchService['vipLoungesSuccess'](mockVipLoungesResponse, testNextStep);

                setTimeout(() => {
                    expect(fakeLocation.path).toHaveBeenCalledWith(testNextStep);
                    completedTests++;

                    if (completedTests === testNextSteps.length) {
                        done();
                    }
                }, 10);
            });
        });
    });

    describe('handleRetrievalFlow function tests', () => {
        let service: any;
        let resolveSpy: jasmine.Spy;
        let rejectSpy: jasmine.Spy;

        beforeEach(() => {
            service = {
                handleParallelOrderRetrieval: jasmine.createSpy('handleParallelOrderRetrieval').and.returnValue(Promise.resolve('parallel')),
                RetrieveOrderService: {
                    retrieveOrderPost: jasmine.createSpy('retrieveOrderPost').and.returnValue(Promise.resolve('post'))
                },
                LoadingSpinnerService: { hide: jasmine.createSpy('hide') }
            };

            resolveSpy = jasmine.createSpy('resolve');
            rejectSpy = jasmine.createSpy('reject');
        });

        const handleRetrievalFlow = (pnr, surname, resolve, reject) => {
            const url = new URL(window.location.href);
            const flowBob = url.searchParams.get('flowBob');
            if (!flowBob) {
                service.handleParallelOrderRetrieval(pnr, surname).then(resolve).catch(reject);
            } else {
                service.RetrieveOrderService.retrieveOrderPost(surname, pnr).then(resolve).catch(reject);
            }
        };

        it('should call handleParallelOrderRetrieval if flowBob is missing', (done) => {
            spyOn(window, 'URL').and.returnValue({ searchParams: { get: () => null } } as any);

            handleRetrievalFlow('PNR123', 'Smith', (result) => {
                expect(service.handleParallelOrderRetrieval).toHaveBeenCalledWith('PNR123', 'Smith');
                expect(result).toBe('parallel');
                done();
            }, rejectSpy);
        });

        it('should call retrieveOrderPost if flowBob exists', (done) => {
            spyOn(window, 'URL').and.returnValue({ searchParams: { get: () => 'true' } } as any);

            handleRetrievalFlow('PNR123', 'Smith', (result) => {
                expect(service.RetrieveOrderService.retrieveOrderPost).toHaveBeenCalledWith('Smith', 'PNR123');
                expect(result).toBe('post');
                done();
            }, rejectSpy);
        });
    });

	describe('When transformCashPriceInfo() is called', () => {
        it('Should save the data in localStorageService', (done) => {
            spyOn(localStorageService, 'set');
            let mockCashPricesInfo = [{ 'amount': 10, 'currency': 'EUR' }];
            let mockCurrenciesList = [{ 'code': 'EUR' }]
            BookingSearchService.transformCashPriceInfo(mockCashPricesInfo, mockCurrenciesList);
            expect(localStorageService.set).toHaveBeenCalled();
            done();
        });
    });
});