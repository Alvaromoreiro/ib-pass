// @ts-nocheck
'use strict';


jasmine.getEnv().allowRespy(true);
describe('test for module ib-header-module - controllers', function () {

    var BookingIgnoreOrderServiceMock = {
        ignoreOrder: function (){
            
        }
    };

    beforeEach(function () {
        angular.mock.module('ib-commons-modal-service-module');
        angular.mock.module('ib-web-menus-module', 'ui.bootstrap', 'ib-datalayer-module', function ($provide){
            $provide.value('BookingIgnoreOrderService', BookingIgnoreOrderServiceMock);
        });
    });

    describe('test for HeaderController', function () {

        var HeaderController;
        var $controller;
        var $rootScope;
        var $scope;
        var $window;
        var NewMainHeaderConstants;
        var CommonsModalService;
        var DatalayerConstants;
        var $filter;
        var localStorageService;
        var BookingIgnoreOrderService;
        var $injector;

        beforeEach(function () {
            inject(function (_$controller_, _$injector_) {
                $controller = _$controller_;
                $injector = Object.keys(_$injector_).reduce(function (clone, key) {
                    clone[key] = _$injector_[key]; 
                    return clone;
                }, {});
                $rootScope = $injector.get('$rootScope');
                $scope = $rootScope.$new();
                $window = $injector.get('$window');
                NewMainHeaderConstants = $injector.get('NewMainHeaderConstants');
                CommonsModalService = $injector.get('CommonsModalService');
                DatalayerConstants = $injector.get('DatalayerConstants');
                $filter = $injector.get('$filter');
                localStorageService = $injector.get('localStorageService');
                BookingIgnoreOrderService = $injector.get('BookingIgnoreOrderService');
                HeaderController = $controller('HeaderController', {$window:$window, $rootScope:$rootScope, NewMainHeaderConstants:NewMainHeaderConstants, CommonsModalService:CommonsModalService, DatalayerConstants:DatalayerConstants, $filter:$filter, localStorageService:localStorageService, BookingIgnoreOrderService:BookingIgnoreOrderService, $scope:$scope});
            });
        });

        it('HeaderController should be defined', function () {

            expect(HeaderController).toBeDefined();
        });

        describe('showComponentChooseLanguageMobile', () => {
            it('should return false if is not CKI flow', () => {
                const result = HeaderController.showComponentChooseLanguageMobile();

                expect(result).toBe(false);
            });

            it('should return true if is CKI and a valid quadrigam', () => {
                HeaderController.isCKI = true;

                const result = HeaderController.showComponentChooseLanguageMobile();

                expect(result).toBe(true);
            });
        });
    });
});