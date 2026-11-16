describe('VoluntaryChangesService Test', () => {
    var VoluntaryChangesService, localStorageService, mockError, $q, rootScope;
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
        'postGeneric': jasmine.createSpy()
    };
    var fakeMmBModalService = {
        'showWaitingModal': jasmine.createSpy('showWaitingModal'),
        'finishWaiting' : jasmine.createSpy('finishWaiting')
    }
    var fakeMmBAppConstants = {
        reshopAvailabilityURI: '/sse-avm/rs/v3/test'

    }
    beforeEach(() => {
        angular.mock.module('LocalStorageModule', 'ib-MmB-services-module', ($provide) => {
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
            $provide.value('CommonsGenericProxy', fakeCommonsGenericProxy);
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
        });
        inject(($rootScope, _VoluntaryChangesService_, _$q_, _localStorageService_) => {
            VoluntaryChangesService = _VoluntaryChangesService_;
            localStorageService = _localStorageService_;
            rootScope = $rootScope;
            $q = _$q_;
        });
    });
    describe('when getAvailability() is called', () => {
        beforeEach(inject(($q) => {
            fakeCommonsGenericProxy.postGeneric = jasmine.createSpy('postGeneric').and.callFake(() => {
                var deferred = $q.defer();
                deferred.resolve(mockResponse);
                return deferred.promise;
            });
        }));
        it('and resolve promise, should return data', (done) => {
            VoluntaryChangesService.getAvailability().then((responseData) => {
                expect(responseData).toEqual(mockResponse.data);
                done();
            }, angular.noop);
            rootScope.$digest();
        });
    });
    describe('when getAvailability() is called', () => {
        beforeEach(inject(($q) => {
            fakeCommonsGenericProxy.postGeneric = jasmine.createSpy('postGeneric').and.callFake(() => {
                var deferred = $q.defer();
                deferred.reject(mockError);
                return deferred.promise;
            });
        }));
        it('and fail promise', () => {
            mockError = { 'errorCode': 408, 'data': { 'errors': [{ 'reason': 'error' }] } };
            VoluntaryChangesService.getAvailability().then(angular.noop, (responseData) => {
                expect(responseData.errorCode).toEqual(408);
            });
            rootScope.$digest();
        });
    });
});
