describe('ChangeOrderContactInfoService Test', function () {

    var rootScope, ChangeOrderContactInfoService;
    var data = 'test';
    var mockResponse = { data: 'promesa' };

    var fakeMmBTokenProxy = {
        getMmBToken: jasmine.createSpy(),
        loginUser: jasmine.createSpy(),
        refreshUserLoggedToken: jasmine.createSpy()
    };

    var fakeMmBModalService = {
        'showGenericModal': jasmine.createSpy(),
        'showGenericError': jasmine.createSpy(),
        'finishWaiting': jasmine.createSpy(),
        'showWaitingModal': jasmine.createSpy()
    }

    var fakeDatalayerService = jasmine.createSpy();
    var fakeDatalayerUtilsService = jasmine.createSpy();

    var fakeRequestData = {};
    var fakeOrderId = 'ATH923482'

    var fakeChangeOrderContactInfoProxy = { putGeneric: jasmine.createSpy() };

    var fakeMmBUtilsErrorService = {
        controlError: jasmine.createSpy('controlError').and.callFake(function (error) {
            return error;
        }),
        processGeneralErrorWithProperties: jasmine.createSpy(),
        unauthorizedError: jasmine.createSpy(),
        timeOutError: jasmine.createSpy(),
        internalServerError: jasmine.createSpy(),
        processGeneralError: jasmine.createSpy(),
    };

    beforeEach(function () {
        angular.mock.module('ib-MmB-services-module', 'LocalStorageModule', function ($provide) {
            $provide.value('CommonsGenericProxy', fakeChangeOrderContactInfoProxy);
            $provide.value('CommonsNewHttpUtilsErrorService', fakeMmBUtilsErrorService);
            $provide.value('MmBAppConstants', {});
            $provide.value('MmBTokenProxy', fakeMmBTokenProxy);
            $provide.value('MmBModalService', fakeMmBModalService);
        });
        inject(function (_ChangeOrderContactInfoService_, $rootScope) {
            ChangeOrderContactInfoService = _ChangeOrderContactInfoService_;
            rootScope = $rootScope;
        });
    });

    describe('when ChangeOrderContactInfo Proxy resolves the promise', function () {
        beforeEach(inject(function ($q) {
            fakeChangeOrderContactInfoProxy.putGeneric = jasmine.createSpy('putGeneric').and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve(mockResponse);
                return deferred.promise;
            });
        }));

        it('ChangeOrderContactInfoProxy should resolve the promise', function (done) {
            ChangeOrderContactInfoService.changeOrderContactInfo(fakeRequestData, fakeOrderId).then(function (responseData) {
                expect(responseData).toEqual(mockResponse);
                done();
            });
            rootScope.$digest();
        })
    });

    describe('when ChangeOrderContactInfo Proxy rejects the promise ', function () {
        var mockError, procesedResponse;

        beforeEach(inject(function ($q) {
            fakeMmBUtilsErrorService.processGeneralErrorWithProperties = jasmine.createSpy('processGeneralErrorWithProperties').and.callFake(function (error) {
                return procesedResponse;
            });
        }));

        it('with 401 error code, should be returned error data', function () {
            mockError = { 'errorCode': 401, 'data': { 'errors': [{ 'reason': 'error' }] } };
            inject(function ($q) {
                fakeChangeOrderContactInfoProxy.putGeneric = jasmine.createSpy('putGeneric').and.callFake(function () {
                    var deferred = $q.defer();
                    deferred.reject(mockError);
                    return deferred.promise;
                });
                fakeMmBUtilsErrorService.unauthorizedError = jasmine.createSpy('unauthorizedError').and.callFake(function (attempts, callback, errors) {
                    mockError.errorCode = 400;
                    callback();
                });
            });
            ChangeOrderContactInfoService.changeOrderContactInfo(fakeRequestData, fakeOrderId).then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(400);
            });
            rootScope.$digest();
        });

        it('with 400 error code, should be returned error data', function () {
            mockError = { 'errorCode': 400, 'data': { 'errors': [{ 'reason': 'error' }] } };
            inject(function ($q) {
                fakeChangeOrderContactInfoProxy.putGeneric = jasmine.createSpy('putGeneric').and.callFake(function () {
                    var deferred = $q.defer();
                    deferred.reject(mockError);
                    return deferred.promise;
                });
                fakeMmBUtilsErrorService.unauthorizedError = jasmine.createSpy('unauthorizedError').and.callFake(function (attempts, callback, errors) {
                    mockError.errorCode = 400;
                    callback();
                });
            });
            ChangeOrderContactInfoService.changeOrderContactInfo(fakeRequestData, fakeOrderId).then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(400);
            });
            rootScope.$digest();
        });

        it('with 408 error code, should be returned error data', function () {
            mockError = { 'errorCode': 408, 'data': { 'errors': [{ 'reason': 'error' }] } };
            inject(function ($q) {
                fakeChangeOrderContactInfoProxy.putGeneric = jasmine.createSpy('putGeneric').and.callFake(function () {
                    var deferred = $q.defer();
                    deferred.reject(mockError);
                    return deferred.promise;
                });
                fakeMmBUtilsErrorService.timeOutError = jasmine.createSpy('timeOutError').and.callFake(function (attempts, callback, errors) {
                    mockError.errorCode = 400;
                    callback();

                });
            });
            ChangeOrderContactInfoService.changeOrderContactInfo(fakeRequestData, fakeOrderId).then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(400);
            });
            rootScope.$digest();
        });

        it('with 500 error code, should be returned error data', function () {
            mockError = { 'errorCode': 500, 'data': { 'errors': [{ 'reason': 'error' }] } };
            procesedResponse = { 'errorCode': 500, 'message': 'error', 'needsTranslate': false, 'internalErrorCode': 'internal_error' };
            inject(function ($q) {
                fakeChangeOrderContactInfoProxy.putGeneric = jasmine.createSpy('putGeneric').and.callFake(function () {
                    var deferred = $q.defer();
                    deferred.reject(mockError);
                    return deferred.promise;
                });
                fakeMmBUtilsErrorService.internalServerError = jasmine.createSpy('internalServerError').and.callFake(function () {
                    return procesedResponse;
                });
            });
            ChangeOrderContactInfoService.changeOrderContactInfo(fakeRequestData, fakeOrderId).then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(500);
            });
            rootScope.$digest();
        });


        it('with non 401 or 408 error code,should be returned procesed error', function () {
            mockError = { 'errorCode': 403, 'data': { 'errors': [{ 'reason': 'error' }] } };
            procesedResponse = { 'errorCode': 403, 'message': 'error', 'needsTranslate': false, 'internalErrorCode': 'internal_error' };
            inject(function ($q) {
                fakeChangeOrderContactInfoProxy.putGeneric = jasmine.createSpy('putGeneric').and.callFake(function () {
                    var deferred = $q.defer();
                    deferred.reject(mockError);
                    return deferred.promise;
                });
                fakeMmBUtilsErrorService.processGeneralError = jasmine.createSpy('processGeneralError').and.callFake(function () {
                    return procesedResponse;
                });
            });
            ChangeOrderContactInfoService.changeOrderContactInfo(fakeRequestData, fakeOrderId).then(angular.noop, function (responseError) {
                expect(responseError).toEqual(procesedResponse);

            });
            rootScope.$digest();
        });
    });
});
