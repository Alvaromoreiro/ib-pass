describe('MMB confirmation transformer test', () => {

    let PmtMmbConfirmationTransformer, rootScope;

    const co2FootprintAncillary = {
        kilosCo2Equivalent: 52.6,
        price: 1.08,
        status: {
            code: 'AVAILABLE',
            reason: null
        },
        type: 'CO2_FOOTPRINT'
    };

    const fakeLocalStorageService = {
        get: jasmine.createSpy().and.callFake((key: string) => {
            if (key === 'ancillariesInfo') {
                return {
                    currencies: [
                        {
                            code: 'EUR',
                            description: 'Euro',
                            symbol: '€',
                            alignment: 'R',
                            groupingSeparator: ',',
                            decimalSeparator: '.',
                            decimals: 2,
                            recommendedDisplay: 'symbol'
                        }
                    ],
                    ancillaries: [
                        co2FootprintAncillary
                    ]
                };
            }
            return null;
        }),
        set: jasmine.createSpy().and.callFake(()=>{return null;})
    };

    const fakePmtConstants = {
        ANCILLARIES_TYPES: {
            CO2_FOOTPRINT: 'CO2_FOOTPRINT'
        },
        GENERAL_STATUS: {
            AVAILABLE: 'AVAILABLE'
        }
    };

    const fakeCurrencyService = {
        getCurrencyObject: jasmine.createSpy().and.callFake(()=>{return null;}),
        formatPrice: jasmine.createSpy().and.callFake((_, price: number) => `${price}€`)
    };

    beforeEach(() => {
        angular.mock.module('ib-pmt-mmb-confirmation-module', ($provide) => {
            $provide.value('localStorageService', fakeLocalStorageService);
            $provide.value('PmtConstants', fakePmtConstants);
            $provide.value('CurrencyService', fakeCurrencyService);
        });

        inject((_PmtMmbConfirmationTransformer_, $rootScope) => {
            rootScope = $rootScope;
            rootScope.appMarket = 'ES';

            PmtMmbConfirmationTransformer = _PmtMmbConfirmationTransformer_;
        });
    });

    describe('transform co2 confirmation info', () => {
        it('should transform co2 info from ancillaries when it is available', () => {
            expect(PmtMmbConfirmationTransformer.transformCO2InfoConfirmation()).toEqual({
                kilosCo2Equivalent: 52.6,
                kilosCo2EquivalentFormatted: '52,6',
                price: 1.08,
                priceFormatted: '1.08€'
            });
        });

        it('should return null when co2 not available', () => {
            co2FootprintAncillary.status.code = 'NOT_AVAILABLE';

            expect(PmtMmbConfirmationTransformer.transformCO2InfoConfirmation()).toBeNull();
        });

        afterEach(() => {
            co2FootprintAncillary.status.code = 'AVAILABLE';
        });
    });
});