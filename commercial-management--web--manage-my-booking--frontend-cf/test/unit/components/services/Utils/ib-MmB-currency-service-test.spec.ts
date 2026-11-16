describe('CurrencyService Test', () => {
    let rootScope, MmBCurrencyService, localStorageService;

    let fakeFilter = jasmine.createSpy('$filter').and.callFake((filter) => {
        var filterFunc = () => {
            return [];
        };
        switch (filter) {
            case 'currency':
                filterFunc = function (label) {
                    return label;
                } as any;
                break;
            default:
                break;
        }

        return filterFunc;
    })

    beforeEach(() => {
        angular.mock.module('ib-MmB-services-module', 'LocalStorageModule', ($provide) => {
            $provide.value('$filter', fakeFilter);
        });
        inject((_MmBCurrencyService_, $rootScope, _localStorageService_) => {
            MmBCurrencyService = _MmBCurrencyService_;
            rootScope = $rootScope;
            localStorageService = _localStorageService_;
        });

        localStorageService.set('commercialData', null)
    });

    describe('when formatPrice method called', () => {
        it('and commercialData.roundingPolicy is null and first parameter is string', (done) => {
            localStorageService.set('commercialData', {roundingPolicy: null, currency: {description: 'EUR', decimals: 2, symbol: '€'} })
            let response = MmBCurrencyService.formatPrice('test', 30, true, true, true);
            expect(response).toEqual(30);
            rootScope.$digest();
            done();
        });
        it('and commercialData.roundingPolicy is null', (done) => {
            localStorageService.set('commercialData', {roundingPolicy: null, currency: 'EUR'})
            let response =MmBCurrencyService.formatPrice({alignment: 'L'}, 0, true, true, true);
            expect(response).toEqual(0);
            rootScope.$digest();
            done();
        });
        it('and commercialData is ROUND_UP', (done) => {
            localStorageService.set('commercialData', {roundingPolicy: 'ROUND_UP', currency: 'EUR'})
            let response = MmBCurrencyService.formatPrice({}, 30, true, true, true);
            expect(response).toEqual(30);
            rootScope.$digest();
            done();
        });
        it('and commercialData is null', (done) => {
            localStorageService.set('commercialData', null)
            let response = MmBCurrencyService.formatPrice({}, 30, true, true);
            expect(response).toEqual(30);
            rootScope.$digest();
            done();
        });
    });

    describe('when formatPriceWithoutSimbol method called', () => {
        it('and commercialData is ROUND_UP', (done) => {
            localStorageService.set('commercialData', {roundingPolicy: 'ROUND_UP'})
            let response = MmBCurrencyService.formatPriceWithoutSimbol({}, 0, true, true);
            expect(response).toEqual(0);
            rootScope.$digest();
            done();
        });
        it('and commercialData.roundingPolicy is HALF_ROUND_DOWN', (done) => {
            localStorageService.set('commercialData', {roundingPolicy: 'HALF_ROUND_DOWN'})
            let response = MmBCurrencyService.formatPriceWithoutSimbol({}, 30, true, true);
            expect(response).toEqual(30);
            rootScope.$digest();
            done();
        });
         it('and commercialData is null', (done) => {
            localStorageService.set('commercialData', null)
            let response = MmBCurrencyService.formatPriceWithoutSimbol({}, 30, true, true);
            expect(response).toEqual(30);
            rootScope.$digest();
            done();
        });
    });



    describe('when formatAvios method called', () => {
        it('and commercialData.roundingPolicy is null', (done) => {
            let response = MmBCurrencyService.formatAvios('-', '10');
            expect(response).toEqual(10);
            rootScope.$digest();
            done();
        });
    });

    describe('when getCurrenciesAsMap method called', () => {
        it('and commercialData.roundingPolicy is null', (done) => {
            let response = MmBCurrencyService.getCurrenciesAsMap([{
                alignment: 'R',
                suffixSymbol: true,
                decimalSeparator: ',',
                numberDecimals: 2,
                groupingSeparator: '.',
                currencySymbol: '',
                description: ''}]
            );
            expect(response).toEqual({undefined: {alignment: 'R', suffixSymbol: true, decimalSeparator: ',', numberDecimals: 2, groupingSeparator: '.', currencySymbol: '', description: ''}});
            rootScope.$digest();
            done();
        });
    });
});
