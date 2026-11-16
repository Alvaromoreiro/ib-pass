xdescribe('CommercialInfobyMarketService Test', function () {

    var fakeCommonsGenericProxy = { getGeneric: jasmine.createSpy() };
    var mockResponse = {data: {}};
    var CommercialInfobyMarketService, rootScope;

    var fakeCommonsNewHttpUtilsErrorService = {
        controlError: jasmine.createSpy('controlError').and.callFake(function (error) {
            return error;
        })
    };

    var fakeMmBUtilsErrorService = {
        processGeneralError: jasmine.createSpy(),
        processGeneralErrorWithProperties: jasmine.createSpy(),
        unauthorizedError: jasmine.createSpy(),
        internalServerError: jasmine.createSpy(),
        customErrorNameCorrection: jasmine.createSpy(),
        timeOutError: jasmine.createSpy(),
    };

    beforeEach(function () {
        angular.mock.module('ib-MmB-services-module', 'LocalStorageModule', function ($provide) {
            $provide.value('CommonsGenericProxy', fakeCommonsGenericProxy);
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
            $provide.value('MmBUtilsErrorService', fakeMmBUtilsErrorService);
            $provide.value('MmBAppConstants', {});
        });
        inject(function ($rootScope, _CommercialInfobyMarketService_) {
            CommercialInfobyMarketService = _CommercialInfobyMarketService_;
            rootScope = $rootScope;
        });
    });

    describe('when MmBCommercialInfobyMarket Proxy resolves the promise', function () {
        beforeEach(inject(function ($q) {
            fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve(mockResponse);
                return deferred.promise;
            });
        }));
        it('return the rest service commercial info data', function (done) {
            CommercialInfobyMarketService.getCommercialInfo().then(function (responseData) {
                expect(responseData).toEqual({});
                done();
            }, angular.noop);
            rootScope.$digest();
        });
    });
    describe('when MmBCommercialInfobyMarket Proxy rejects the promise with non 401 or 408 errorCode', function () {
        beforeEach(inject(function ($q) {
            var mockError = {
                'errorCode': 400,
                'data': {
                    'errors': [{ 'reason': 'error' }]
                }
            };
            var processedResponse = {
                errorCode: 400,
                message: 'error',
                needsTranslate: false,
                internalErrorCode: 'internal_error'
            };
            fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(function () {
                var deferred = $q.defer();
                deferred.reject(mockError);
                return deferred.promise;
            });
            fakeMmBUtilsErrorService.processGeneralError = jasmine.createSpy('processGeneralError').and.callFake(function () {
                return processedResponse;
            });
        }));
        it('should return an object with processed error struture', function () {
            CommercialInfobyMarketService.getCommercialInfo().then(angular.noop, function (responseError) {
                expect(responseError.message).toEqual('error');
                expect(responseError.needsTranslate).toEqual(false);

            });
            rootScope.$digest();
        });
    });
    describe('when MmBCommercialInfobyMarket Proxy rejects the promise with 401 errorCode', function () {
        beforeEach(inject(function ($q) {
            var mockError = { 'errorCode': 401, 'data': { 'errors': [{ 'reason': 'error' }] } };
            fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(function () {
                var deferred = $q.defer();
                deferred.reject(mockError);
                return deferred.promise;
            });
            fakeMmBUtilsErrorService.unauthorizedError = jasmine.createSpy('unauthorizedError').and.callFake(function (attempts, callback, error) {
                mockError.errorCode = 400;
                callback();
            });
        }));
        it('401 case switch error', function () {
            CommercialInfobyMarketService.getCommercialInfo().then(angular.noop, function (responseError) {
                expect(responseError.message).toEqual('error');

            });
            rootScope.$digest();
        });
    });
    describe('when MmBCommercialInfobyMarket Proxy rejects the promise with 408 errorCode', function () {
        beforeEach(inject(function ($q) {
            var mockError = {
                'errorCode': 408,
                'data': {
                    'errors': [{ 'reason': 'error' }]
                }
            };

            fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(function () {
                var deferred = $q.defer();
                deferred.reject(mockError);
                return deferred.promise;
            });
            fakeMmBUtilsErrorService.timeOutError = jasmine.createSpy('timeOutError').and.callFake(function (attempts, callback, error) {
                mockError.errorCode = 400;
                callback();
            });
        }));
        it('408 case switch error', function () {
            CommercialInfobyMarketService.getCommercialInfo().then(angular.noop, function (responseError) {
                expect(responseError.message).toEqual('error');

            });
            rootScope.$digest();
        });
    });

    describe('when MmBCommercialInfobyMarket Proxy rejects the promise with 408 errorCode', function () {
        beforeEach(inject(function ($q) {
            var mockError = {
                'errorCode': 500,
                'data': {
                    'errors': [{ 'reason': 'error' }]
                }
            };

            fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(function () {
                var deferred = $q.defer();
                deferred.reject(mockError);
                return deferred.promise;
            });
            fakeMmBUtilsErrorService.internalServerError = jasmine.createSpy('internalServerError').and.callFake(function () {
                mockError.errorCode = 500;
            });
        }));
        it('500 case switch error', function () {
            CommercialInfobyMarketService.getCommercialInfo().then(angular.noop, function (responseError) {
                expect(responseError.message).toEqual('error');
            });
            rootScope.$digest();
        });
    });
});
