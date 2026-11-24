import angular from 'angular';

describe('Test of PmtTotalPriceController (ib-pmt-total-price-module)', () => {
    let totalPriceCtrl: any;
    let rootScope: any;
    let fakeFlowApp: string = 'BBKI';
    let fakeUserLogged: boolean = false;
    let fakeHeaderModel: any = { greyBarModel: { isONB: false } };
    let fakeTotalAviosAmount: any = null;
    let fakeConfirmationDigitalInfo: any = { UserLevel: 'gOlD' };
    let fakeCurrency: any = { groupingSeparator: ',' };

    const fakeLocalStorageService = {
        get: jasmine.createSpy('get').and.callFake((key: string) => {
            switch (key) {
                    case 'getMarketOBPoints': return null;
                    case 'CalculatedPoints': return null;
                    case 'userLogged': return fakeUserLogged;
                    case 'changeFlightAvios': return null;
                    case 'flowApp': return fakeFlowApp;
                    case 'totalAviosAmount': return fakeTotalAviosAmount;
                    case 'numberFreeUpgrade': return 0;
                    case 'confirmationDigitalInfo': return fakeConfirmationDigitalInfo;
                    case 'headerModel': return fakeHeaderModel;
                    case 'currency': return fakeCurrency;
                    default: return null;
            }
        }),
        set: jasmine.createSpy('set')
    };

    const fakeTemplateCache = {
        get: jasmine.createSpy('get').and.returnValue(null),
        put: jasmine.createSpy('put')
    };

    const fakeCommonsUserUtilsService = {
        isIbZero: jasmine.createSpy('isIbZero').and.returnValue(false)
    };

    const fakeCurrencyService = {
        formatAvios: jasmine.createSpy('formatAvios').and.callFake((sep: string, amount: any) => {
            return `formatted(${sep})-${amount}`;
        })
    };

    const fakeIbPriceDetailModalService = {
        openPriceDetailModal: jasmine.createSpy('openPriceDetailModal'),
        shouldShowCTA: jasmine.createSpy('shouldShowCTA').and.callFake((flowApp: string) => {
            return ['BBKI', 'MMBOH', 'BBKIOH'].includes(flowApp);
        })
    };
    const fakePmtModalService = { showGenericModal: jasmine.createSpy('showGenericModal') };
    const fakeButtonFactoryService = {
        generateBizumButton: jasmine.createSpy('generateBizumButton'),
        generateNemuruButton: jasmine.createSpy('generateNemuruButton'),
        generateMercadoPagoButton: jasmine.createSpy('generateMercadoPagoButton'),
        generateDefaultButton: jasmine.createSpy('generateDefaultButton')
    };
    const fakeRedirectionService = { newNavigation: jasmine.createSpy('newNavigation') };
    const fakeFilter = jasmine.createSpy('$filter').and.returnValue(() => '');
    const fakeTelephoneService = { submitForm: jasmine.createSpy('submitForm') };
    const fakeUpgradingUtilService = { getSummaryText: jasmine.createSpy('getSummaryText') };
    const fakeDccService = {};
    const fakeIbCModalService = { showGenericComponentModal: jasmine.createSpy('showGenericComponentModal') };
    const fakeDatalayerUtilsService = { updateDatalayerEvent: jasmine.createSpy('updateDatalayerEvent') };
    const fakePmtConstants = {
        LOGIN_ONB: {},
        APP_TYPES: {
            BOOKING: 'BBKI',
            MANAGEMYBOOKING_ONHOLD: 'MMBOH',
            ONHOLD: 'BBKIOH',
            MANAGEMYBOOKING_BIDS: 'MMBBID'
        },
        IDEAL_BANK_LIST: { PRODUCTION: [], TEST: [] }
    };

    beforeEach(() => {
        fakeFlowApp = 'BBKI';
        fakeUserLogged = false;
        fakeHeaderModel = { greyBarModel: { isONB: false } };
        fakeTotalAviosAmount = null;
        fakeConfirmationDigitalInfo = { UserLevel: 'gOlD' };

        angular.mock.module('ib-pmt-module', ($provide: any) => {
            $provide.value('localStorageService', fakeLocalStorageService);
            $provide.value('$templateCache', fakeTemplateCache);
            $provide.value('CommonsUserUtilsService', fakeCommonsUserUtilsService);
            $provide.value('CurrencyService', fakeCurrencyService);
            $provide.value('$sce', {});
            $provide.value('PmtModalService', fakePmtModalService);
            $provide.value('ButtonFactoryService', fakeButtonFactoryService);
            $provide.value('RedirectionService', fakeRedirectionService);
            $provide.value('$filter', fakeFilter);
            $provide.value('ibPmtTelephoneService', fakeTelephoneService);
            $provide.value('UpgradingUtilService', fakeUpgradingUtilService);
            $provide.value('DccService', fakeDccService);
            $provide.value('IbCModalService', fakeIbCModalService);
            $provide.value('DatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('IbPriceDetailModalService', fakeIbPriceDetailModalService);
            $provide.constant('PmtConstants', fakePmtConstants);

        });

        inject(($controller: any, $rootScope: any) => {
            rootScope = $rootScope.$new();
            rootScope.production = false;
            rootScope.isMobile = { general: false };

            totalPriceCtrl = $controller(
                'PmtTotalPriceController',
                {
                    $scope: rootScope.$new(),
                    $rootScope: rootScope
                },
                {}
            );
            $rootScope.$apply();
        });
    });

    it('should be defined', () => {
        expect(totalPriceCtrl).toBeDefined();
    });

    describe('shouldShowPriceDetailsCTA', () => {
        [
            { flowApp: 'BBKI', expected: true },
            { flowApp: 'MMBOH', expected: true },
            { flowApp: 'BBKIOH', expected: true },
            { flowApp: 'PAOB', expected: false },
            { flowApp: 'MMBBID', expected: false }
        ].forEach(({ flowApp, expected }) => {
            it(`should ${expected ? '' : 'not '}show price details for ${flowApp}`, () => {
                fakeFlowApp = flowApp;
                fakeIbPriceDetailModalService.shouldShowCTA.calls.reset();

                inject(($controller: any, $rootScope: any) => {
                    const scope = $rootScope.$new();
                    totalPriceCtrl = $controller(
                        'PmtTotalPriceController',
                        {
                            $scope: scope,
                            $rootScope: scope
                        },
                        {}
                    );
                    $rootScope.$apply();
                });

                expect(fakeIbPriceDetailModalService.shouldShowCTA).toHaveBeenCalledWith(flowApp);
                expect(totalPriceCtrl.shouldShowPriceDetailsCTA).toBe(expected);
            });
        });
    });

    describe('setValuesInLoyaltyUpgradeFlow', () => {
        const header = (isONB: boolean) => ({ greyBarModel: { isONB } });
        let APP_TYPES: any;

        beforeEach(inject((PmtConstants: any) => {
            APP_TYPES = PmtConstants.APP_TYPES;
            totalPriceCtrl.tierIB = undefined;
        }));

        it('should early return when MANAGEMYBOOKING_BIDS and NOT loyalty flow (userLogged=false)', () => {
            totalPriceCtrl.flowApp = APP_TYPES.MANAGEMYBOOKING_BIDS;
            totalPriceCtrl.confirmationDigitalInfo = { UserLevel: 'pLaTiNuM' };
            totalPriceCtrl.totalAviosAmount = 100;
            spyOn(totalPriceCtrl as any, 'setAviosAmount').and.stub();

            (totalPriceCtrl as any).setValuesInLoyaltyUpgradeFlow.call(totalPriceCtrl, false, header(false));

            expect(totalPriceCtrl.tierIB).toBeUndefined();
            expect((totalPriceCtrl as any).setAviosAmount).not.toHaveBeenCalled();
        });

        it('should early return when flow is BOOKING (BBKI) and NOT loyalty flow (isONB=true)', () => {
            totalPriceCtrl.flowApp = 'BBKI';
            totalPriceCtrl.confirmationDigitalInfo = { UserLevel: 'gOlD' };
            totalPriceCtrl.totalAviosAmount = 100;
            spyOn(totalPriceCtrl as any, 'setAviosAmount').and.stub();

            (totalPriceCtrl as any).setValuesInLoyaltyUpgradeFlow.call(totalPriceCtrl, true, header(true));

            expect(totalPriceCtrl.tierIB).toBeUndefined();
            expect((totalPriceCtrl as any).setAviosAmount).not.toHaveBeenCalled();
        });

        it('should NOT apply logic when loyalty flow (userLogged=true & isONB=false) if flowApp is BOOKING', () => {
            totalPriceCtrl.flowApp = 'BBKI';
            totalPriceCtrl.confirmationDigitalInfo = { UserLevel: 'sIlVeR' };
            totalPriceCtrl.totalAviosAmount = 1;
            spyOn(totalPriceCtrl as any, 'setAviosAmount').and.stub();

            (totalPriceCtrl as any).setValuesInLoyaltyUpgradeFlow.call(totalPriceCtrl, true, header(false));

            expect(totalPriceCtrl.tierIB).toBeUndefined();
            expect((totalPriceCtrl as any).setAviosAmount).not.toHaveBeenCalled();
        });

        it('should NOT call setAviosAmount when totalAviosAmount is null (but still set tierIB)', () => {
            fakeFlowApp = APP_TYPES.MANAGEMYBOOKING_BIDS;
            fakeUserLogged = true;
            fakeTotalAviosAmount = null;
            fakeConfirmationDigitalInfo = { UserLevel: 'gOlD' };
            fakeHeaderModel = header(false);
            spyOn(totalPriceCtrl as any, 'setAviosAmount').and.stub();

            totalPriceCtrl.activate();

            expect(totalPriceCtrl.tierIB).toBe('Gold');
            expect((totalPriceCtrl as any).setAviosAmount).not.toHaveBeenCalled();
        });
    });

    describe('setAviosAmount', () => {

        const expectAviosAmountWasFormattedAndStored = (
            expectedSeparator: string,
            expectedAmount: number,
            expectedFormatted: string,
            options: { expectCurrencyGet?: boolean } = { expectCurrencyGet: true }
        ) => {
            if (options.expectCurrencyGet) {
                expect(fakeLocalStorageService.get).toHaveBeenCalledWith('currency');
            }
            expect(fakeCurrencyService.formatAvios).toHaveBeenCalledWith(expectedSeparator, expectedAmount);
            expect(totalPriceCtrl.totalAviosAmountFormatted).toBe(expectedFormatted);
            expect(fakeLocalStorageService.set).toHaveBeenCalledWith('totalAviosAmountFormatted', expectedFormatted);
        };


        beforeEach(() => {
            fakeCurrencyService.formatAvios.calls.reset();
            fakeLocalStorageService.set.calls.reset();
        });

        it('should use groupingSeparator from currency and persist formatted amount', () => {
            totalPriceCtrl.totalAviosAmount = 123456;
            fakeCurrency = { groupingSeparator: ',' };

            (totalPriceCtrl as any).setAviosAmount();

            expect(fakeLocalStorageService.get).toHaveBeenCalledWith('currency');
            expect(fakeCurrencyService.formatAvios).toHaveBeenCalledWith(',', 123456);
            expect(totalPriceCtrl.totalAviosAmountFormatted).toBe('formatted(,)-123456');
            expect(fakeLocalStorageService.set).toHaveBeenCalledWith(
                'totalAviosAmountFormatted',
                'formatted(,)-123456'
            );
        });

        it('should fallback to "." when currency is null', () => {
            totalPriceCtrl.totalAviosAmount = 1000;
            fakeCurrency = null;

            (totalPriceCtrl as any).setAviosAmount();

            expectAviosAmountWasFormattedAndStored('.', 1000, 'formatted(.)-1000');
        });

        it('should fallback to "." when currency exists but has no groupingSeparator', () => {
            totalPriceCtrl.totalAviosAmount = 2000;
            fakeCurrency = {};

            (totalPriceCtrl as any).setAviosAmount();

            expectAviosAmountWasFormattedAndStored('.', 2000, 'formatted(.)-2000');
        });
    });
});
