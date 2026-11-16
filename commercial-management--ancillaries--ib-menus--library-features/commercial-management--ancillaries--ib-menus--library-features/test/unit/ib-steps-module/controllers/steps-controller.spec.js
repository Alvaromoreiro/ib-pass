// @ts-nocheck
'use strict';
jasmine.getEnv().allowRespy(true);
describe('test for module ib-steps-module - controllers', function() {

    beforeEach(function() {
        module('ib-steps-module');
    });

    describe('test for StepsController', function() {

        var StepsController;
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
                StepsController = $controller('StepsController', {$rootScope:$rootScope});
            });
        });

        it('StepsController should be defined', function() {

            expect(StepsController).toBeDefined();
        });

    });
});