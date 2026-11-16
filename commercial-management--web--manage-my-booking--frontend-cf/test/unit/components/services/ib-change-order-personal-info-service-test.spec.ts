describe('ChangeOrderPersonalInfoService Test', function () {

    var rootScope, ChangeOrderPersonalInfoService, mockError;;
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

    var fakeRequestData = {};
    var fakeOrderId = 'ATH923482'

    var fakeCommonsGenericProxy = { putGeneric: jasmine.createSpy() };

    var fakeMmBUtilsErrorService = {
        processGeneralErrorWithProperties: jasmine.createSpy(),
        unauthorizedError: jasmine.createSpy(),
        internalServerError: jasmine.createSpy(),
        customErrorNameCorrection: jasmine.createSpy(),
    };

    var fakeCommonsNewHttpUtilsErrorService = {
        controlError: jasmine.createSpy('controlError').and.callFake(function (error) {
            return error;
        }),
    }

    var fakeMmBAppConstants = {
        WARNING_MESSAGES: {
            CORRECTION_NAME_NOT_PERMITED: 'SSE_ORM_900562'
        }
    }

    beforeEach(function () {
        angular.mock.module('ib-MmB-services-module', 'LocalStorageModule', function ($provide) {
            $provide.value('CommonsGenericProxy', fakeCommonsGenericProxy);
            $provide.value('MmBUtilsErrorService', fakeMmBUtilsErrorService);
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('MmBTokenProxy', fakeMmBTokenProxy);
            $provide.value('MmBModalService', fakeMmBModalService);
        });
        inject(function (_ChangeOrderPersonalInfoService_, $rootScope) {
            ChangeOrderPersonalInfoService = _ChangeOrderPersonalInfoService_;
            rootScope = $rootScope;
        });
    });

    describe('when changeOrderPersonalInfo Proxy resolves the promise', function () {
        beforeEach(inject(function ($q) {
            fakeCommonsGenericProxy.putGeneric = jasmine.createSpy('putGeneric').and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve(mockResponse);
                return deferred.promise;
            });
        }));

        it('changeOrderPersonalInfoProxy should resolve the promise', function (done) {
            ChangeOrderPersonalInfoService.changeOrderPersonalInfo(fakeRequestData, fakeOrderId).then(function (responseData) {
                expect(responseData).toEqual(mockResponse);
                done();
            });
            rootScope.$digest();
        })
    });

    describe('when changeOrderPersonalInfo Proxy rejects the promise ', function () {
        beforeEach(inject(function ($q) {
            fakeCommonsGenericProxy.putGeneric = jasmine.createSpy('putGeneric').and.callFake(function () {
                var deferred = $q.defer();
                deferred.reject(mockError);
                return deferred.promise;
            });
        }));

        it('with 400 error code, should be returned error data', function () {
            mockError = { 'errorCode': 400, 'data': { 'errors': [{ 'reason': 'error' }] } };
            ChangeOrderPersonalInfoService.changeOrderPersonalInfo(fakeRequestData, fakeOrderId).then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(400);
            });
            rootScope.$digest();
        });

        it('with 412 error code, should be returned error data', function () {
            mockError = { 'errorCode': 412, 'data': { 'errors': [{ 'reason': 'error 412', 'code': fakeMmBAppConstants.WARNING_MESSAGES.CORRECTION_NAME_NOT_PERMITED }] } };
            ChangeOrderPersonalInfoService.changeOrderPersonalInfo(fakeRequestData, fakeOrderId).then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(412);
            });
            rootScope.$digest();
        });

        it('with 500 error code, should be returned error data', function () {
            mockError = { 'errorCode': 500, 'data': { 'errors': [{ 'reason': 'error 500' }] } };
            ChangeOrderPersonalInfoService.changeOrderPersonalInfo(fakeRequestData, fakeOrderId).then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(500);
            });
            rootScope.$digest();
        });

    });
});
