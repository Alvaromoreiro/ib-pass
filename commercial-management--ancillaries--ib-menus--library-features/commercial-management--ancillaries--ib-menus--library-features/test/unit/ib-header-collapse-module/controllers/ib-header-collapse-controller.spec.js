// @ts-nocheck
'use strict';
jasmine.getEnv().allowRespy(true);
describe('test for module ib-header-collapse-module - controllers', function() {

    beforeEach(function() {
        module('ib-web-menus-module');
    });

    describe('test for IbHeaderCollapseController', function() {

        var IbHeaderCollapseController;
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
                IbHeaderCollapseController = $controller('IbHeaderCollapseController', {$rootScope:$rootScope, $window:$window});
            });
        });

        it('IbHeaderCollapseController should be defined', function() {

            expect(IbHeaderCollapseController).toBeDefined();
        });

        it('IbHeaderCollapseController init', function() {

            expect(IbHeaderCollapseController.init).toBe(true);
        });
    });
});