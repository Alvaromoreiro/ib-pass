describe('CallAvailabilityUnifiedService Test', function () {
    var mockResponse = {data: 'test'};

    var CallAvailabilityUnifiedService, rootScope, q, mockError;

    var fakeAvailabilityflexibleProxy = {
        postGeneric: jasmine.createSpy()
    };

    var fakeMmBAppConstants = {
        AvailabilityflexibleServiceURI: 'test'
    }
    var MmBUtilServiceFake = {
        getEndpoint: function () { }
    }
    var fakeCommonsNewHttpUtilsErrorService = {
        controlError: jasmine.createSpy('controlError').and.callFake(function (error) {
            return error;
        })
    };

    beforeEach(function () {
        angular.mock.module('ib-MmB-services-module', 'LocalStorageModule', function ($provide) {
            $provide.value('CommonsGenericProxy', fakeAvailabilityflexibleProxy);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('MmBUtilService', MmBUtilServiceFake);
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
        });
        inject(function ($rootScope, _CallAvailabilityUnifiedService_, $q) {
            CallAvailabilityUnifiedService = _CallAvailabilityUnifiedService_;
            rootScope = $rootScope;
            q = $q;
        });
    });

    describe('when getAvailabilityFlexible() is called and resolve', function () {
        beforeEach(inject(($q) => {
            fakeAvailabilityflexibleProxy.postGeneric = jasmine.createSpy('postGeneric').and.callFake(() => {
                var deferred = $q.defer();
                deferred.resolve(mockResponse);
                return deferred.promise;
            });
        }));

        it('and resolve promise, should return data', function (done) {
            CallAvailabilityUnifiedService.getAvailabilityUnified().then(function (responseData) {
                expect(responseData).toEqual(mockResponse.data);
                done();
            }, angular.noop);

            rootScope.$digest();
        });
    });
    describe('when getAvailabilityFlexible() is called and reject', function () {
        beforeEach(inject(($q) => {
            fakeAvailabilityflexibleProxy.postGeneric = jasmine.createSpy('postGeneric').and.callFake(() => {
                var deferred = $q.defer();
                deferred.resolve(mockResponse);
                return deferred.promise;
            });
        }));
        it('and fail promise CallRibbonflexibleServiceFake.getRibbonFlexible, 400 error', function (done) {
            CallAvailabilityUnifiedService.getAvailabilityUnified().then(function (responseData) {
                expect(responseData).toEqual(mockResponse.data);
                done();
            }, angular.noop);

            rootScope.$digest();
        });
    });
    describe('when getAvailabilityFlexible() is called and reject', function () {
        beforeEach(inject(($q) => {
            fakeAvailabilityflexibleProxy.postGeneric = jasmine.createSpy('postGeneric').and.callFake(() => {
                var deferred = $q.defer();
                deferred.reject(mockError);
                return deferred.promise;
            });
        }));
        it('and fail promise, 400 error', function () {
            mockError = { 'errorCode': 400, 'data': { 'errors': [{ 'reason': 'error' }] } };
            CallAvailabilityUnifiedService.getAvailabilityUnified().then(angular.noop, function (responseData) {
                expect(responseData.errorCode).toEqual(400);
            });
            rootScope.$digest();
        });

        it('and fail promise, 401 error', function () {
            mockError = { 'errorCode': 401, 'data': { 'errors': [{ 'reason': 'error' }] } };
            CallAvailabilityUnifiedService.getAvailabilityUnified().then(angular.noop, function (responseData) {
                expect(responseData.errorCode).toEqual(401);
            });
            rootScope.$digest();
        });

        it('and fail promise, 408 error', function () {
            mockError = { 'errorCode': 408, 'data': { 'errors': [{ 'reason': 'error' }] } };
            CallAvailabilityUnifiedService.getAvailabilityUnified().then(angular.noop, function (responseData) {
                expect(responseData.errorCode).toEqual(408);
            });
            rootScope.$digest();
        });

        it('and fail promise, 500 error', function () {
            mockError = { 'errorCode': 500, 'data': { 'errors': [{ 'reason': 'error' }] } };
            CallAvailabilityUnifiedService.getAvailabilityUnified().then(angular.noop, function (responseData) {
                expect(responseData.errorCode).toEqual(500);
            });
            rootScope.$digest();
        });

        it('and fail promise, 505 error', function () {
            mockError = { 'errorCode': 505, 'data': { 'errors': [{ 'reason': 'error' }] } };
            CallAvailabilityUnifiedService.getAvailabilityUnified().then(angular.noop, function (responseData) {
                expect(responseData.errorCode).toEqual(505);
            });
            rootScope.$digest();
        });
    });
});
