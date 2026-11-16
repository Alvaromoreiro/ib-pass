describe('InvoiceListService Test', () => {
    var InvoiceListService, localStorageService, mockError, $q, rootScope;

    var mockResponse = { data: 'response' };

    var fakeFlowId = 'TWFuYWdlTXlCb29raW5nQElCNDg0YmI3YjQ5OTBkNDI4Zjg5Y2MyY2Y4NGExYTkzMDM%3D';

    var fakeCommonsNewHttpUtilsErrorService = {
        controlError: jasmine.createSpy('controlError').and.callFake((error) => {
            return error;
        })
    };

    var fakeCommonsGenericProxy = {
        'getGeneric': jasmine.createSpy()
    };

    var fakeMmBModalService = {
        'showWaitingModal': jasmine.createSpy('showWaitingModal'),
        'finishWaiting' : jasmine.createSpy('finishWaiting')
    };

    var fakeMmBAppConstants = {
        invoicesDetailsURI: '/ivm-ivs/rs/v1/invoice/details/{flowId}'
    };

    beforeEach(() => {
        angular.mock.module('LocalStorageModule', 'ib-MmB-invoice-list-module', ($provide) => {
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
            $provide.value('CommonsGenericProxy', fakeCommonsGenericProxy);
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
        });
        inject(($rootScope, _InvoiceListService_, _$q_, _localStorageService_) => {
            InvoiceListService = _InvoiceListService_;
            localStorageService = _localStorageService_;
            rootScope = $rootScope;
            $q = _$q_;
        });
    });

    describe('when InvoiceListService Proxy resolves the promise', function () {
        beforeEach(inject(function ($q) {
            fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve(mockResponse);
                return deferred.promise;
            });
        }));

        it('InvoiceListService should resolve the promise', function (done) {
            InvoiceListService.getInvoiceList(fakeFlowId).then(function (responseData) {
                expect(responseData).toEqual(mockResponse.data);
                done();
            }, angular.noop);
            rootScope.$digest();
        })
    });

    describe('when InvoiceListService Proxy rejects the promise ', function () {
        beforeEach(inject(function ($q) {
            fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(function () {
                var deferred = $q.defer();
                deferred.reject(mockError);
                return deferred.promise;
            });
        }));

        it('with 404 error code, should be returned error data', function (done) {
            mockError = { 'errorCode': 404, 'data': { 'errors': [{ 'reason': 'error' }] } };
            InvoiceListService.getInvoiceList(fakeFlowId).then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(404);
            });
            rootScope.$digest();
            done();
        });
    });

});
