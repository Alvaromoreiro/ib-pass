import dayjs from 'dayjs';

'use strict';
jasmine.getEnv().allowRespy(true);
describe('test for module ib-datepicker-module - controllers', () => {

    beforeEach(() => {
        module('ib-web-menus-module');
    });

    describe('test for ibDatepickerController', () => {

        let ibDatepickerController;
        let $controller;
        let $rootScope;
        let $scope;
        let $injector;

        beforeEach(() => {
            inject((_$controller_, _$injector_) => {
                $controller = _$controller_;
                $injector = Object.keys(_$injector_).reduce((clone, key) => {
                    clone[key] = _$injector_[key];
                    return clone;
                } , {});
                $rootScope = $injector.get('$rootScope');
                $scope = $rootScope.$new();
                ibDatepickerController = $controller('ibDatepickerController', {$scope:$scope});
            });
        });

        it('ibDatepickerController should be defined', () => {

            expect(ibDatepickerController).toBeDefined();
        });

        it('ibDatepickerController init', () => {
            const day = dayjs().date();
            const month = dayjs.months()[dayjs().month()];
            const year = dayjs().year();
            const todayDate = day + ' de ' + month + ', ' + year;
            expect(ibDatepickerController.todayDate).toBe(todayDate);
        });
    });
});