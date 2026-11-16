describe('FareUnifiedService Test', function () {

    var rootScope, FareUnifiedService, mockError, localStorageService;
    var mockResponse = { data: 'promise' }

    var fakeFareUnifiedRequest = 'test';

    var fakeCommonsGenericProxy = {
        postGeneric: jasmine.createSpy()
    };
    var fakeCommonsNewHttpUtilsErrorService = {
        controlError: jasmine.createSpy('controlError').and.callFake(function (error) {
            return error;
        })
    }

    beforeEach(function () {
        angular.mock.module('ib-MmB-services-module', function ($provide) {
            $provide.value('CommonsGenericProxy', fakeCommonsGenericProxy);
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
            $provide.value('MmBAppConstants', {sisterCitiesServiceURI: 'test'});
        });
        inject(function (_FareUnifiedService_, $rootScope) {
            FareUnifiedService = _FareUnifiedService_;
            rootScope = $rootScope;
        });
    });

    describe('when SisterCitiesProxy Proxy resolves the promise', function () {
        beforeEach(inject(function ($q) {
            fakeCommonsGenericProxy.postGeneric = jasmine.createSpy('postGeneric').and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve(mockResponse);
                return deferred.promise;
            });
        }));

        it('fakeCommonsGenericProxy should resolve the promise on get function', function (done) {
            FareUnifiedService.getFareUnified(fakeFareUnifiedRequest).then(function (responseData) {
                expect(responseData).toEqual(mockResponse.data);
                done();
            }, angular.noop);
            rootScope.$digest();
        })
    });

    describe('when SisterCitiesService get Proxy rejects the promise ', function () {
        beforeEach(inject(function ($q) {
            fakeCommonsGenericProxy.postGeneric = jasmine.createSpy('postGeneric').and.callFake(function () {
                var deferred = $q.defer();
                deferred.reject(mockError);
                return deferred.promise;
            });
        }));

        it('with 400 error code, should be returned error data', function () {
            mockError = { 'errorCode': 400, 'data': { 'errors': [{ 'reason': 'error' }] } };
            FareUnifiedService.getFareUnified(fakeFareUnifiedRequest).then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(400);
            });
            rootScope.$digest();
        });

        it('with 401 error code, should be returned error data', function () {
            mockError = { 'errorCode': 401, 'data': { 'errors': [{ 'reason': 'error' }] } };
            inject(function ($q) {
                fakeCommonsGenericProxy.postGeneric = jasmine.createSpy('getGeneric').and.callFake(function () {
                    var deferred = $q.defer();
                    deferred.reject(mockError);
                    return deferred.promise;
                });
            });
            FareUnifiedService.getFareUnified(fakeFareUnifiedRequest).then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(400);
            });
            rootScope.$digest();
        });

        it('with 408 error code, should be returned error data', function () {
            mockError = { 'errorCode': 408, 'data': { 'errors': [{ 'reason': 'error' }] } };
            FareUnifiedService.getFareUnified(fakeFareUnifiedRequest).then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(408);
            });
            rootScope.$digest();
        });

        it('with 500 error code, should be returned error data', function () {
            mockError = { 'errorCode': 500, 'data': { 'errors': [{ 'reason': 'error' }] } };
            FareUnifiedService.getFareUnified(fakeFareUnifiedRequest).then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(500);
            });
            rootScope.$digest();
        });

        it('with non 401 or 408 error code,should be returned procesed error', function () {
            mockError = { 'errorCode': 404, 'data': { 'errors': [{ 'reason': 'error' }] } };
            FareUnifiedService.getFareUnified(fakeFareUnifiedRequest).then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(404);
            });
            rootScope.$digest();
        });
    });
});
