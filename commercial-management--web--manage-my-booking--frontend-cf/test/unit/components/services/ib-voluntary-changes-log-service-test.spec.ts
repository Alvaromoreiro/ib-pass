describe('VoluntaryChangesLogService Test', () => {
    var VoluntaryChangesLogService, localStorageService, mockError, $q, rootScope;
    var mockResponse = {
        data: {
            fareFamilyConditions: {
                test: 1,
                testdos: 2
            }
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
    var fakeMmBModalService = {
        'showWaitingModal': jasmine.createSpy('showWaitingModal'),
        'finishWaiting' : jasmine.createSpy('finishWaiting')
    }
    var fakeMmBAppConstants = {
        voluntaryChangesLogURI: '/sse-avm/rs/v3/test'

    }
    beforeEach(() => {
        angular.mock.module('LocalStorageModule', 'ib-MmB-services-module', ($provide) => {
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
            $provide.value('CommonsGenericProxy', fakeCommonsGenericProxy);
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
        });
        inject(($rootScope, _VoluntaryChangesLogService_, _$q_, _localStorageService_) => {
            VoluntaryChangesLogService = _VoluntaryChangesLogService_;
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
            VoluntaryChangesLogService.getVoluntaryChangesLog().then((responseData) => {
                expect(responseData).toEqual(mockResponse.data);
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
            VoluntaryChangesLogService.getVoluntaryChangesLog().then(angular.noop, (responseData) => {
                expect(responseData.errorCode).toEqual(408);
            });
            rootScope.$digest();
        });
    });
});
