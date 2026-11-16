// @ts-nocheck
'use strict';
jasmine.getEnv().allowRespy(true);
describe('test for module ib-tooltip-module - controllers', function() {

    beforeEach(function() {
        module('ib-tooltip-module');
    });

    describe('test for TooltipController', function() {

        var TooltipController;
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
                TooltipController = $controller('TooltipController');
            });
        });

        it('TooltipController should be defined', function() {

            expect(TooltipController).toBeDefined();
        });

    });
});