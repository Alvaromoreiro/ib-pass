// @ts-nocheck
'use strict';
jasmine.getEnv().allowRespy(true);
describe('test for module ib-newMain-header-module - controllers', function() {

    beforeEach(function() {
        module('ib-web-menus-module', 'ib-commons-utils-module', function($provide) {
        });
    });

    describe('test for NewMainHeaderController', function() {

        var NewMainHeaderController;
        var $controller;
        var $rootScope;
        var $scope;
        var NewMainHeaderService;
        var NewMainHeaderFacade;
        var localStorageService;
        var ibBasketTransformer;
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
                NewMainHeaderService = $injector.get('NewMainHeaderService');
                NewMainHeaderFacade = $injector.get('NewMainHeaderFacade');
                localStorageService = $injector.get('localStorageService');
                ibBasketTransformer = $injector.get('ibBasketTransformer');
                
                spyOn(NewMainHeaderFacade, 'setAPIFunctions');
                NewMainHeaderController = $controller('NewMainHeaderController', {NewMainHeaderService:NewMainHeaderService, NewMainHeaderFacade:NewMainHeaderFacade, localStorageService:localStorageService, ibBasketTransformer:ibBasketTransformer});
            });
        });

        it('NewMainHeaderController should be defined', function() {

            expect(NewMainHeaderController).toBeDefined();
        });

    });
});