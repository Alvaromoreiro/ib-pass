'use strict';
jasmine.getEnv().allowRespy(true);
describe('test for module ib-trips-module - controllers', function() {

    beforeEach(function() {
        module('ib-trips-module');
    });

    describe('test for TripsController', function() {

        var TripsController;
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
                TripsController = $controller('TripsController');
            });
        });

        it('TripsController should be defined', function() {

            expect(TripsController).toBeDefined();
        });

    });
});