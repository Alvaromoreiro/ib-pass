describe('InvoiceDuplicateService Test', () => {
    var InvoiceDuplicateService, localStorageService, mockError, $q, rootScope;

    var mockResponse = { data: 'response' };

    var fakeFlowId = 'TWFuYWdlTXlCb29raW5nQElCNDg0YmI3YjQ5OTBkNDI4Zjg5Y2MyY2Y4NGExYTkzMDM%3D';

    var fakeRequestBody = {
        ticketsNumber: "0751415064667",
        email: "mailreserva@mail.com"
    };

    var fakeCommonsNewHttpUtilsErrorService = {
        controlError: jasmine.createSpy('controlError').and.callFake((error) => {
            return error;
        })
    };

    var fakeCommonsGenericProxy = {
        'postGeneric': jasmine.createSpy()
    };

    var fakeMmBAppConstants = {
        invoicesDuplicateURI: '/ivm-ivs/rs/v1/invoice/duplicate/{flowId}'
    };

    beforeEach(() => {
        angular.mock.module('LocalStorageModule', 'ib-MmB-services-module', ($provide) => {
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
            $provide.value('CommonsGenericProxy', fakeCommonsGenericProxy);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
        });
        inject(($rootScope, _InvoiceDuplicateService_, _$q_, _localStorageService_) => {
            InvoiceDuplicateService = _InvoiceDuplicateService_;
            localStorageService = _localStorageService_;
            rootScope = $rootScope;
            $q = _$q_;
        });
    });

    describe('when InvoiceDuplicateService Proxy resolves the promise', function () {
        beforeEach(inject(function ($q) {
            fakeCommonsGenericProxy.postGeneric = jasmine.createSpy('postGeneric').and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve(mockResponse);
                return deferred.promise;
            });
        }));

        it('InvoiceDuplicateService should resolve the promise', function (done) {
            InvoiceDuplicateService.sendInvoiceDuplicate(fakeFlowId, fakeRequestBody).then(function (responseData) {
                expect(responseData).toEqual(mockResponse.data);
                done();
            }, angular.noop);
            rootScope.$digest();
        })
    });

    describe('when InvoiceDuplicateService Proxy rejects the promise ', function () {
        beforeEach(inject(function ($q) {
            fakeCommonsGenericProxy.postGeneric = jasmine.createSpy('postGeneric').and.callFake(function () {
                var deferred = $q.defer();
                deferred.reject(mockError);
                return deferred.promise;
            });
        }));

        it('with 400 error code, should be returned error data', function (done) {
            mockError = { 'errorCode': 400, 'data': { 'errors': [{ 'reason': 'com.ib.framework.error.PAC_UTILS_E0005' }] } };
            InvoiceDuplicateService.sendInvoiceDuplicate(fakeFlowId, fakeRequestBody).then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(400);
            });
            rootScope.$digest();
            done();
        });

        it('with 404 error code, should be returned error data', function (done) {
            mockError = { 'errorCode': 404, 'data': { 'errors': [{ 'reason': 'com.ib.framework.error.IVM_IVS_0019' }] } };
            InvoiceDuplicateService.sendInvoiceDuplicate(fakeFlowId, fakeRequestBody).then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(404);
            });
            rootScope.$digest();
            done();
        });

        it('and fail promise, 500 error', () => {
            mockError = { 'errorCode': 500, 'data': { 'errors': [{ 'reason': 'error' }] } };
            InvoiceDuplicateService.sendInvoiceDuplicate(fakeFlowId, fakeRequestBody).then(angular.noop, (responseData) => {
                expect(responseData.errorCode).toEqual(500);
            });

            rootScope.$digest();
        });
    });

});
