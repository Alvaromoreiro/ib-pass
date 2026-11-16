// @ts-nocheck
'use strict';
jasmine.getEnv().allowRespy(true);
describe('test for module ib-passengers-module - controllers', function() {

    beforeEach(function() {
        module('ib-passengers-module');
    });

    describe('test for PassengersController', function() {

        var PassengersController;
        var $controller;
        var $rootScope;
        var $scope;
        var $window;
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
                PassengersController = $controller('PassengersController', {$window:$window, $rootScope:$rootScope});
            });
        });

        it('PassengersController should be defined', function() {

            expect(PassengersController).toBeDefined();
        });

    });
});