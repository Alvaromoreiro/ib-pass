describe('ChangePassengerSpecialNeedsService Test', function () {

    var rootScope, ChangePassengerSpecialNeedsService, localStorageService, mockError;
    var mockResponse = {
        data: {
            order: {
                orderItems : [ 'test' ]
            }
        }
    }

    var fakeRequestData = {};
    var fakeOrderId = 'ATH923482'

    var fakeCommonsGenericProxy = { putGeneric: jasmine.createSpy() };

    var fakeCommonsNewHttpUtilsErrorService = {
        controlError: jasmine.createSpy('controlError').and.callFake(function (error) {
            return error;
        })
    };

    var fakeMmBAppConstants = {
        QUADRIGAM: {
            CONFIRM_SPECIAL_NEEDS_ADD: 'test'
        },
        changePassengerSpecialNeeds: 'test'
    }

    var fakeMmBUtilService = {
        isUserLogged: jasmine.createSpy()
    }

    var fakeDatalayerUtilsService = {
        updateDatalayerWithQuadrigam: jasmine.createSpy('updateDatalayerWithQuadrigam').and.callFake(angular.noop),
        sendDatalayerEvent: jasmine.createSpy(),
        updateDigitalDataWithQuadrigam: jasmine.createSpy(),
        updateDatalayerViewEvent: jasmine.createSpy(),
        setProcessAndStep: jasmine.createSpy(),
        updateDatalayerInfo: jasmine.createSpy()
    }

    var fakeMmBUtilsErrorService = {
        processGeneralError: jasmine.createSpy(),
        processGeneralErrorWithProperties: jasmine.createSpy(),
        unauthorizedError: jasmine.createSpy(),
        internalServerError: jasmine.createSpy(),
        customErrorNameCorrection: jasmine.createSpy(),
        timeOutError: jasmine.createSpy(),
    };

    var fakeBookingInfo = {
        order: {
            orderItems: []
        }
    }

    var fakeCommonsUtilService = {
        setTitlePage: jasmine.createSpy()
    };

    beforeEach(function () {
        angular.mock.module('ib-MmB-services-module', 'LocalStorageModule', function ($provide) {
            $provide.value('CommonsGenericProxy', fakeCommonsGenericProxy);
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('MmBUtilService', fakeMmBUtilService);
            $provide.value('MmBUtilsErrorService', fakeMmBUtilsErrorService);
            $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('CommonsUtilService', fakeCommonsUtilService);
        });
        inject(function (_ChangePassengerSpecialNeedsService_, $rootScope, _localStorageService_) {
            ChangePassengerSpecialNeedsService = _ChangePassengerSpecialNeedsService_;
            rootScope = $rootScope;
            localStorageService = _localStorageService_;
            localStorageService.set('bookingInfo', fakeBookingInfo);
        });
    });

    describe('when ChangePassengerSpecialNeeds Proxy resolves the promise', function () {
        beforeEach(inject(function ($q) {
            fakeCommonsGenericProxy.putGeneric = jasmine.createSpy('putGeneric').and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve(mockResponse);
                return deferred.promise;
            });
        }));

        it('ChangePassengerSpecialNeedsProxy should resolve the promise', function (done) {
            ChangePassengerSpecialNeedsService.changePassengerSpecialNeedsServiceInfo(fakeRequestData, fakeOrderId).then(function (responseData) {
                expect(responseData).toEqual({data:{order: {orderItems: ['test']}}});
                done();
            });
            rootScope.$digest();
        })
    });

    describe('when ChangePassengerSpecialNeeds Proxy rejects the promise ', function () {
        beforeEach(inject(function ($q) {
            fakeCommonsGenericProxy.putGeneric = jasmine.createSpy('putGeneric').and.callFake(function () {
                var deferred = $q.defer();
                deferred.reject(mockError);
                return deferred.promise;
            });
        }));

        it('with 401 error code, should be returned error data', function () {
            mockError = { 'errorCode': 401, 'data': { 'errors': [{ 'reason': 'error' }] } };
            ChangePassengerSpecialNeedsService.changePassengerSpecialNeedsServiceInfo(fakeRequestData, fakeOrderId).then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(401);
            });
            rootScope.$digest();
        });

        it('with 408 error code, should be returned error data', function () {
            mockError = { 'errorCode': 408, 'data': { 'errors': [{ 'reason': 'error' }] } };
            ChangePassengerSpecialNeedsService.changePassengerSpecialNeedsServiceInfo(fakeRequestData, fakeOrderId).then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(408);
            });
            rootScope.$digest();
        });

        it('with 500 error code, should be returned error data', function () {
            mockError = { 'errorCode': 500, 'data': { 'errors': [{ 'reason': 'error' }] } };
            ChangePassengerSpecialNeedsService.changePassengerSpecialNeedsServiceInfo(fakeRequestData, fakeOrderId).then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(500);
            });
            rootScope.$digest();
        });


        it('with non 401 or 408 error code,should be returned procesed error', function () {
            mockError = { 'errorCode': 403, 'data': { 'errors': [{ 'reason': 'error' }] } };
            ChangePassengerSpecialNeedsService.changePassengerSpecialNeedsServiceInfo(fakeRequestData, fakeOrderId).then(angular.noop, function (responseError) {
                expect(responseError.mockError).toEqual(403);

            });
            rootScope.$digest();
        });
    });
});
