// @ts-nocheck
'use strict';
jasmine.getEnv().allowRespy(true);
describe('test for module ib-flight-module - controllers', function() {

    beforeEach(function() {
        module('ib-web-menus-module');
    });

    describe('test for FlightController', function() {

        var FlightController;
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
                FlightController = $controller('FlightController', {$rootScope:$rootScope});
            });
        });

        it('FlightController should be defined', function() {

            expect(FlightController).toBeDefined();
        });

    });
});