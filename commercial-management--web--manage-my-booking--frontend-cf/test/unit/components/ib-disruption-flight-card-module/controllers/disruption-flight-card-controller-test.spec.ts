'use strict';
jasmine.getEnv().allowRespy(true);
describe('test for module ib-disruption-flight-card-module - controllers', function () {

    beforeEach(function () {
        angular.mock.module('ib-disruption-flight-card-module');

        angular.mock.module('LocalStorageModule');
    });

    describe('test for DisruptionFlightCardController', function () {

        var DisruptionFlightCardController;
        var $controller;
        var DisruptionFlightCardModel;
        var $injector;
        var $rootScope;
        var $scope;
        var localStorageService;

        beforeEach(function () {
            inject(function (_$controller_, _$injector_, _localStorageService_) {
                $controller = _$controller_;
                localStorageService = _localStorageService_;
                $injector = Object.keys(_$injector_).reduce(function (clone, key) {
                    clone[key] = _$injector_[key];
                    return clone
                }, {});
                $rootScope = $injector.get('$rootScope');
                $scope = $rootScope.$new();
                DisruptionFlightCardController = $controller('DisruptionFlightCardController', { $scope: $scope, DisruptionFlightCardModel: DisruptionFlightCardModel });
            });
        });

        it('DisruptionFlightCardController should be defined', function () {

            expect(DisruptionFlightCardController).toBeDefined();
        });


        it('test for DisruptionFlightCardController.$onInit', function () {
            localStorageService.set('downgradeCodes', ['SSE_ORM_9429'])
            DisruptionFlightCardController.data = { hasMissconnection: true };
            DisruptionFlightCardController.$onInit();

            expect(DisruptionFlightCardController.$onInit).toBeDefined();
        });
    });
});