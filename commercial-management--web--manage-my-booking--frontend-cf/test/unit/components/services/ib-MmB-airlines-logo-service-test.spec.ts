describe('MmBAirlinesLogoService Test', function () {

    var fakeCommonsGenericProxy = { getGeneric: jasmine.createSpy() };
    var mockResponse = {data: 'response'};
    var MmBAirlinesLogoService, rootScope, localStorageService;
    var errorResponse = { 'errorCode': 400, 'message': 'REST_SERVICE_ERROR_GENERAL', 'needsTranslate': true, 'internalErrorCode': '' };
    var fakeCommonsNewHttpUtilsErrorService = {
        'controlError': jasmine.createSpy('controlError').and.callFake(function (error) {
            return error;
        })
    }
    beforeEach(function () {
        angular.mock.module('LocalStorageModule', 'ib-MmB-services-module', function ($provide) {
            $provide.value('CommonsGenericProxy', fakeCommonsGenericProxy);
            $provide.value('MmBAppConstants', {iconsRoute: 'test/', airlinesLogoJsonRoute: 'test'});
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
        });
        inject(function ($rootScope, _MmBAirlinesLogoService_, _localStorageService_) {
            MmBAirlinesLogoService = _MmBAirlinesLogoService_;
            rootScope = $rootScope;
            localStorageService = _localStorageService_;

        });
    });
    describe('when airlines data is not in local storage', function () {
        beforeEach(inject(function ($q) {
            localStorageService.set('airlinesLogoList', null);
            fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve(mockResponse);
                return deferred.promise;
            });
        }));

        it('and MmBAirlinesLogoProxy resolves the promise, then the service must return proxy´s data', function (done) {
            MmBAirlinesLogoService.getAirlinesLogos().then(function (responseData) {
                expect(responseData).toEqual(mockResponse.data);
                done();
            }, angular.noop);
            rootScope.$digest();
        });
    });
    describe('when airlines data is in localStorage', function () {
        beforeEach(inject(function ($q) {
            localStorageService.set('airlinesLogoList', { 'url': 'test' });
            fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve(mockResponse);
                return deferred.promise;
            });
        }));
        it('and MmBAirlinesLogoProxy resolves the promise, then the service must return proxy´s data', function (done) {
            MmBAirlinesLogoService.getAirlinesLogos().then(function (responseData) {
                expect(responseData).toEqual({ 'url': 'test' });
                done();
            }, angular.noop);
            rootScope.$digest();
        });
    });

    describe('When getGeneric reject', function () {
        beforeEach(inject(function ($q) {
            localStorageService.set('airlinesLogoList', null);
            fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(function () {
                var deferred = $q.defer();
                deferred.reject(errorResponse);
                return deferred.promise;
            });
        }));
        it('and MmBAirlinesLogoProxy rejects the promise, general error response must be rejected and empty list in local storage must be set', function () {
            MmBAirlinesLogoService.getAirlinesLogos().then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(400);
                localStorageService.clearAll();

            });
            rootScope.$digest();
        });
        it('and MmBAirlinesLogoProxy rejects the promise, general error response must be rejected and empty list in local storage must be set', function () {
            errorResponse.errorCode = 500;
            MmBAirlinesLogoService.getAirlinesLogos().then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(500);
                localStorageService.clearAll();

            });
            rootScope.$digest();
        });
    });
});
