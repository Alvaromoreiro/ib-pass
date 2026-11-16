describe('CashRefundService Test', function () {
    var mockResponse = {data: 'response'};
    var mockError;
    var CashRefundService, rootScope, $q;

    var fakeCommonsGenericProxy = {
        postGeneric: jasmine.createSpy()
    };

    var fakeMmBAppConstants = {
        cashRefundInformationURI: 'url',
        cashRefundURI: 'test'
    };
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
        inject(function ($rootScope, _CashRefundService_, _$q_) {
            CashRefundService = _CashRefundService_;
            rootScope = $rootScope;
            $q = _$q_;
        });
    });

    describe('when getCashRefundConfirmation() is called', function () {
        beforeEach(inject(function ($q) {
            fakeCommonsGenericProxy.postGeneric = jasmine.createSpy('postGeneric').and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve(mockResponse);
                return deferred.promise;
            });
        }));
        it('and resolve promise, should return data', function (done) {
            CashRefundService.getCashRefundConfirmation().then(function (responseData) {
                expect(responseData).toEqual(mockResponse.data);
                done();
            }, angular.noop);

            rootScope.$digest();
        });
        it('and resolve promise, should return data', function (done) {
            CashRefundService.getCashRefundInformation().then(function (responseData) {
                expect(responseData).toEqual(mockResponse.data);
                done();
            }, angular.noop);
            rootScope.$digest();
        });
    });
    describe('when getCashRefundConfirmation() is called', function () {
        beforeEach(inject(function ($q) {
            fakeCommonsGenericProxy.postGeneric = jasmine.createSpy('postGeneric').and.callFake(function () {
                var deferred = $q.defer();
                deferred.reject(mockError);
                return deferred.promise;
            })
        }));

        it('and fail promise, 401 error', function () {
            mockError = { 'errorCode': 401, 'data': { 'errors': [{ 'reason': 'error' }] } };
            CashRefundService.getCashRefundConfirmation().then(angular.noop, function (responseData) {
                expect(responseData.errorCode).toEqual(401);
            });

            rootScope.$digest();
        });

        it('and fail promise, 408 error', function () {
            mockError = { 'errorCode': 408, 'data': { 'errors': [{ 'reason': 'error' }] } };
            CashRefundService.getCashRefundConfirmation().then(angular.noop, function (responseData) {
                expect(responseData.errorCode).toEqual(408);
            });

            rootScope.$digest();
        });

        it('and fail promise, 500 error', function () {
            mockError = { 'errorCode': 500, 'data': { 'errors': [{ 'reason': 'error' }] } };
            CashRefundService.getCashRefundConfirmation().then(angular.noop, function (responseData) {
                expect(responseData.errorCode).toEqual(500);
            });

            rootScope.$digest();
        });

        it('getCashRefundInformation and fail promise, 401 error', function () {
            mockError = { 'errorCode': 401, 'data': { 'errors': [{ 'reason': 'error' }] } };
            CashRefundService.getCashRefundInformation().then(angular.noop, function (responseData) {
                expect(responseData.errorCode).toEqual(401);
            }, angular.noop);

            rootScope.$digest();
        });

        it('getCashRefundInformation and fail promise, 408 error', function () {
            mockError = { 'errorCode': 408, 'data': { 'errors': [{ 'reason': 'error' }] } };
            CashRefundService.getCashRefundInformation().then(angular.noop, function (responseData) {
                    expect(responseData.errorCode).toEqual(408);
                }, angular.noop);

            rootScope.$digest();
        });

        it('getCashRefundInformation and fail promise, 500 error', function () {
            mockError = { 'errorCode': 500, 'data': { 'errors': [{ 'reason': 'error' }] } };
            CashRefundService.getCashRefundInformation().then(angular.noop, function (responseData) {
                    expect(responseData.errorCode).toEqual(500);
                }, angular.noop);

            rootScope.$digest();
        });
    });

    // describe('when getCashRefundInformation() is called', function(){


    // })
});
