describe('MmBEndpointsService Test', () => {

    let localStorageService, rootScope, MmBEndpointsService, mockError, $q;
    let mockResponse = { data: 'promesa' }

    let fakeCommonsGenericProxy = { getGeneric: jasmine.createSpy() };

    let fakeCommonsNewHttpUtilsErrorService = {
        controlError: jasmine.createSpy('controlError').and.callFake((error) => {
            return error;
        })
    };
    let fakeMmBAppConstants = {endpointsServiceURI: 'test'};

    beforeEach(function () {
        angular.mock.module('ib-MmB-services-module', 'LocalStorageModule','ngCookies', function ($provide) {
            $provide.value('CommonsGenericProxy', fakeCommonsGenericProxy);
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
        });
        inject(function (_MmBEndpointsService_, $rootScope, _localStorageService_, _$q_) {
            MmBEndpointsService = _MmBEndpointsService_;
            rootScope = $rootScope;
            localStorageService = _localStorageService_;
            $q = _$q_;
        });
    });

    describe('when Proxy resolves the promise', () =>  {
        beforeEach(inject(function ($q) {
            fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(() =>  {
                var deferred = $q.defer();
                deferred.resolve(mockResponse);
                return deferred.promise;
            });
        }));
        it('Prefixes are not in localstorage', (done) => {
            MmBEndpointsService.getEndpoints().then((responseData) => {
                expect(responseData).toEqual(mockResponse);
            });
            rootScope.$digest();
            done();
        });
    });
    describe('when Proxy rejects the promise', () => {
        it('with error code 408, should be returned error data', (done) => {
            inject(() => {
                let mockError = { 'errorCode': 408, 'data': { 'errors': [{ 'reason': 'error' }] } };
                fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(() => {
                    var deferred = $q.defer();
                    deferred.reject(mockError);
                    return deferred.promise;
                });
            });
            MmBEndpointsService.getEndpoints().then(angular.noop, (responseError) => {
                expect(responseError.errorCode).toEqual(408);
            });
            rootScope.$digest();
            done();
        });

        it('with error code 401, should be returned error data', (done) => {
            inject(() => {
                let mockError = { 'errorCode': 401, 'data': { 'errors': [{ 'reason': 'error' }] } };
                fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(() => {
                    var deferred = $q.defer();
                    deferred.reject(mockError);
                    return deferred.promise;
                });
            });

            MmBEndpointsService.getEndpoints().then(angular.noop, (responseError) => {
                expect(responseError.errorCode).toEqual(401);
            });
            rootScope.$digest();
            done();
        });

        it('with non error code 401 or 408, should be returned procesed error data', (done) => {
            inject(() => {
                let mockError = { 'errorCode': 400, 'data': { 'errors': [{ 'reason': 'error' }] } };
                fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(() => {
                    var deferred = $q.defer();
                    deferred.reject(mockError);
                    return deferred.promise;
                });
            });

            MmBEndpointsService.getEndpoints().then(angular.noop, (responseError) => {
                expect(responseError.errorCode).toEqual(400);
            });
            rootScope.$digest();
            done();
        });
    });
});
