describe('RebookService Test', () => {
    var mockResponse = {data: 'test'};

    var RebookService, rootScope, $q, mockError;

    var fakeCommonsGenericProxy = {
        postGeneric: jasmine.createSpy()
    };
    var fakeCommonsNewHttpUtilsErrorService = {
        'controlError': jasmine.createSpy('controlError').and.callFake((error) => {
            return error;
        })
    };

    var fakeMmBAppConstants = {
        rebookURI: 'test'
    }

    beforeEach(() => {
        angular.mock.module('ib-MmB-services-module', ($provide) => {
            $provide.value('CommonsGenericProxy', fakeCommonsGenericProxy);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);

        });
        inject(($rootScope, _RebookService_, _$q_) => {
            RebookService = _RebookService_;
            rootScope = $rootScope;
            $q = _$q_;
        });
    });

    describe('when rebook() is called and resolve', () => {
        beforeEach(inject(($q) => {
            fakeCommonsGenericProxy.postGeneric = jasmine.createSpy('postGeneric').and.callFake(() => {
                var deferred = $q.defer();
                deferred.resolve(mockResponse);
                return deferred.promise;
            });
        }));
        it('and resolve promise, should return data', (done) => {
            RebookService.rebook().then((responseData) => {
                expect(responseData).toEqual(mockResponse.data);
                done();
            }, angular.noop);
            rootScope.$digest();
        });
    });
    describe('when rebook() is called and reject', () => {
        beforeEach(inject(($q) => {
            fakeCommonsGenericProxy.postGeneric = jasmine.createSpy('postGeneric').and.callFake(() => {
                var deferred = $q.defer();
                deferred.reject(mockError);
                return deferred.promise;
            });
        }));

        it('and fail promise, 400 error', () => {
            mockError = { 'errorCode': 400, 'data': { 'errors': [{ 'reason': 'error' }] } };
            RebookService.rebook().then(angular.noop, (responseData) => {
                expect(responseData.errorCode).toEqual(400);
            });
            rootScope.$digest();
        });

        it('and fail promise, 401 error', () => {
            mockError = { 'errorCode': 401, 'data': { 'errors': [{ 'reason': 'error' }] } };
            RebookService.rebook().then(angular.noop, (responseData) => {
                expect(responseData.errorCode).toEqual(401);
            });
            rootScope.$digest();
        });

        it('and fail promise, 408 error', () => {
            mockError = { 'errorCode': 408, 'data': { 'errors': [{ 'reason': 'error' }] } };
            RebookService.rebook().then(angular.noop, (responseData) => {
                expect(responseData.errorCode).toEqual(408);
            });
            rootScope.$digest();
        });

        it('and fail promise, 500 error', () => {
            mockError = { 'errorCode': 500, 'data': { 'errors': [{ 'reason': 'error' }] } };
            RebookService.rebook().then(angular.noop, (responseData) => {
                expect(responseData.errorCode).toEqual(500);
            }, angular.noop);
            rootScope.$digest();
        });

        it('and fail promise, 505 error', () => {
            mockError = { 'errorCode': 505, 'data': { 'errors': [{ 'reason': 'error' }] } };
            RebookService.rebook().then(angular.noop, (responseData) => {
                expect(responseData.errorCode).toEqual(505);
            }, angular.noop);
            rootScope.$digest();
        });
    });
});
