describe('VoucherInformationService Test', function () {
    var VoucherInformationService, rootScope, $q, mockError;

    var mockResponse = {data: 'test'};

    var fakeCommonsGenericProxy = {
        postGeneric: jasmine.createSpy(),
        putGeneric: jasmine.createSpy()
    };

    var MmBAppConstantsFake = {
        voucherInfoURI: 'test'
    };

    var fakeCommonsNewHttpUtilsErrorService = {
        'controlError': jasmine.createSpy('controlError').and.callFake((error) => {
            return error;
        })
    };

    beforeEach(() => {
        angular.mock.module('ib-MmB-services-module', ($provide) => {
            $provide.value('CommonsGenericProxy', fakeCommonsGenericProxy);
            $provide.value('MmBAppConstants', MmBAppConstantsFake);
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
        });
        inject(($rootScope, _VoucherInformationService_, _$q_) => {
            VoucherInformationService = _VoucherInformationService_;
            rootScope = $rootScope;
            $q = _$q_;
        });
    });

    describe('when getVoucherAmount() is called and resolve', () => {
        beforeEach(inject(($q) => {
            fakeCommonsGenericProxy.postGeneric = jasmine.createSpy('postGeneric').and.callFake(() => {
                var deferred = $q.defer();
                deferred.resolve(mockResponse);
                return deferred.promise;
            });
        }));
        it('and getVoucherAmount resolve promise, should return data', (done) => {
            VoucherInformationService.getVoucherAmount('flowID', {}).then((responseData) => {
                expect(responseData).toEqual(mockResponse.data);
                done();
            }, angular.noop);

            rootScope.$digest();
        });
    });
    describe('when getVoucherConfirmationInfo is called and resolve', () => {
        beforeEach(inject(($q) => {
            fakeCommonsGenericProxy.putGeneric = jasmine.createSpy('putGeneric').and.callFake(() => {
                var deferred = $q.defer();
                deferred.resolve(mockResponse);
                return deferred.promise;
            });
        }));
        it('and getVoucherConfirmationInfo resolve promise, should return data', (done) => {
            VoucherInformationService.getVoucherConfirmationInfo('flowID', {}).then((responseData) => {
                expect(responseData).toEqual(mockResponse.data);
                done();
            }, angular.noop);

            rootScope.$digest();
        });
    });
    describe('when getVoucherAmount() is called and reject', () => {
        beforeEach(inject(($q) => {
            fakeCommonsGenericProxy.postGeneric = jasmine.createSpy('postGeneric').and.callFake(() => {
                var deferred = $q.defer();
                deferred.reject(mockError);
                return deferred.promise;
            });
        }));
        it('and fail promise, 400 error', () => {
            mockError = { 'errorCode': 400, 'data': { 'errors': [{ 'reason': 'error' }] } };
            VoucherInformationService.getVoucherAmount('flowID', {}).then(angular.noop, (responseData) => {
                expect(responseData.errorCode).toEqual(400);
            });
            rootScope.$digest();
        });
    });
    describe('when getVoucherAmount() is called and reject', () => {
        beforeEach(inject(($q) => {
            fakeCommonsGenericProxy.putGeneric = jasmine.createSpy('putGeneric').and.callFake(() => {
                var deferred = $q.defer();
                deferred.reject(mockError);
                return deferred.promise;
            });
        }));

        it('and fail promise, 401 error', () => {
            mockError = { 'errorCode': 401, 'data': { 'errors': [{ 'reason': 'error' }] } };
            VoucherInformationService.getVoucherConfirmationInfo('flowID', {}).then(angular.noop, (responseData) => {
                expect(responseData.errorCode).toEqual(401);
            });

            rootScope.$digest();
        });

        it('and fail promise, 408 error', () => {
            mockError = { 'errorCode': 408, 'data': { 'errors': [{ 'reason': 'error' }] } };
            VoucherInformationService.getVoucherConfirmationInfo('flowID', {}).then(angular.noop, (responseData) => {
                expect(responseData.errorCode).toEqual(408);
            });

            rootScope.$digest();
        });

        it('and fail promise, 500 error', () => {
            mockError = { 'errorCode': 500, 'data': { 'errors': [{ 'reason': 'error' }] } };
            VoucherInformationService.getVoucherConfirmationInfo('flowID', {}).then(angular.noop, (responseData) => {
                expect(responseData.errorCode).toEqual(500);
            });

            rootScope.$digest();
        });

        it('and fail promise, 505 error', () => {
            mockError = { 'errorCode': 505, 'data': { 'errors': [{ 'reason': 'error' }] } };
            VoucherInformationService.getVoucherConfirmationInfo('flowID', {}).then(angular.noop, (responseData) => {
                expect(responseData.errorCode).toEqual(505);
            });

            rootScope.$digest();
        });
    });
});
