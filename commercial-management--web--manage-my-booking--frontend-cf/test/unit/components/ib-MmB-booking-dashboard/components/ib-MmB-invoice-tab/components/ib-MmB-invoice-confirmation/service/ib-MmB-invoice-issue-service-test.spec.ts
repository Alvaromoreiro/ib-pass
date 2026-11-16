describe('InvoiceIssueService Test', () => {
    var InvoiceIssueService, localStorageService, mockError, $q, rootScope;

    var mockResponse = { data: 'response' };

    var fakeFlowId = 'TWFuYWdlTXlCb29raW5nQElCNDg0YmI3YjQ5OTBkNDI4Zjg5Y2MyY2Y4NGExYTkzMDM%3D';

    var fakeCommonsNewHttpUtilsErrorService = {
        controlError: jasmine.createSpy('controlError').and.callFake((error) => {
            return error;
        })
    };

    var fakeCommonsGenericProxy = {
        'postGeneric': jasmine.createSpy()
    };

    var fakeMmBAppConstants = {
        invoicesIssueURI: '/ivm-ivs/rs/v1/invoice/issue/{flowId}'
    };

    var fakeRequestBody = {
      invoiceIssueData: [
        {
          ticketsNumber: [
             "0751415064667",
             "0751415064680"
          ],
          shippingData: {
            language: "ES",
            email: "example@email.com"
          },
          billingData: {
            name: "Antonio",
            surname: "Perez",
            identityInformation: "11111111A",
            address: "address1",
            postalCode: "28001",
            city: "Madrid",
            province: "28",
            country: "ES/0/0"
          }
        }
      ]
    };

    beforeEach(() => {
        angular.mock.module('LocalStorageModule', 'ib-MmB-invoice-confirmation-module', ($provide) => {
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
            $provide.value('CommonsGenericProxy', fakeCommonsGenericProxy);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
        });
        inject(($rootScope, _InvoiceIssueService_, _$q_, _localStorageService_) => {
            InvoiceIssueService = _InvoiceIssueService_;
            localStorageService = _localStorageService_;
            rootScope = $rootScope;
            $q = _$q_;
        });
    });

    describe('when InvoiceIssueService Proxy resolves the promise', function () {
        beforeEach(inject(function ($q) {
            fakeCommonsGenericProxy.postGeneric = jasmine.createSpy('postGeneric').and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve(mockResponse);
                return deferred.promise;
            });
        }));

        it('InvoiceIssueService should resolve the promise', function (done) {
            InvoiceIssueService.addInvoiceIssue(fakeFlowId, fakeRequestBody).then(function (responseData) {
                expect(responseData).toEqual(mockResponse.data);
                done();
            }, angular.noop);
            rootScope.$digest();
        })
    });

    describe('when InvoiceIssueService Proxy rejects the promise ', function () {
        beforeEach(inject(function ($q) {
            fakeCommonsGenericProxy.postGeneric = jasmine.createSpy('postGeneric').and.callFake(function () {
                var deferred = $q.defer();
                deferred.reject(mockError);
                return deferred.promise;
            });
        }));

        it('with 400 error code, should be returned error data', function (done) {
            mockError = { 'errorCode': 400, 'data': { 'errors': [{ 'reason': 'com.ib.framework.error.PAC_UTILS_E0005' }] } };
            InvoiceIssueService.addInvoiceIssue(fakeFlowId, fakeRequestBody).then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(400);
            });
            rootScope.$digest();
            done();
        });

        it('with 404 error code, should be returned error data', function (done) {
            mockError = { 'errorCode': 404, 'data': { 'errors': [{ 'reason': 'com.ib.framework.error.IVM_IVS_0026' }] } };
            InvoiceIssueService.addInvoiceIssue(fakeFlowId, fakeRequestBody).then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(404);
            });
            rootScope.$digest();
            done();
        });
    });

});
