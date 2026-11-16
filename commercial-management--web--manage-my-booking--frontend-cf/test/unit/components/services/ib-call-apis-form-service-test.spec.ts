describe('CallApisFormService Test', function () {

    var rootScope, CallApisFormService, localStorageService;
    var data = 'test';
    var mockResponse = { data: 'promesa' }

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

    var fakeDatalayerConstants = {}

    var fakeDatalayerService = jasmine.createSpy();
    var fakeDatalayerUtilsService = {
        'updateDatalayerWithQuadrigam': jasmine.createSpy('updateDatalayerWithQuadrigam').and.callFake(angular.noop),
        'sendDatalayerEvent': jasmine.createSpy('sendDatalayerEvent').and.callFake(angular.noop),
        'addDataLayerInfo': jasmine.createSpy('addDataLayerInfo').and.callFake(angular.noop),
        'setProcessAndStep': jasmine.createSpy(),
    };


    var fakeflowId = 'TWFuYWdlTXlCb29raW5nQElCNDg0YmI3YjQ5OTBkNDI4Zjg5Y2MyY2Y4NGExYTkzMDM%3D';
    var fakePassengerId = 'ADULT_01';
    var fakePassengerApisData = {};

    var fakeApisFormProxy = {
        getGeneric: jasmine.createSpy(),
        putGeneric: jasmine.createSpy()
    };

    var fakeMmBUtilsErrorService = {
        unauthorizedError: jasmine.createSpy(),
        timeOutError: jasmine.createSpy(),
        processGeneralError: jasmine.createSpy(),
        controlError: jasmine.createSpy('controlError').and.callFake(function (error) {
            return error;
        })
    };

    beforeEach(function () {
        angular.mock.module('ib-MmB-services-module', 'LocalStorageModule','ngCookies', function ($provide) {
            $provide.value('CommonsGenericProxy', fakeApisFormProxy);
            $provide.value('CommonsNewHttpUtilsErrorService', fakeMmBUtilsErrorService);
            $provide.value('MmBAppConstants', {});
            $provide.value('MmBTokenProxy', fakeMmBTokenProxy);
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('DatalayerService', fakeDatalayerService);
            $provide.value('MmBDatalayerUtilsService', fakeDatalayerUtilsService);
            $provide.value('MMBDatalayerConstants', fakeDatalayerConstants);
        });
        inject(function (_CallApisFormService_, $rootScope, _localStorageService_) {
            CallApisFormService = _CallApisFormService_;
            rootScope = $rootScope;
            localStorageService = _localStorageService_;
        });
    });

    describe('when CallApisForm Proxy resolves the promise', function () {
        beforeEach(inject(function ($q) {
            fakeApisFormProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve(mockResponse);
                return deferred.promise;
            });
        }));

        it('fakeApisFormProxy should resolve the promise on get function', function (done) {
            CallApisFormService.getApisInfo(fakeflowId, fakePassengerId).then(function (responseData) {
                expect(responseData).toEqual(mockResponse.data);
                done();
            });
            rootScope.$digest();
        })
    });

    describe('when CallApisForm Proxy resolves the promise', function () {
        beforeEach(inject(function ($q) {
            fakeApisFormProxy.putGeneric = jasmine.createSpy('putGeneric').and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve(mockResponse);
                return deferred.promise;
            });
        }));

        it('fakeApisFormProxy should resolve the promise on update function', function (done) {
            CallApisFormService.updateApisInfo(fakeflowId, fakePassengerApisData).then(function (responseData) {
                expect(responseData).toEqual(mockResponse.data);
                done();
            });
            rootScope.$digest();
        })
    });

    describe('when CallApisForm get Proxy rejects the promise ', function () {
        var mockError;

        beforeEach(inject(function ($q) {
            fakeApisFormProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(function () {
                var deferred = $q.defer();
                deferred.reject(mockError);
                return deferred.promise;
            });
        }));

        it('with 401 error code, should be returned error data', function () {
            mockError = { 'errorCode': 401, 'data': { 'errors': [{ 'reason': 'error' }] } };
            CallApisFormService.getApisInfo(fakeflowId, fakePassengerId).then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(mockError.errorCode);

            });
            rootScope.$digest();
        });

        it('with 408 error code, should be returned error data', function () {
            mockError = { 'errorCode': 408, 'data': { 'errors': [{ 'reason': 'error' }] } };
            CallApisFormService.getApisInfo(fakeflowId, fakePassengerId).then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(mockError.errorCode);

            });
            rootScope.$digest();
        });

        it('with 500 error code, should be returned error data', function () {
            mockError = { 'errorCode': 500, 'data': { 'errors': [{ 'reason': 'error' }] } };
            CallApisFormService.getApisInfo(fakeflowId, fakePassengerId).then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(mockError.errorCode);
            });
            rootScope.$digest();
        });


        it('with non 401 or 408 error code,should be returned procesed error', function () {
            mockError = { 'errorCode': 400, 'data': { 'errors': [{ 'reason': 'error' }] } };
            CallApisFormService.getApisInfo(fakeflowId, fakePassengerId).then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(mockError.errorCode);
            });
            rootScope.$digest();
        });
    });

    describe('when CallApisForm update Proxy rejects the promise ', function () {
        var mockError;

        beforeEach(inject(function ($q) {
            fakeApisFormProxy.putGeneric = jasmine.createSpy('putGeneric').and.callFake(function () {
                var deferred = $q.defer();
                deferred.reject(mockError);
                return deferred.promise;
            });
        }));

        it('with 401 error code, should be returned error data', function () {
            mockError = { 'errorCode': 401, 'data': { 'errors': [{ 'reason': 'error' }] } };
            CallApisFormService.updateApisInfo(fakeflowId, fakePassengerApisData).then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(mockError.errorCode);
            });
            rootScope.$digest();
        });

        it('with 408 error code, should be returned error data', function () {
            mockError = { 'errorCode': 408, 'data': { 'errors': [{ 'reason': 'error' }] } };
            CallApisFormService.updateApisInfo(fakeflowId, fakePassengerApisData).then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(mockError.errorCode);

            });
            rootScope.$digest();
        });

        it('with 500 error code, should be returned error data', function () {
            mockError = { 'errorCode': 500, 'data': { 'errors': [{ 'reason': 'error' }] } };
            CallApisFormService.updateApisInfo(fakeflowId, fakePassengerApisData).then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(mockError.errorCode);
            });
            rootScope.$digest();
        });


        it('with non 401 or 408 error code,should be returned procesed error', function () {
            mockError = { 'errorCode': 400, 'data': { 'errors': [{ 'reason': 'error' }] } };
            CallApisFormService.updateApisInfo(fakeflowId, fakePassengerApisData).then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(mockError.errorCode);

            });
            rootScope.$digest();
        });
    });
});
