describe('PmtMethodsService - modelPaymentData sync', () => {
    let pmtMethodsService: any;
    let rootScope: any;
    let $q: any;
    let ancillariesDeferred: any;
    let localStorageStore: Record<string, unknown>;

    const paymentMethodsResponse = {
        data: {
            paymentMethods: [{ type: 'EXTERNAL_CREDITCARD' }],
            currency: 'EUR'
        }
    };

    const ancillariesBreakdown = {
        insuranceAllianzFusion: { total: { total: 120 } }
    };

    const fakePmtConstants = {
        APP_TYPES: {
            BOOKING: 'BBKI',
            MANAGEMYBOOKING_ONHOLD: 'MMBOH',
            MANAGEMYBOOKING_ANCILLARIES: 'MMBANC',
            MANAGEMYBOOKING_BIDS: 'MMBBID',
            MANAGEMYBOOKING_VOLUNTARY_CHANGE: 'MMBVC',
            MANAGEMYBOOKING_UNIFIED: 'MMBUNIF',
            CHECKIN: 'CKI',
            GIFTCARDS: 'GIFTCARDS',
            SUBSCRIPTIONMODELS: 'SUBSCRIPTIONMODELS',
            ONHOLD: 'ONHOLD'
        },
        ENDPOINTS: {
            DEFAULT: {
                paymentMethodsServiceURI: '/pmt-ppm/rs/ppm/v7/'
            }
        }
    };

    const fakePmtMethodsProxy = {
        getPaymentMethods: jasmine.createSpy('getPaymentMethods')
    };

    const fakePmtPaymentScriptsService = {
        getAll: jasmine.createSpy('getAll')
    };

    const fakePmtMethodsTransformer = {
        generateModelPayMethods: jasmine.createSpy('generateModelPayMethods'),
        transformRequiredAdditionalFields: jasmine.createSpy('transformRequiredAdditionalFields')
    };

    const fakePmtUtilsService = {
        getModelWithPaymentInfo: jasmine.createSpy('getModelWithPaymentInfo')
    };

    const fakeCommonsAncillariesService = {
        getAncillarieSummary: jasmine.createSpy('getAncillarieSummary')
    };

    const fakePmtBreakDownUtilsService = {
        transformBreakdownInfo: jasmine.createSpy('transformBreakdownInfo'),
        transformBreakdownUpgradingBid: jasmine.createSpy('transformBreakdownUpgradingBid')
    };

    const fakeLocalStorageService = {
        get: jasmine.createSpy('get'),
        set: jasmine.createSpy('set'),
        remove: jasmine.createSpy('remove')
    };

    const fakeDatalayerUtilsService = {
        generateDatalayerPayments: jasmine.createSpy('generateDatalayerPayments'),
        generateDigitalDataPayments: jasmine.createSpy('generateDigitalDataPayments')
    };

    const setupLocalStorage = (flowApp: string, options: { isShuttleFlow?: boolean; emptySummary?: boolean } = {}) => {
        localStorageStore = {
            flowApp,
            isShuttleFlow: options.isShuttleFlow ?? false,
            pmtModelInfo: { ident: 'order-1' },
            createOrderData: { order: { orderId: 'order-1' } },
            fareData: { fareFamilyConditions: [] },
            countriesList: [],
            prefixList: [],
            statesList: [],
            selectedPaymentData: null,
            selectedAncillariesInfo: []
        };

        fakeLocalStorageService.get.and.callFake((key: string) => localStorageStore[key] ?? null);
        fakeLocalStorageService.set.and.callFake((key: string, value: unknown) => {
            localStorageStore[key] = value;
        });
        fakeLocalStorageService.remove.and.callFake((key: string) => {
            delete localStorageStore[key];
        });

        fakePmtUtilsService.getModelWithPaymentInfo.and.returnValue({
            summaryInfo: options.emptySummary ? {} : { ancillaries: {}, trips: [] },
            paymentInfo: {},
            showPmtHeader: true
        });
    };

    const callGetPaymentMethods = () => {
        pmtMethodsService.defer = null;
        const promise = pmtMethodsService.getPaymentMethods('order-1', 'ES', '/service/');
        rootScope.$digest();
        return promise;
    };

    beforeEach(() => {
        angular.mock.module('ib-pmt-services-http-module', ($provide: angular.auto.IProvideService) => {
            $provide.value('PmtMethodsProxy', fakePmtMethodsProxy);
            $provide.value('PmtConstants', fakePmtConstants);
            $provide.value('PmtUtilsService', fakePmtUtilsService);
            $provide.value('PmtMethodsTransformer', fakePmtMethodsTransformer);
            $provide.value('PmtHttpErrorFilter', { errorHandlerFactory: jasmine.createSpy() });
            $provide.value('CommonsAncillariesService', fakeCommonsAncillariesService);
            $provide.value('PmtBreakDownUtilsService', fakePmtBreakDownUtilsService);
            $provide.value('localStorageService', fakeLocalStorageService);
            $provide.value('PmtPaymentScriptsService', fakePmtPaymentScriptsService);
            $provide.value('DatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('PmtAssFassTransformer', {});
            $provide.value('pmtSummaryGiftCardsService', { getSummary: jasmine.createSpy() });
            $provide.value('pmtSummarySubscriptionModelsService', { getSummary: jasmine.createSpy() });
            $provide.value('CurrencyService', { getCurrencyObject: jasmine.createSpy().and.returnValue({}) });
        });

        inject((_PmtMethodsService_: any, $rootScope: any, _$q_: any) => {
            pmtMethodsService = _PmtMethodsService_;
            rootScope = $rootScope;
            $q = _$q_;

            ancillariesDeferred = null;
            fakePmtMethodsProxy.getPaymentMethods.calls.reset();
            fakePmtPaymentScriptsService.getAll.calls.reset();
            fakeCommonsAncillariesService.getAncillarieSummary.calls.reset();
            fakePmtBreakDownUtilsService.transformBreakdownInfo.calls.reset();
            fakeLocalStorageService.set.calls.reset();
            fakeLocalStorageService.remove.calls.reset();
            fakePmtMethodsProxy.getPaymentMethods.and.callFake(() => $q.resolve(paymentMethodsResponse));
            fakePmtPaymentScriptsService.getAll.and.callFake(() => $q.resolve([]));
            fakePmtMethodsTransformer.generateModelPayMethods.and.returnValue({
                paymentId: 'payment-1',
                paymentMethods: [{ type: 'EXTERNAL_CREDITCARD' }],
                currency: { code: 'EUR' }
            });
            fakeCommonsAncillariesService.getAncillarieSummary.and.callFake(() => {
                ancillariesDeferred = $q.defer();
                return ancillariesDeferred.promise;
            });
            fakePmtBreakDownUtilsService.transformBreakdownInfo.and.returnValue(ancillariesBreakdown);
            fakePmtBreakDownUtilsService.transformBreakdownUpgradingBid.and.returnValue(ancillariesBreakdown);
        });
    });

    describe('BKI flow', () => {
        beforeEach(() => {
            setupLocalStorage(fakePmtConstants.APP_TYPES.BOOKING);
        });

        it('should not sync modelPaymentData before ancillaries summary resolves', () => {
            callGetPaymentMethods();

            expect(fakeCommonsAncillariesService.getAncillarieSummary).toHaveBeenCalled();
            expect(localStorageStore.modelPaymentData).toBeUndefined();
        });

        it('should sync transformed modelPaymentData when ancillaries summary resolves', () => {
            callGetPaymentMethods();

            ancillariesDeferred.resolve({ pendingPaymentItems: [] });
            rootScope.$digest();

            expect(fakePmtBreakDownUtilsService.transformBreakdownInfo).toHaveBeenCalled();
            expect(localStorageStore.modelPaymentData).toEqual(jasmine.objectContaining({
                summaryInfo: jasmine.objectContaining({
                    ancillaries: ancillariesBreakdown
                })
            }));
            expect(fakeLocalStorageService.remove).toHaveBeenCalledWith('ancillariesPendingBKIFlow');
        });

        it('should resolve getPaymentMethods before ancillaries summary completes', (done) => {
            const promise = callGetPaymentMethods();

            promise.then((model: { summaryInfo: { ancillaries: unknown } }) => {
                expect(model.summaryInfo.ancillaries).toEqual({});
                done();
            });

            rootScope.$digest();
        });

        it('should not call getAncillarieSummary on shuttle flow', () => {
            setupLocalStorage(fakePmtConstants.APP_TYPES.BOOKING, { isShuttleFlow: true });

            callGetPaymentMethods();

            expect(fakeCommonsAncillariesService.getAncillarieSummary).not.toHaveBeenCalled();
        });
    });

    describe('CKI flow with empty summary', () => {
        beforeEach(() => {
            setupLocalStorage(fakePmtConstants.APP_TYPES.CHECKIN, { emptySummary: true });
        });

        it('should sync modelPaymentData when ancillaries summary resolves', () => {
            callGetPaymentMethods();

            ancillariesDeferred.resolve({ pendingPaymentItems: [] });
            rootScope.$digest();

            expect(localStorageStore.modelPaymentData).toEqual(jasmine.objectContaining({
                summaryInfo: jasmine.objectContaining({
                    ancillaries: ancillariesBreakdown
                }),
                breakdownInfo: true,
                showQuotas: true,
                showPmtHeader: false
            }));
        });
    });

    describe('MMB ancillaries flow', () => {
        beforeEach(() => {
            setupLocalStorage(fakePmtConstants.APP_TYPES.MANAGEMYBOOKING_ANCILLARIES);
        });

        it('should sync modelPaymentData when ancillaries summary resolves', () => {
            callGetPaymentMethods();

            ancillariesDeferred.resolve({ pendingPaymentItems: [] });
            rootScope.$digest();

            expect(localStorageStore.modelPaymentData).toEqual(jasmine.objectContaining({
                summaryInfo: jasmine.objectContaining({
                    ancillaries: ancillariesBreakdown
                }),
                breakdownInfo: true,
                showQuotas: true,
                showPmtHeader: false
            }));
        });
    });
});

describe('PmtMethodsService - init error handling', () => {
    let pmtMethodsService: any;
    let rootScope: any;
    let $q: any;
    let handlePaymentInitDataErrorSpy: jasmine.Spy;

    const fakePmtConstants = {
        ENDPOINTS: {
            DEFAULT: {
                paymentMethodsServiceURI: '/pmt-ppm/rs/ppm/v7/',
                paymentMethodsAdditionalFieldsServiceURI: '/pmt-ppm/rs/ppm/v7/'
            }
        }
    };

    const fakePmtMethodsProxy = {
        getPaymentMethods: jasmine.createSpy('getPaymentMethods'),
        getPaymentAdditionalFields: jasmine.createSpy('getPaymentAdditionalFields')
    };

    beforeEach(() => {
        handlePaymentInitDataErrorSpy = jasmine.createSpy('handlePaymentInitDataError').and.returnValue(true);

        angular.mock.module('ib-pmt-services-http-module', ($provide: angular.auto.IProvideService) => {
            $provide.value('PmtMethodsProxy', fakePmtMethodsProxy);
            $provide.value('PmtConstants', fakePmtConstants);
            $provide.value('PmtUtilsService', {
                getModelWithPaymentInfo: jasmine.createSpy('getModelWithPaymentInfo')
            });
            $provide.value('PmtMethodsTransformer', {
                generateModelPayMethods: jasmine.createSpy('generateModelPayMethods'),
                transformRequiredAdditionalFields: jasmine.createSpy('transformRequiredAdditionalFields')
            });
            $provide.value('PmtHttpErrorFilter', {
                handlePaymentInitDataError: handlePaymentInitDataErrorSpy,
                errorHandlerFactory: jasmine.createSpy('errorHandlerFactory')
            });
            $provide.value('CommonsAncillariesService', { getAncillarieSummary: jasmine.createSpy() });
            $provide.value('PmtBreakDownUtilsService', {});
            $provide.value('localStorageService', {
                get: jasmine.createSpy('get').and.returnValue(null),
                set: jasmine.createSpy('set'),
                remove: jasmine.createSpy('remove')
            });
            $provide.value('PmtPaymentScriptsService', { getAll: jasmine.createSpy('getAll') });
            $provide.value('DatalayerUtilsService', {});
            $provide.value('PmtAssFassTransformer', {});
            $provide.value('pmtSummaryGiftCardsService', { getSummary: jasmine.createSpy() });
            $provide.value('pmtSummarySubscriptionModelsService', { getSummary: jasmine.createSpy() });
            $provide.value('CurrencyService', { getCurrencyObject: jasmine.createSpy().and.returnValue({}) });
        });

        inject((_PmtMethodsService_: any, $rootScope: any, _$q_: any) => {
            pmtMethodsService = _PmtMethodsService_;
            rootScope = $rootScope;
            $q = _$q_;
        });
    });

    it('getPaymentMethods should route errors through handlePaymentInitDataError', (done) => {
        fakePmtMethodsProxy.getPaymentMethods.and.returnValue($q.reject({
            errorCode: 449,
            data: { errors: [{ reason: 'error', code: 'TEST' }] }
        }));

        pmtMethodsService.getPaymentMethods('order-1', 'ES', '/service/').catch(() => {
            expect(handlePaymentInitDataErrorSpy).toHaveBeenCalledWith(449, jasmine.objectContaining({
                url: jasmine.stringMatching(/payment-methods/)
            }));
            done();
        });

        rootScope.$digest();
    });

    it('getPaymentAdditionalFields should route errors through handlePaymentInitDataError', (done) => {
        fakePmtMethodsProxy.getPaymentAdditionalFields.and.returnValue($q.reject({
            errorCode: 400,
            data: { errors: [{ reason: 'error', code: 'TEST' }] }
        }));

        pmtMethodsService.getPaymentAdditionalFields('order-1', 'payment-1', 'IBERIA_PAY', null, '/service/').catch(() => {
            expect(handlePaymentInitDataErrorSpy).toHaveBeenCalledWith(400, jasmine.objectContaining({
                url: jasmine.stringMatching(/additional-fields/)
            }));
            done();
        });

        rootScope.$digest();
    });
});
