// @ts-nocheck
'use strict';
jasmine.getEnv().allowRespy(true);
describe('test for module ib-basket-section - factories', function() {

    beforeEach(function() {
        module('ib-web-menus-module', 'ib-commons-utils-module');
    });

    describe('test for ibBasketSectionTransformer', function() {

        var ibBasketSectionTransformer;
        var localStorageService;
        var CurrencyService;
        var NewMainHeaderConstants;
        var $filter;
        var $injector;

        beforeEach(function() {
            inject(function(_$injector_) {
                $injector = Object.keys(_$injector_).reduce(function (clone, key) {
                    clone[key] = _$injector_[key]; 
                    return clone
                } , {});
                localStorageService = $injector.get('localStorageService');
                CurrencyService = $injector.get('CurrencyService');
                NewMainHeaderConstants = $injector.get('NewMainHeaderConstants');
                $filter = $injector.get('$filter');
                ibBasketSectionTransformer = $injector.get('ibBasketSectionTransformer');
            });
        });

        it('ibBasketSectionTransformer should be defined', function() {

            expect(ibBasketSectionTransformer).toBeDefined();
        });

    });
});