// @ts-nocheck
'use strict';


jasmine.getEnv().allowRespy(true);
describe('test for module ib-main-header-module - controllers', () => {
    const localStorageServiceMock = {
        get: jasmine.createSpy()
    };

    const onCloseSessionMock = jasmine.createSpy();
    const modelMock = {};
    const loginInfoMock = {};
    const flightTypeMock = {};

    beforeEach(() => {
        angular.mock.module('ib-main-header-module', ($provide) => {
            $provide.value('localStorageService', localStorageServiceMock);
        });
    });

    afterEach(() => {
        localStorageServiceMock.get.calls.reset();
    });

    describe('test for MainHeaderController', () => {

        let MainHeaderController;
        let $controller;
        let $rootScope;
        let $scope;
        let $window;
        let $location;
        let localStorageService;
        let $injector;

        beforeEach(() => {
            inject((_$componentController_, _$injector_) => {
                $controller = _$componentController_;
                $injector = Object.keys(_$injector_).reduce((clone, key) => {
                    clone[key] = _$injector_[key];
                    return clone;
                }, {});
                $rootScope = $injector.get('$rootScope');
                $scope = $rootScope.$new();
                $window = $injector.get('$window');
                $location = $injector.get('$location');
                MainHeaderController = $controller('ibMainHeader', {
                    localStorageService: localStorageServiceMock,
                    $window: $window,
                    $location: $location,
                    $rootScope: $rootScope
                }, {
                    onCloseSession: onCloseSessionMock,
                    model: modelMock,
                    loginInfo: loginInfoMock,
                    flightType: flightTypeMock
                });
            });
        });

        it('MainHeaderController should be defined', () => {

            expect(MainHeaderController).toBeDefined();
        });

        it('should initialize correctly', () => {
            MainHeaderController.$onInit();

            expect(onCloseSessionMock).toHaveBeenCalled();
            expect(MainHeaderController.isCKI).toBe(false);
            expect(MainHeaderController.showUserTooltip).toBeUndefined();
            expect(MainHeaderController.showIconSeparators).toBeUndefined();
        });

        describe('showComponentChooseLanguageMobile', () => {
            it('should return true if isCKI and a valid quadrigam', () => {
                $rootScope.flowName = 'CKI';
                MainHeaderController.$onInit();
                const result = MainHeaderController.showComponentChooseLanguageMobile();

                expect(result).toBe(true);
            });
        });

    });
});