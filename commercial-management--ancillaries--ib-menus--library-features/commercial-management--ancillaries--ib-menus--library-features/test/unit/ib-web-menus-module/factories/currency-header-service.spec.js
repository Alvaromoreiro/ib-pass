// @ts-nocheck
'use strict';
jasmine.getEnv().allowRespy(true);
describe('test for module ib-web-menus-module - factories', function() {

    beforeEach(function() {
        module('ib-web-menus-module', 'ib-commons-utils-module');
    });

    describe('test for CurrencyService', function() {

        var CurrencyService;
        var $filter;
        var $injector;

        beforeEach(function() {
            inject(function(_$injector_) {
                $injector = Object.keys(_$injector_).reduce(function (clone, key) {
                    clone[key] = _$injector_[key]; 
                    return clone
                } , {});
                $filter = $injector.get('$filter');
                CurrencyService = $injector.get('CurrencyService');
            });
        });

        it('CurrencyService should be defined', function() {

            expect(CurrencyService).toBeDefined();
        });


        it('test for CurrencyService.formatPrice', function() {

            var currencyData = {
                suffixSymbol: true,
                decimalSeparator: ',',
                code: 'EUR',
                numberDecimals: 2,
                groupingSeparator: '.',
                currencySymbol: '€',
                description: 'Euro',
                symbol: '€',
                recommendedDisplay: 'symbol'
            };
            var ret = CurrencyService.formatPrice(currencyData,0,true);

            expect(ret).toBe('€0');
        });
    });
});