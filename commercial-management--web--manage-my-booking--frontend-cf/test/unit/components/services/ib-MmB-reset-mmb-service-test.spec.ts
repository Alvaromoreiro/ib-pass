describe('ResetMmbService Test', () => {
    let ResetMmbService, localStorageService, mockError, $q, rootScope;

    let mockResponse = { data: 'response' };

    let fakeFlowId = 'TWFuYWdlTXlCb29raW5nQElCNDg0YmI3YjQ5OTBkNDI4Zjg5Y2MyY2Y4NGExYTkzMDM%3D';

    let fakeCommonsNewHttpUtilsErrorService = {
        controlError: jasmine.createSpy('controlError').and.callFake((error) => {
            return error;
        })
    };

    let fakeCommonsGenericProxy = {
        'deleteGeneric': jasmine.createSpy()
    };

    let fakeMmBAppConstants = {
        resetMmbURI: '/sse-avm/rs/v2/reshop-fare/resetmmb/{flowId}'
    };

    beforeEach(() => {
        angular.mock.module('LocalStorageModule', 'ib-MmB-services-module', ($provide) => {
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
            $provide.value('CommonsGenericProxy', fakeCommonsGenericProxy);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
        });
        inject(($rootScope, _ResetMmbService_, _$q_, _localStorageService_) => {
            ResetMmbService = _ResetMmbService_;
            localStorageService = _localStorageService_;
            rootScope = $rootScope;
            $q = _$q_;
        });
    });

    describe('when ResetMmbService Proxy resolves the promise', function () {
        beforeEach(inject(function ($q) {
            fakeCommonsGenericProxy.deleteGeneric = jasmine.createSpy('deleteGeneric').and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve(mockResponse);
                return deferred.promise;
            });
            localStorageService.set('flowId', fakeFlowId);
        }));

        it('ResetMmbService should resolve the promise', function (done) {
            ResetMmbService.deleteVolatileOffers().then(function (responseData) {
                expect(responseData).toEqual(mockResponse.data);
                done();
            }, angular.noop);
            rootScope.$digest();
        })
    });

    describe('when ResetMmbService Proxy rejects the promise ', function () {
        beforeEach(inject(function ($q) {
            fakeCommonsGenericProxy.deleteGeneric = jasmine.createSpy('deleteGeneric').and.callFake(function () {
                var deferred = $q.defer();
                deferred.reject(mockError);
                return deferred.promise;
            });
        }));

        it('with 400 error code, should be returned error data', function (done) {
            mockError = { 'errorCode': 400, 'data': { 'errors': [{ 'reason': 'test' }] } };
            ResetMmbService.deleteVolatileOffers().then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(400);
            });
            rootScope.$digest();
            done();
        });
    });
});
