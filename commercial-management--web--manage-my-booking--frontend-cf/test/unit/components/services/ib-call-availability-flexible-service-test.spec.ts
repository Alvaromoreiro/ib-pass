describe('CallAvailabilityflexibleService Test', function () {
    var mockResponse = {data: 'test'};

    var CallAvailabilityflexibleService, rootScope, q, mockError;

    var CallRibbonflexibleServiceFake = {
        getRibbonFlexible: jasmine.createSpy()
    };
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
    var $filterFake = jasmine.createSpy('$filter').and.callFake(function (filter) {
        var filterFunc = function () {
            return '';
        };
        switch (filter) {
            case 'translate':
                filterFunc = function () {
                    return 'Translated Text';
                };
                break;
            default:
                break;
        }

        return filterFunc;
    })

    beforeEach(function () {
        angular.mock.module('ib-MmB-services-module', 'LocalStorageModule', function ($provide) {
            $provide.value('CommonsGenericProxy', fakeAvailabilityflexibleProxy);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('MmBUtilService', MmBUtilServiceFake);
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
            $provide.value('CallRibbonflexibleService', CallRibbonflexibleServiceFake);
            $provide.value('$filter', $filterFake);
        });
        inject(function ($rootScope, _CallAvailabilityflexibleService_, $q) {
            CallAvailabilityflexibleService = _CallAvailabilityflexibleService_;
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
            CallRibbonflexibleServiceFake.getRibbonFlexible = jasmine.createSpy('getRibbonFlexible').and.callFake(() => {
                var deferred = $q.defer();
                deferred.resolve(mockResponse);
                return deferred.promise;
            });
        }));

        it('and resolve promise, should return data', function (done) {
            CallAvailabilityflexibleService.getAvailabilityFlexible().then(function (responseData) {
                expect(responseData).toEqual({availabilityDataResponse: mockResponse.data, ribbonFlexData: mockResponse});
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
            CallRibbonflexibleServiceFake.getRibbonFlexible = jasmine.createSpy('getRibbonFlexible').and.callFake(() => {
                var deferred = $q.defer();
                deferred.reject(null);
                return deferred.promise;
            });
        }));
        it('and fail promise CallRibbonflexibleServiceFake.getRibbonFlexible, 400 error', function (done) {
            CallAvailabilityflexibleService.getAvailabilityFlexible().then(function (responseData) {
                expect(responseData).toEqual({availabilityDataResponse: mockResponse.data, ribbonFlexData: null});
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
            CallRibbonflexibleServiceFake.getRibbonFlexible = jasmine.createSpy('getRibbonFlexible').and.callFake(() => {
                var deferred = $q.defer();
                deferred.reject(null);
                return deferred.promise;
            });
        }));
        it('and fail promise, 400 error', function () {
            mockError = { 'errorCode': 400, 'data': { 'errors': [{ 'reason': 'error' }] } };
            CallAvailabilityflexibleService.getAvailabilityFlexible().then(angular.noop, function (responseData) {
                expect(responseData.errorCode).toEqual(400);
            });
            rootScope.$digest();
        });

        it('and fail promise, 401 error', function () {
            mockError = { 'errorCode': 401, 'data': { 'errors': [{ 'reason': 'error' }] } };
            CallAvailabilityflexibleService.getAvailabilityFlexible().then(angular.noop, function (responseData) {
                expect(responseData.errorCode).toEqual(401);
            });
            rootScope.$digest();
        });

        it('and fail promise, 408 error', function () {
            mockError = { 'errorCode': 408, 'data': { 'errors': [{ 'reason': 'error' }] } };
            CallAvailabilityflexibleService.getAvailabilityFlexible().then(angular.noop, function (responseData) {
                expect(responseData.errorCode).toEqual(408);
            });
            rootScope.$digest();
        });

        it('and fail promise, 500 error', function () {
            mockError = { 'errorCode': 500, 'data': { 'errors': [{ 'reason': 'error' }] } };
            CallAvailabilityflexibleService.getAvailabilityFlexible().then(angular.noop, function (responseData) {
                expect(responseData.errorCode).toEqual(500);
            });
            rootScope.$digest();
        });

        it('and fail promise, 505 error', function () {
            mockError = { 'errorCode': 505, 'data': { 'errors': [{ 'reason': 'error' }] } };
            CallAvailabilityflexibleService.getAvailabilityFlexible().then(angular.noop, function (responseData) {
                expect(responseData.errorCode).toEqual(505);
            });
            rootScope.$digest();
        });
    });
});
