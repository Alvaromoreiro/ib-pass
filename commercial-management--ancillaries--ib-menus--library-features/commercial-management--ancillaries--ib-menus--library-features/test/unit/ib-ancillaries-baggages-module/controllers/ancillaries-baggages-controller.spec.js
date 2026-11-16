// @ts-nocheck
'use strict';
jasmine.getEnv().allowRespy(true);
describe('test for module ib-ancillaries-baggages-module - controllers', function() {

    beforeEach(function() {
        module('ib-web-menus-module');
    });

    describe('test for AncillariesBaggagesController', function() {

        var AncillariesBaggagesController;
        var $controller;
        var $rootScope;
        var $scope;
        var $window;
        var MenusConstants;
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
                AncillariesBaggagesController = $controller('AncillariesBaggagesController', {$window:$window, $rootScope:$rootScope, MenusConstants:MenusConstants, $scope:$scope});
            });
        });

        it('AncillariesBaggagesController should be defined', function() {

            expect(AncillariesBaggagesController).toBeDefined();
        });

    });
});