// @ts-nocheck
'use strict';
jasmine.getEnv().allowRespy(true);
describe('test for module ib-city-selector-component-module - controllers', function () {

    beforeEach(function () {
        module('ib-web-menus-module');
    });

    describe('test for CitySelectorComponentController', function () {

        var CitySelectorComponentController;
        var $controller;
        var $rootScope;
        var $scope;
        var $window;
        var $timeout;
        var CitySelectorConstants;
        var $injector;

        beforeEach(function () {
            inject(function (_$controller_, _$injector_) {
                var array1 = [
                    {
                        name: 'A'
                    },
                    {
                        name: 'B'
                    },
                    {
                        name: 'C'
                    },
                    {
                        name: 'D'
                    },
                    {
                        name: 'E'
                    },
                    {
                        name: 'F'
                    },
                    {
                        name: 'G'
                    },
                    {
                        name: 'H'
                    },
                    {
                        name: 'I'
                    },
                    {
                        name: 'J'
                    },
                    {
                        name: 'K'
                    },
                    {
                        name: 'L'
                    },
                    {
                        name: 'M'
                    },
                    {
                        name: 'N'
                    },
                    {
                        name: 'Ñ'
                    },
                    {
                        name: 'O'
                    },
                    {
                        name: 'P'
                    },
                    {
                        name: 'Q'
                    },
                    {
                        name: 'R'
                    },
                    {
                        name: 'S'
                    },
                    {
                        name: 'T'
                    },
                    {
                        name: 'U'
                    },
                    {
                        name: 'V'
                    },
                    {
                        name: 'W'
                    },
                    {
                        name: 'X'
                    },
                    {
                        name: 'Y'
                    },
                    {
                        name: 'Z'
                    }
                ];
                $controller = _$controller_;
                $injector = Object.keys(_$injector_).reduce(function (clone, key) { 
                    clone[key] = _$injector_[key]; 
                    return clone 
                }, {});
                $rootScope = $injector.get('$rootScope');
                $scope = $rootScope.$new();
                $window = $injector.get('$window');
                $timeout = $injector.get('$timeout');
                CitySelectorConstants = $injector.get('CitySelectorConstants');
                CitySelectorConstants.LEETERS = { 'ALL': 'all' };
                CitySelectorConstants.ALPHABET = array1;
                CitySelectorComponentController = $controller('CitySelectorComponentController', { $window: $window, $timeout: $timeout, $scope: $scope, CitySelectorConstants: CitySelectorConstants });
            });
        });

        it('CitySelectorComponentController should be defined', function () {

            expect(CitySelectorComponentController).toBeDefined();
        });

        it('CitySelectorComponentController init', function () {

            expect(CitySelectorComponentController.letterSelected).toBe('all');
            function resultMatcher1(argument) {
                return {
                    asymmetricMatch: function (result) {
                        var equals = true;
                        equals = equals && result[0].name === 'A';
                        equals = equals && result[1].name === 'B';
                        equals = equals && result[2].name === 'C';
                        equals = equals && result[3].name === 'D';
                        return equals;
                    }
                }
            };
            expect(CitySelectorComponentController.alphabet).toEqual(resultMatcher1(CitySelectorComponentController.alphabet));
        });
    });
});