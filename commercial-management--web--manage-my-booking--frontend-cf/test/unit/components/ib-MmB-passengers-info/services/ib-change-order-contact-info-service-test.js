describe('ChangeOrderContactInfoService test', function () {

    var rootScope, timeOut, mockResponse = 'promesa';

    var fakeChangeOrderContactInfoProxy = {
        putGeneric: jasmine.createSpy()
    }

    var fakeMmBUtilsErrorService = {
        controlError: jasmine.createSpy('controlError').and.callFake(function (error) {
            return error;
        })
    }

    beforeEach(function () {
        module('ib-MmB-passengers-info-module', function ($provide) {
            $provide.value('CommonsGenericProxy', fakeChangeOrderContactInfoProxy);
            $provide.value('MmBAppConstants', { 'changeOrderContactInfoURI': 'http://localhost:8090' + '/sse-orm/rs/v2/order' });
            $provide.value('CommonsHttpUtilsErrorService', fakeMmBUtilsErrorService);

        });
        inject(function ($rootScope, $timeout, _ChangeOrderContactInfoService_) {
            rootScope = $rootScope;
            timeOut = $timeout;
            ChangeOrderContactInfoService = _ChangeOrderContactInfoService_;
        });
    });


    describe('when ChangeOrderContactInfoService resolves the promise', function () {

        beforeEach(inject(function ($q) {
            fakeChangeOrderContactInfoProxy.putGeneric = jasmine.createSpy('putGeneric').and.callFake(function () {
                var defer = $q.defer();
                defer.resolve(mockResponse);
                return defer.promise;
            });

        }));

        it('result should be returned', function (done) {
            ChangeOrderContactInfoService.changeOrderContactInfo().then(function (responseData) {
                rootScope.$apply();//force the promise to be executed before expects
                expect(responseData).toEqual('promesa');
            });
            done();
            rootScope.$digest();

        });
    });


    describe('when ChangeOrderContactInfoProxy rejects the promise with non 401 or 408 errorCode', function () {
        beforeEach(inject(function ($q, $timeout) {
            mockError = {
                'errorCode': 400,
                'data': {
                    'errors': [{ 'reason': 'error' }]
                }
            };
            fakeChangeOrderContactInfoProxy.putGeneric = jasmine.createSpy('putGeneric').and.callFake(function () {
                var defer = $q.defer();
                defer.reject(mockError);
                return defer.promise;
            });
        }));

        it('an error should be returned', function (done) {
            ChangeOrderContactInfoService.changeOrderContactInfo().then({
            }, function (responseError) {
                expect(responseError.message).toEqual('error');
            });
            done();
            rootScope.$digest();
        });

        it('an error should be returned', function (done) {
            mockError.data = '';
            ChangeOrderContactInfoService.changeOrderContactInfo().then({
            }, function (responseError) {
                expect(responseError.message).toEqual('REST_SERVICE_ERROR_GENERAL');
            });
            done();
            rootScope.$digest();
        });
    });

    describe('when ChangeOrderContactInfoProxy rejects the promise with 401 error code', function () {
        beforeEach(inject(function ($q, $timeout) {
            mockError = {
                'errorCode': 401,
                'data': {
                    'errors': [{ 'reason': 'error' }]
                }
            };
            fakeChangeOrderContactInfoProxy.putGeneric = jasmine.createSpy('putGeneric').and.callFake(function () {
                var defer = $q.defer();
                defer.reject(mockError);
                return defer.promise;
            });
        }));

        it('an error should be returned', function (done) {
            ChangeOrderContactInfoService.changeOrderContactInfo().then({
            }, function (responseError) {
                expect(responseError.message).toEqual('error');
                expect(fakeMmBUtilsErrorService.unauthorizedError).toHaveBeenCalledWith(null, null, responseError);
                expect(ChangeOrderContactInfoService.changeOrderContactInfoCallback).toHaveBeenCalled();
                expect(ChangeOrderContactInfoService.returnProcessedError).toHaveBeenCalledWith(responseError);
            });
            done();
            rootScope.$digest();
        });
    });

    describe('when ChangeOrderContactInfoProxy rejects the promise with 408 error code', function () {
        beforeEach(inject(function ($q, $timeout) {
            mockError = {
                'errorCode': 408,
                'data': {
                    'errors': [{ 'reason': 'error' }]
                }
            };
            fakeChangeOrderContactInfoProxy.putGeneric = jasmine.createSpy('putGeneric').and.callFake(function () {
                var defer = $q.defer();
                defer.reject(mockError);
                return defer.promise;
            });
        }));

        it('an error should be returned', function (done) {
            ChangeOrderContactInfoService.changeOrderContactInfo().then({
            }, function (responseError) {
                expect(responseError.message).toEqual('error');
                expect(fakeMmBUtilsErrorService.timeOutError).toHaveBeenCalledWith(null, null, responseError);
                expect(ChangeOrderContactInfoService.changeOrderContactInfoCallback).toHaveBeenCalled();
                expect(ChangeOrderContactInfoService.returnProcessedError).toHaveBeenCalledWith(responseError);
            });
            done();
            rootScope.$digest();
        });
    });
});