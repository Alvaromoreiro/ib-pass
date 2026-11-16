// @ts-nocheck
'use strict';
jasmine.getEnv().allowRespy(true);
describe('test for module ib-user-tooltip-module - controllers', function () {

    beforeEach(function () {
        module('ib-user-tooltip-module');
    });

    describe('test for UserTooltipController', function () {

        var UserTooltipController;
        var $controller;
        var $rootScope;
        var $scope;
        var $window;
        var $injector;

        beforeEach(function () {
            inject(function (_$controller_, _$injector_) {
                $controller = _$controller_;
                $injector = Object.keys(_$injector_).reduce(function (clone, key) { 
                    clone[key] = _$injector_[key]; 
                    return clone 
                }, {});
                $rootScope = $injector.get('$rootScope');
                $scope = $rootScope.$new();
                $window = $injector.get('$window');
                UserTooltipController = $controller('UserTooltipController', { $window: $window, $rootScope: $rootScope });
            });
        });

        it('UserTooltipController should be defined', function () {

            expect(UserTooltipController).toBeDefined();
        });

    });
});