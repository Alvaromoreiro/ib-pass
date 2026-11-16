// @ts-nocheck
'use strict';
jasmine.getEnv().allowRespy(true);
describe('test for module ib-basket-module - controllers', function() {

    beforeEach(function() {
        module('ib-web-menus-module', 'ui.bootstrap', 'ib-commons-utils-module', 'ib-datalayer-module', 'ib-commons-constants-module');
    });

    describe('test for BasketController', function() {

        var BasketController;
        var $controller;
        var $rootScope;
        var $scope;
        var $window;
        var MenusConstants;
        var localStorageService;
        var $timeout;
        var CurrencyService;
        var CommonsModalService;
        var CommonsDeleteAncillariesService;
        var $controller;
        var ShoppingBasketViewModel;
        var $injector;

        beforeEach(function() {
            inject(function(_$controller_, _$injector_) {
                $controller = _$controller_;
                $injector = Object.keys(_$injector_).reduce(function (clone, key) {
                    clone[key] = _$injector_[key]; 
                    return clone
                } , {});
                $rootScope = $injector.get('$rootScope');
                $scope = $rootScope.$new();
                $window = $injector.get('$window');
                MenusConstants = $injector.get('MenusConstants');
                localStorageService = $injector.get('localStorageService');
                $timeout = $injector.get('$timeout');
                CurrencyService = $injector.get('CurrencyService');
                CommonsModalService = $injector.get('CommonsModalService');
                CommonsDeleteAncillariesService = $injector.get('CommonsDeleteAncillariesService');
                $controller = $injector.get('$controller');
                ShoppingBasketViewModel = $injector.get('ShoppingBasketViewModel');
                BasketController = $controller('BasketController', {$window:$window, $rootScope:$rootScope, CurrencyService:CurrencyService, $scope:$scope, MenusConstants:MenusConstants, localStorageService:localStorageService, $timeout:$timeout, CommonsModalService:CommonsModalService, CommonsDeleteAncillariesService:CommonsDeleteAncillariesService, $controller:$controller, ShoppingBasketViewModel:ShoppingBasketViewModel});
            });
        });

        it('BasketController should be defined', function() {

            expect(BasketController).toBeDefined();
        });
        
    });
});