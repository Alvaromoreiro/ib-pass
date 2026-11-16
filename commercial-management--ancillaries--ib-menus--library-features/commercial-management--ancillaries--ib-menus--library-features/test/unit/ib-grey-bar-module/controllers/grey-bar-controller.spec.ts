// @ts-nocheck
'use strict';
jasmine.getEnv().allowRespy(true);
describe('test for module ib-grey-bar-module - controllers', () => {
    const ibGreyBarTransformerMock = {
        isSoftUser: jasmine.createSpy()
    };
    const localStorageServiceMock = {
        get: jasmine.createSpy('get').and.callFake((key) => {
            if (key === 'toggle') {
                return { isSoftUserHideEnabled: true };
            }
            return null;
        }),
        set: jasmine.createSpy('set')
    };

    const modelMock = {
        login: {},
        loggedData: {
            name: 'clasica',
            surname: 'test',
            avios: '1,575',
            isLogged: true
        },
        userLogged: true,
        isONB: false,
        isLogged: true,
        show: true
    };

    const loggedTestTemplate = ({
        softUser = false,
        callback,
        expectedResult = false
    }: {
        softUser: boolean;
        callback: () => boolean;
        expectedResult: boolean;
    }) => {
        ibGreyBarTransformerMock.isSoftUser.and.callFake(() => softUser);
        const result = callback();

        expect(result).toBe(expectedResult);
        expect(ibGreyBarTransformerMock.isSoftUser).toHaveBeenCalled();
    };

    beforeEach(() => {
        angular.mock.module('ib-web-menus-module');
    });

    afterEach(() => {
        ibGreyBarTransformerMock.isSoftUser.calls.reset();
    });

    describe('test for GreyBarController', () => {
        let GreyBarController;
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
                }, {});
                $rootScope = $injector.get('$rootScope');
                $scope = $rootScope.$new();
                GreyBarController = $controller('GreyBarController', {
                    ibGreyBarTransformer: ibGreyBarTransformerMock,
                    localStorageService: localStorageServiceMock,
                    $scope: $scope
                });
                GreyBarController.model = structuredClone(modelMock);
            });
        });

        it('GreyBarController should be defined', () => {
            expect(GreyBarController).toBeDefined();
        });

        it('isLogged should return false when user is not logged in', () => {
            GreyBarController.model.isLogged = false;
            loggedTestTemplate({
                expectedResult: false,
                callback: GreyBarController.isLogged
            });
        });

        it('isLogged should return false when user is a soft user', () => {
            loggedTestTemplate({
                expectedResult: false,
                callback: GreyBarController.isLogged,
                softUser: true
            });
        });

        it('isLogged should return true when user is a hard user', () => {
            loggedTestTemplate({
                expectedResult: true,
                callback: GreyBarController.isLogged
            });
        });

        it('isNotLogged should return true when user is a soft user', () => {
            loggedTestTemplate({
                expectedResult: true,
                softUser: true,
                callback: GreyBarController.isNotLogged
            });
        });

        it('isNotLogged should return true when user is not logged in', () => {
            GreyBarController.model.isLogged = false;
            loggedTestTemplate({
                expectedResult: true,
                callback: GreyBarController.isNotLogged
            });
        });

    });
});