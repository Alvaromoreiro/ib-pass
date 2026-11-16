describe('WcsJsessionCleanService Test', () => {
    var WcsJsessionCleanService, localStorageService, mockError, $q, rootScope;
    var mockResponse = {
        data: {
            test: 1,
            testdos: 2
        }
    }

    var fakeCommonsNewHttpUtilsErrorService = {
        controlError: jasmine.createSpy('controlError').and.callFake((error) => {
            return error;
        })
    }
    var fakeCommonsGenericProxy = {
        'getGeneric': jasmine.createSpy()
    };
    var fakeMmBAppConstants = {
        HttpServices: {
            WCS_URIS: {
                JSESSIONCLEAN: '/sse-avm/rs/v3/test'
            }
        }
    }
    beforeEach(() => {
        angular.mock.module('LocalStorageModule', 'ib-MmB-services-module', ($provide) => {
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
            $provide.value('CommonsGenericProxy', fakeCommonsGenericProxy);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
        });
        inject(($rootScope, _WcsJsessionCleanService_, _$q_, _localStorageService_) => {
            WcsJsessionCleanService = _WcsJsessionCleanService_;
            localStorageService = _localStorageService_;
            rootScope = $rootScope;
            $q = _$q_;
        });
    });
    describe('when getAvailability() is called', () => {
        beforeEach(inject(($q) => {
            fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(() => {
                var deferred = $q.defer();
                deferred.resolve(mockResponse);
                return deferred.promise;
            });
        }));
        it('and resolve promise, should return data', (done) => {
            WcsJsessionCleanService.getJsessionClean().then((responseData) => {
                expect(responseData).toEqual(mockResponse);
                done();
            }, angular.noop);
            rootScope.$digest();
        });
    });
    describe('when getAvailability() is called', () => {
        beforeEach(inject(($q) => {
            fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(() => {
                var deferred = $q.defer();
                deferred.reject(mockError);
                return deferred.promise;
            });
        }));
        it('and fail promise', () => {
            mockError = { 'errorCode': 408, 'data': { 'errors': [{ 'reason': 'error' }] } };
            WcsJsessionCleanService.getJsessionClean().then(angular.noop, (responseData) => {
                expect(responseData.errorCode).toEqual(408);
            });
            rootScope.$digest();
        });
    });
});
