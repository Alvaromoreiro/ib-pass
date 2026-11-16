describe('InvoiceInformationService Test', () => {
    var InvoiceInformationService, localStorageService, mockError, $q, rootScope;

    var mockResponse = { data: 'response' };

    var fakeFlowId = 'TWFuYWdlTXlCb29raW5nQElCNDg0YmI3YjQ5OTBkNDI4Zjg5Y2MyY2Y4NGExYTkzMDM%3D';

    var fakeLang = 'ES';

    var fakeMarket = 'ES';

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
        invoicesProvinceURI: '/rdu-loc/rs/loc/v3/onb/location/onb-states/{flowId}'
    };

    beforeEach(() => {
        angular.mock.module('LocalStorageModule', 'ib-MmB-invoice-information-module', ($provide) => {
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
            $provide.value('CommonsGenericProxy', fakeCommonsGenericProxy);
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('MmBAppConstants', fakeMmBAppConstants);
        });
        inject(($rootScope, _InvoiceInformationService_, _$q_, _localStorageService_) => {
            InvoiceInformationService = _InvoiceInformationService_;
            localStorageService = _localStorageService_;
            rootScope = $rootScope;
            $q = _$q_;
        });
    });

    describe('when getProvinceByCountry Proxy resolves the promise', function () {
        beforeEach(inject(function ($q) {
            fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve(mockResponse);
                return deferred.promise;
            });
        }));

        it('getProvinceByCountry should resolve the promise', function (done) {
            InvoiceInformationService.getProvinceByCountry(fakeLang, fakeMarket, fakeFlowId).then(function (responseData) {
                expect(responseData).toEqual(mockResponse.data);
                done();
            }, angular.noop);
            rootScope.$digest();
        })
    });

    describe('when getProvinceByCountry Proxy rejects the promise ', function () {
        beforeEach(inject(function ($q) {
            fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(function () {
                var deferred = $q.defer();
                deferred.reject(mockError);
                return deferred.promise;
            });
        }));

        it('with 404 error code, should be returned error data', function (done) {
            mockError = { 'errorCode': 404, 'data': { 'errors': [{ 'reason': 'error' }] } };
            InvoiceInformationService.getProvinceByCountry(fakeLang, fakeMarket, fakeFlowId).then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(404);
            });
            rootScope.$digest();
            done();
        });
    });

    describe('when getListOfCountries Proxy resolves the promise', function () {
        beforeEach(inject(function ($q) {
            fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve(mockResponse);
                return deferred.promise;
            });
        }));

        it('getListOfCountries should resolve the promise', function (done) {
            InvoiceInformationService.getListOfCountries(fakeLang, fakeMarket).then(function (responseData) {
                expect(responseData).toEqual(mockResponse.data);
                done();
            }, angular.noop);
            rootScope.$digest();
        })
    });

    describe('when getListOfCountries Proxy rejects the promise ', function () {
        beforeEach(inject(function ($q) {
            fakeCommonsGenericProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(function () {
                var deferred = $q.defer();
                deferred.reject(mockError);
                return deferred.promise;
            });
        }));

        it('with 404 error code, should be returned error data', function (done) {
            mockError = { 'errorCode': 404, 'data': { 'errors': [{ 'reason': 'error' }] } };
            InvoiceInformationService.getListOfCountries(fakeLang, fakeMarket).then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(404);
            });
            rootScope.$digest();
            done();
        });
    });

});
