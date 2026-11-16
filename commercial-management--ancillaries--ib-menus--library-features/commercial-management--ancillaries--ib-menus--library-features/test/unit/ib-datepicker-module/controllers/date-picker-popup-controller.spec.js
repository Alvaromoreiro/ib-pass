// @ts-nocheck
'use strict';
jasmine.getEnv().allowRespy(true);
describe('test for module ib-datepicker-module - controllers', function() {

    beforeEach(function() {
        module('ib-web-menus-module');
    });

    describe('test for DatePickerPopupController', function() {

        var DatePickerPopupController;
        var $controller;
        var $rootScope;
        var $scope;
        var $filter;
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
                $filter = $injector.get('$filter');
                DatePickerPopupController = $controller('DatePickerPopupController', {$filter:$filter});
            });
        });

        it('DatePickerPopupController should be defined', function() {

            expect(DatePickerPopupController).toBeDefined();
        });

    });
});