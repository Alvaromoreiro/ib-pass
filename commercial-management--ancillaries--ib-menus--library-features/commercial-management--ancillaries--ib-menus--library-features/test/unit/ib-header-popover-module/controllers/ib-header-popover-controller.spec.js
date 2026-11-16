// @ts-nocheck
'use strict';
jasmine.getEnv().allowRespy(true);
describe('test for module ib-header-popover-module - controllers', function() {

    beforeEach(function() {
        module('ib-header-popover-module');
    });

    describe('test for ibHeaderPopoverController', function() {

        var ibHeaderPopoverController;
        var $controller;
        var $rootScope;
        var $scope;
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
                ibHeaderPopoverController = $controller('ibHeaderPopoverController', {$scope:$scope});
            });
        });

        it('ibHeaderPopoverController should be defined', function() {

            expect(ibHeaderPopoverController).toBeDefined();
        });

    });
});