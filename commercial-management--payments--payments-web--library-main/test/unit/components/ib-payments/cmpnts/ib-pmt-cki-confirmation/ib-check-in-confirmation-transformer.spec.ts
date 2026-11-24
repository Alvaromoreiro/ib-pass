describe('CKI confirmation transformer test', () => {

    let CheckinConfirmationTransformer, rootScope;

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
        })
    };

    const fakePmtConstants = {
        ANCILLARIES_TYPES: {
            VEHICLE_RENTAL: 'VEHICLE_RENTAL',
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
        angular.mock.module('ib-check-in-confirmation-module', ($provide) => {
            $provide.value('localStorageService', fakeLocalStorageService);
            $provide.value('PmtConstants', fakePmtConstants);
            $provide.value('CurrencyService', fakeCurrencyService);
        });

        inject((_CheckinConfirmationTransformer_, $rootScope) => {
            rootScope = $rootScope;
            rootScope.appMarket = 'ES';

            CheckinConfirmationTransformer = _CheckinConfirmationTransformer_;
        });
    });

    describe('transform co2 confirmation info', () => {
        it('should return transformed co2 info when available', () => {
            expect(CheckinConfirmationTransformer.transformConfirmationInfo({}, []).co2Info).toEqual({
                kilosCo2Equivalent: 52.6,
                kilosCo2EquivalentFormatted: '52,6',
                price: 1.08,
                priceFormatted: '1.08€'
            });
        });

        it('should return null when not available', () => {
            co2FootprintAncillary.status.code = 'NOT_AVAILABLE';

            expect(CheckinConfirmationTransformer.transformConfirmationInfo({}, []).co2Info).toBeNull();
        });

        afterEach(() => {
            co2FootprintAncillary.status.code = 'AVAILABLE';
        });
    });
});