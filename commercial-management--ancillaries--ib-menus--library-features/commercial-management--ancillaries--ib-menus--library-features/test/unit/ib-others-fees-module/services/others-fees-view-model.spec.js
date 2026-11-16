// @ts-nocheck
'use strict';
jasmine.getEnv().allowRespy(true);
describe('test for module ib-others-fees-module - services', function() {

    beforeEach(function() {
        module('ib-web-menus-module', 'ib-commons-utils-module');
    });

    describe('test for OthersFeesViewModel', function() {

        var OthersFeesViewModel;
        var CurrencyService;
        var $injector;

        beforeEach(function() {
            inject(function(_$injector_) {
                $injector = Object.keys(_$injector_).reduce(function (clone, key) {
                    clone[key] = _$injector_[key]; 
                    return clone
                } , {});
                CurrencyService = $injector.get('CurrencyService');
                OthersFeesViewModel = $injector.get('OthersFeesViewModel');
            });
        });

        it('OthersFeesViewModel should be defined', function() {

            expect(OthersFeesViewModel).toBeDefined();
        });


        it('test for OthersFeesViewModel.getOthersViewModel', function() {
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
            var currency = {
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
            spyOn(CurrencyService, 'formatPrice').withArgs(currencyData,0,true).and.returnValue('0,00€ ');
            OthersFeesViewModel.getOthersViewModel(currency);

            expect(OthersFeesViewModel.getOthersViewModel).toBeDefined();
        });

        it('test for OthersFeesViewModel.deleteInfo', function() {

            var othersModel = {
                hasElements: false,
                others: [],
                total: {
                    total: 0,
                    totalFormatted: '0,00€ '
                }
            };
            var currency = {
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
            OthersFeesViewModel.deleteInfo(othersModel,'CARD',currency);

            expect(OthersFeesViewModel.deleteInfo).toBeDefined();
        });

        it('test for OthersFeesViewModel.updateInfo', function() {

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
            var othersModel = {
                hasElements: false,
                others: [],
                total: {
                    total: 0,
                    totalFormatted: '0,00€ '
                }
            };
            var currency = {
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
            spyOn(CurrencyService, 'formatPrice').withArgs(currencyData,0,true).and.returnValue('0,00€ ');
            OthersFeesViewModel.updateInfo(othersModel,currency);

            expect(OthersFeesViewModel.updateInfo).toBeDefined();
        });
    });
});