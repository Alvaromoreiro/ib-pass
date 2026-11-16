describe('ShuttleAvailabilityService Test', () => {
    let ShuttleAvailabilityService, $rootScope, $q;
    let fakeCommonsGenericProxy = {
        postGeneric: jasmine.createSpy('postGeneric').and.callFake(() => {
            var deferred = $q.defer();
            deferred.resolve(mockResponse);
            return deferred.promise;
        })
    };
    let fakeMmBAppConstants = { 'shuttleAvailabilityURI': 'URI' };
    let fakeCommonsNewHttpUtilsErrorService = {
        controlError: jasmine.createSpy('controlError').and.callFake((error) => {
            return error;
        }),
        timeOutError: jasmine.createSpy(),
        unauthorizedError: jasmine.createSpy(),
        processGeneralError: jasmine.createSpy(),
    };

    let mockResponse = {
        data: 'test'
    }

    beforeEach(() => {
        angular.mock.module('ib-Mmb-change-flight-module', ($provide) => {
            $provide.value('CommonsGenericProxy', fakeCommonsGenericProxy);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
        });
        inject((_ShuttleAvailabilityService_, _$q_) => {
            ShuttleAvailabilityService = _ShuttleAvailabilityService_;
            $q = _$q_;
        });
    });

    describe('When getShuttleAvailability() is called', () => {
        beforeEach(inject(($q) => {
            fakeCommonsGenericProxy.postGeneric = jasmine.createSpy('postGeneric').and.callFake(() => {
                var deferred = $q.defer();
                deferred.resolve(mockResponse);
                return deferred.promise;
            });
        }));
        it('and resolve promise,should be return data transformed', (done) => {
            ShuttleAvailabilityService.getShuttleAvailability({}).then((responseData) => {
                expect(responseData).toEqual(mockResponse.data);
            });
            done();
        });
    });

    describe('When getShuttleAvailability() reject promise', () => {
        beforeEach(inject(($q) => {
            let mockError = { 'errorCode': 400, 'data': { 'errors': [{ 'reason': 'error' }] } };
            fakeCommonsGenericProxy.postGeneric = jasmine.createSpy('postGeneric').and.callFake(() => {
                var deferred = $q.defer();
                deferred.reject(mockError);
                return deferred.promise;
            });
        }));
        it('with 400 errorCode, should be returned errorObject', (done) => {
            ShuttleAvailabilityService.getShuttleAvailability({}).then((responseData) => {
                expect(responseData.errorCode).toEqual(400);
            });
            done();
        });
    });
});
