describe('ReshopConditionsService Test', function () {

    var rootScope, ReshopConditionsService, localStorageService;
    var mockResponse = { data: 'promise' }

    var fakeReshopConditionsProxy = {
        getGeneric: jasmine.createSpy()
    };

    var fakeFlowID = 'TWFuYWdlTXlCb29raW5nQElCOTJlNmJjZTQ4MTViNDFiM2IxODI0MzJjZjE2OTZiOWM%3D';
    var fakeURI = '/sse-orm/rs/v2/mmb/{flowID}/reshop-conditions';

    var fakeCommonsNewHttpUtilsErrorService = {
        controlError: jasmine.createSpy('controlError').and.callFake(function (error) {
            return error;
        })
    };

    beforeEach(function () {
        angular.mock.module('ib-MmB-services-module', 'LocalStorageModule', function ($provide) {
            $provide.value('CommonsGenericProxy', fakeReshopConditionsProxy);
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
            $provide.value('MmBAppConstants', {
                DEFAULT_ENDPOINTS: {
                    reshopConditionsServiceURIV2: '/sse-orm/rs/v2/mmb/{flowId}/reshop-conditions',
                }
            });
        });
        inject(function (_ReshopConditionsService_, $rootScope, _localStorageService_) {
            ReshopConditionsService = _ReshopConditionsService_;
            rootScope = $rootScope;
            localStorageService = _localStorageService_;
        });
    });

    describe('When ReshopConditionsProxy resolves the promise', function () {
        beforeEach(inject(function ($q) {
            fakeReshopConditionsProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve(mockResponse);
                return deferred.promise;
            });
            ReshopConditionsService.generateRequestURI = jasmine.createSpy('generateRequestURI').and.callFake(function (fakeURI, fakeFlowID) {
                fakeURI.replace('{flowId}', fakeFlowID);
                return fakeURI;
            });
        }));

        it('fakeReshopConditionsProxy should resolve the promise on get function', function (done) {
            ReshopConditionsService.getReshopConditions(fakeFlowID).then(function (responseData) {
                expect(responseData).toEqual('promise');
                done();
            });
            rootScope.$digest();
        })
    });

    describe('When ReshopConditionsProxy rejects the promise ', function () {
        var mockError, procesedResponse;

        beforeEach(inject(function ($q) {
            fakeReshopConditionsProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(function () {
                var deferred = $q.defer();
                deferred.reject(mockError);
                return deferred.promise;
            });
        }));

        it('with 400 error code, should be returned error data', function () {
            mockError = { 'errorCode': 400, 'data': { 'errors': [{ 'reason': 'error' }] } };
            procesedResponse = { 'errorCode': 400, 'message': 'error', 'needsTranslate': false, 'internalErrorCode': 'internal_error' };

            ReshopConditionsService.getReshopConditions(fakeFlowID).then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(400);
            });
            rootScope.$digest();
        });

        it('with 401 error code, should be returned error data', function () {
            mockError = { 'errorCode': 401, 'data': { 'errors': [{ 'reason': 'error' }] } };
            ReshopConditionsService.getReshopConditions(fakeFlowID).then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(400);
            });
            rootScope.$digest();
        });

        it('with 408 error code, should be returned error data', function () {
            mockError = { 'errorCode': 408, 'data': { 'errors': [{ 'reason': 'error' }] } };

            ReshopConditionsService.getReshopConditions(fakeFlowID).then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(400);
            });
            rootScope.$digest();
        });

        it('with 500 error code, should be returned error data', function () {
            mockError = { 'errorCode': 500, 'data': { 'errors': [{ 'reason': 'error' }] } };
            ReshopConditionsService.getReshopConditions(fakeFlowID).then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(500);

            });
            rootScope.$digest();
        });

        it('with non 401 or 408 error code,should be returned procesed error', function () {
            mockError = { 'errorCode': 404, 'data': { 'errors': [{ 'reason': 'error' }] } };
            procesedResponse = { 'errorCode': 404, 'message': 'error', 'needsTranslate': false, 'internalErrorCode': 'internal_error' };
            ReshopConditionsService.getReshopConditions(fakeFlowID).then(angular.noop, function (responseError) {
                expect(responseError).toEqual(procesedResponse);

            });
            rootScope.$digest();
        });
    });
});
