describe('AttendanceVoucherService Test', () => {

    let localStorageService, rootScope, AttendanceVoucherService, mockError, $q;
    let mockResponse = { data: 'promesa' }

    let fakeCommonsGenericProxy = { postGeneric: jasmine.createSpy() };

    let fakeCommonsNewHttpUtilsErrorService = {
        controlError: jasmine.createSpy('controlError').and.callFake((error) => {
            return error;
        })
    };
    let fakeMmBAppConstants = {DEFAULT_ENDPOINTS: {attendanceVoucherStatusURI: 'test'}};

    beforeEach(function () {
        angular.mock.module('ib-MmB-services-module', 'LocalStorageModule', function ($provide) {
            $provide.value('CommonsGenericProxy', fakeCommonsGenericProxy);
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
        });
        inject(function (_AttendanceVoucherService_, $rootScope, _localStorageService_, _$q_) {
            AttendanceVoucherService = _AttendanceVoucherService_;
            rootScope = $rootScope;
            localStorageService = _localStorageService_;
            $q = _$q_;
        });
    });

    describe('when Proxy resolves the promise', () =>  {
        beforeEach(inject(function ($q) {
            fakeCommonsGenericProxy.postGeneric = jasmine.createSpy('postGeneric').and.callFake(() =>  {
                var deferred = $q.defer();
                deferred.resolve(mockResponse);
                return deferred.promise;
            });
        }));
        it('Prefixes are not in localstorage', (done) => {
            AttendanceVoucherService.getAttendanceVoucher().then((responseData) => {
                expect(responseData).toEqual(mockResponse.data);
            });
            rootScope.$digest();
            done();
        });
    });
    describe('when Proxy rejects the promise', () => {
        it('with error code 408, should be returned error data', (done) => {
            inject(() => {
                fakeCommonsGenericProxy.postGeneric = jasmine.createSpy('postGeneric').and.callFake(() => {
                    var deferred = $q.defer();
                    deferred.reject(mockError);
                    return deferred.promise;
                });
            });
            mockError = { 'errorCode': 408, 'data': { 'errors': [{ 'reason': 'error' }] } };
            AttendanceVoucherService.getAttendanceVoucher().then((responseError) => {
                expect(responseError.errorCode).toEqual(408);
            });
            rootScope.$digest();
            done();
        });

        it('with error code 401, should be returned error data', (done) => {
            inject(() => {
                fakeCommonsGenericProxy.postGeneric = jasmine.createSpy('postGeneric').and.callFake(() => {
                    var deferred = $q.defer();
                    deferred.reject(mockError);
                    return deferred.promise;
                });
            });
            mockError = { 'errorCode': 401, 'data': { 'errors': [{ 'reason': 'error' }] } };
            AttendanceVoucherService.getAttendanceVoucher().then((responseError) => {
                expect(responseError.errorCode).toEqual(401);
            });
            rootScope.$digest();
            done();
        });

        it('with non error code 401 or 408, should be returned procesed error data', (done) => {
            inject(() => {
                fakeCommonsGenericProxy.postGeneric = jasmine.createSpy('postGeneric').and.callFake(() => {
                    var deferred = $q.defer();
                    deferred.reject(mockError);
                    return deferred.promise;
                });
            });
            mockError = { 'errorCode': 400, 'data': { 'errors': [{ 'reason': 'error' }] } };
            AttendanceVoucherService.getAttendanceVoucher().then((responseError) => {
                expect(responseError.errorCode).toEqual(400);
            });
            rootScope.$digest();
            done();
        });
    });

    describe('when mockAttendanceVoucher resolve the promise', () => {
        it('resolve promise', (done) => {
            AttendanceVoucherService.mockAttendanceVoucher().then((responseData) => {
                expect(responseData).toEqual({
                    'locator': 'JCH21',
                    'surname': 'abreu',
                    'flight': {
                        'operationalCompany': 'IB',
                        'number' : '3939',
                        'departureTime': 'xxxxx'
                    },
                    'voucher': [
                        {
                            'id': '2771341',
                            'voucherType': 'RESTAURANT',
                            'actions': [],
                            'additionalInfo': [{
                                'infoType': 'BOARDING'
                            }],
                            'url': 'https://inci.iberia.com/QSP/client/general-info/interesting-points/'
                        },
                        {
                            'id': '2771341',
                            'voucherType': 'ACCOMODATION',
                            'actions': [{'actionType': 'DOWNLOAD'},{'actionType': 'EMAIL'}],
                            'additionalInfo': [],
                            'url': 'https://www2.melia.com/meliapro/es/landing/iberia/vouchers.html'
                        }
                ]
                });
            });
            rootScope.$digest();
            done();
        });
    });

});
