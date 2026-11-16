describe('UpdateSeatChangeNotificationService Test', function () {

    var rootScope, UpdateSeatChangeNotificationService, mockError;
    var mockResponse = { data: 'promesa' }

    var fakeFlowId = 'TWFuYWdlTXlCb29raW5nQElCNDg0YmI3YjQ5OTBkNDI4Zjg5Y2MyY2Y4NGExYTkzMDM%3D';

    var fakeCommonsGenericProxy = { putGeneric: jasmine.createSpy() };

    var fakeMmBAppConstants = {
        'updateSeatChangeNotificationURI': 'http://test{flowId}',
    }

    var fakeCommonsNewHttpUtilsErrorService = {
        'controlError': jasmine.createSpy('controlError').and.callFake(function (error) {
            return error;
        })
    };

    beforeEach(function () {
        angular.mock.module('ib-MmB-services-module', function ($provide) {
            $provide.value('CommonsGenericProxy', fakeCommonsGenericProxy);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
        });
        inject(function (_UpdateSeatChangeNotificationService_, $rootScope) {
            UpdateSeatChangeNotificationService = _UpdateSeatChangeNotificationService_;
            rootScope = $rootScope;
        });
    });

    describe('when UpdateSeatChangeNotification Proxy resolves the promise', function () {
        beforeEach(inject(function ($q) {
            fakeCommonsGenericProxy.putGeneric = jasmine.createSpy('putGeneric').and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve(mockResponse);
                return deferred.promise;
            });
        }));

        it('UpdateSeatChangeNotification should resolve the promise', function (done) {
            UpdateSeatChangeNotificationService.callUpdateSeatChangeNotification(fakeFlowId).then(function (responseData) {
                expect(responseData).toEqual(mockResponse.data);
                done();
            }, angular.noop);
            rootScope.$digest();
        })
    });

    describe('when UpdateSeatChangeNotification Proxy rejects the promise ', function () {
        beforeEach(inject(function ($q) {
            fakeCommonsGenericProxy.putGeneric = jasmine.createSpy('putGeneric').and.callFake(function () {
                var deferred = $q.defer();
                deferred.reject(mockError);
                return deferred.promise;
            });
        }));

        it('with 401 error code, should be returned error data', function (done) {
            mockError = { 'errorCode': 401, 'data': { 'errors': [{ 'reason': 'error' }] } };
            UpdateSeatChangeNotificationService.callUpdateSeatChangeNotification(fakeFlowId).then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(401);
            });
            rootScope.$digest();
            done();
        });

        it('with 408 error code, should be returned error data', function (done) {
            mockError = { 'errorCode': 408, 'data': { 'errors': [{ 'reason': 'error' }] } };
            UpdateSeatChangeNotificationService.callUpdateSeatChangeNotification(fakeFlowId).then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(408);
            });
            rootScope.$digest();
            done();
        });

        it('with 417 error code, should be returned error data', function () {
            mockError = { 'errorCode': 417, 'data': { 'errors': [{ 'reason': 'error' }] } };
            UpdateSeatChangeNotificationService.callUpdateSeatChangeNotification(fakeFlowId).then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(417);
            });
            rootScope.$digest();
        });

    });
});
