import * as angular from 'angular';
describe('GetFrequentFlyersService', function () {

    let getFrequentFlyersService, localStorageService, httpServicesConstants, timeout, rootScope;
    let mockResponse = 'promesa';

    let mockFrequentFlyers = { 'frequentFlyers': 'frequentFlyers' };

    let fakeCommonsGenericProxy = {
        getGeneric: jasmine.createSpy()
    };
    let fakeCommonsHttpUtilsErrorService = {
        'controlError': jasmine.createSpy('controlError').and.callFake(function(errorInput, attempts, callback, defer, inputBool) {
            defer.reject({ errorCode: 400, message: 'error', needsTranslate: false, internalErrorCode: 'internal_error' });
        })
    };

    let fakeIbSessionConfigService = {
        'getEndpoint': jasmine.createSpy('getEndpoint').and.callFake(function () {
            return 'endpoint'
        })
    };


    let fakeTranslateFilter = function (input) {
        let ob = {
            'translate': function (input) {
                return input;
            }
        }
        return ob;
    };

    let fakeDatalayerUtilsService = { 'sendDatalayerErrorEvent': jasmine.createSpy() };

    beforeEach(function () {
        angular.mock.module('ib-http-services-module', 'LocalStorageModule', function ($provide) {
            $provide.value('CommonsHttpUtilsErrorService', fakeCommonsHttpUtilsErrorService);
            $provide.value('CommonsGenericProxy', fakeCommonsGenericProxy);
            $provide.value('translateFilter', fakeTranslateFilter);
            $provide.value('CkiDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('IbSessionConfigService', fakeIbSessionConfigService);
        });
        inject(function (GetFrequentFlyersService, _localStorageService_, _HttpServicesConstants_, $timeout, $rootScope) {
            getFrequentFlyersService = GetFrequentFlyersService;
            httpServicesConstants = _HttpServicesConstants_;
            timeout = $timeout;
            localStorageService = _localStorageService_;
            rootScope = $rootScope;
        })
    });


    describe('When CommonsGenericProxy is called', function () {
        describe('and CommonsGenericProxy resolve promise', function () {
            it('and have frequentFlyers in localStorage,should return data of localStorage', function (done) {
                inject(function ($q) {
                    fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(function () {
                        let defer = $q.defer();
                        defer.resolve({ data: mockResponse });
                        return defer.promise;
                    });
                });
                localStorageService.set('frequentFlyers', mockFrequentFlyers);
                getFrequentFlyersService.getFrequentFlyers().then(function (response) {
                    expect(response).toEqual(mockFrequentFlyers);
                }, angular.noop);
                rootScope.$digest();
                done();
            });

            it('and not  have frequentFlyers, CommonsGenericProxy is called,should return data', function (done) {
                inject(function ($q) {
                    fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(function () {
                        let defer = $q.defer();
                        defer.resolve({ data: mockResponse });
                        return defer.promise;
                    });
                });
                localStorageService.clearAll();
                getFrequentFlyersService.getFrequentFlyers().then(function (response) {
                    expect(response).toEqual(mockResponse);
                    expect(localStorageService.get('frequentFlyers')).toEqual(mockResponse);
                });
                rootScope.$digest();
                done();
            });
        });

        describe('and CommonsGenericProxy resolve promise', function () {
            it('with error 401, should call refreshToken service and return data error', function (done) {
                let mockError = { 'errorCode': 401, 'data': { 'errors': [{ 'reason': 'error' }] } };
                inject(function ($q) {
                    fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(function () {
                        let defer = $q.defer();
                        defer.reject(mockError);
                        return defer.promise;
                    });
                });
                localStorageService.clearAll();
                getFrequentFlyersService.getFrequentFlyers().then(angular.noop, function (response) {
                    expect(response.errorCode).toEqual(400);
                });
                rootScope.$digest();
                done();
            });
            it('with error 408, should call refreshToken service and return data error', function (done) {
                let mockError = { 'errorCode': 408, 'data': { 'errors': [{ 'reason': 'error' }] } };
                httpServicesConstants.NUM_ATTEMPS = 1;
                httpServicesConstants.TIME_WAIT = 1;
                inject(function ($q) {
                    fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(function () {
                        let defer = $q.defer();
                        defer.reject(mockError);
                        return defer.promise;
                    });
                });
                localStorageService.clearAll();
                getFrequentFlyersService.getFrequentFlyers().then(angular.noop, function (response) {
                    expect(response.errorCode).toEqual(400);
                });
                rootScope.$digest();
                done();
                timeout.flush();
            });
        });
    });
});