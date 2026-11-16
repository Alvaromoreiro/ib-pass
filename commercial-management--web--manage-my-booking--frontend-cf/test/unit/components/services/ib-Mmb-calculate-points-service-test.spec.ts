describe('CalculatePointsService Test', () => {
    let CalculatePointsService, $q, $timeout, rootScope;
    let mockResponse = {data: 'test'};

    let fakeMbmAppConstants = {
        'calculatePoints' : '/prlm-pc/rs/v1/calculatePoints'
    }

    let fakeCommonsNewHttpUtilsErrorService = {
        'controlError': jasmine.createSpy('controlError').and.callFake((error) => {
            return error;
        })
    }
    let fakeCommonsGenericProxy = {
        postGeneric: jasmine.createSpy()
    };
    beforeEach(() => {
        angular.mock.module('LocalStorageModule', 'ib-MmB-services-module', ($provide) => {
            $provide.value('CommonsGenericProxy', fakeCommonsGenericProxy);
            $provide.value('MmBAppConstants', fakeMbmAppConstants);
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
        });

        inject(($rootScope, _CalculatePointsService_, _$q_, _$timeout_) => {
            CalculatePointsService = _CalculatePointsService_;
            rootScope = $rootScope;
            $timeout = _$timeout_;
            $q = _$q_;
        });
    });

    describe('when getCalculatePoints() is called', () => {
        it('and resolve promise, should return data', (done) => {
            inject(() => {
                fakeCommonsGenericProxy.postGeneric = jasmine.createSpy('postGeneric').and.callFake(() => {
                    let deferred = $q.defer();
                    deferred.resolve(mockResponse);
                    return deferred.promise;
                });
            });
            CalculatePointsService.getCalculatePoints().then((responseData) => {
                expect(responseData).toEqual(mockResponse.data);
            }, angular.noop);

            rootScope.$digest();
            done();
        });
    });
    describe('when getCalculatePoints() is called', () => {
        it('and fail promise, 408 error', (done) => {
            let mockError = { 'errorCode': 408, 'data': { 'errors': [{ 'reason': 'error' }] } };
            fakeCommonsGenericProxy.postGeneric = jasmine.createSpy('postGeneric').and.callFake(() => {
                let deferred = $q.defer();
                deferred.reject(mockError);
                return deferred.promise;
            })
            CalculatePointsService.getCalculatePoints().then(angular.noop, (responseData) => {
                    expect(responseData.errorCode).toEqual(408);
                }, angular.noop);
            $timeout.flush();
            rootScope.$digest();
            done();
        });
        it('and fail promise, 401 error', (done) => {
            let mockError = { 'errorCode': 401, 'data': { 'errors': [{ 'reason': 'error' }] } };
            fakeCommonsGenericProxy.postGeneric = jasmine.createSpy('postGeneric').and.callFake(() => {
                let deferred = $q.defer();
                deferred.reject(mockError);
                return deferred.promise;
            })
            CalculatePointsService.getCalculatePoints().then(angular.noop, (responseData) => {
                    expect(responseData.errorCode).toEqual(401);
                }, angular.noop);
            $timeout.flush();
            rootScope.$digest();
            done();
        });
        it('and fail promise, 400 error', (done) => {
            let mockError = { 'errorCode': 400, 'data': { 'errors': [{ 'reason': 'error' }] } };
            fakeCommonsGenericProxy.postGeneric = jasmine.createSpy('postGeneric').and.callFake(() => {
                let deferred = $q.defer();
                deferred.reject(mockError);
                return deferred.promise;
            })
            CalculatePointsService.getCalculatePoints().then(angular.noop, (responseData) => {
                    expect(responseData.errorCode).toEqual(400);
                }, angular.noop);
            $timeout.flush();
            rootScope.$digest();
            done();
        });
    });
});
