describe('CountriesListService Test', function () {

    var localStorageService, rootScope, CountriesListService;

    var fakeCountriesList = [
        {
            'code': 'IE',
            'description': 'Irlanda',
            'isoCode': 'IRL'
        },
        {
            'code': 'AF',
            'description': 'Afganistán',
            'isoCode': 'AFG'
        }
    ]

    var fakeCountriesListProxy = { getGeneric: jasmine.createSpy() };

    var CommonsNewHttpUtilsErrorService = {
        'controlError': jasmine.createSpy('controlError').and.callFake(function (error) {
            return error;
        })
    };

    var fakeMmBUtilsErrorService = {
        processGeneralError: jasmine.createSpy(),
        processGeneralErrorWithProperties: jasmine.createSpy(),
        unauthorizedError: jasmine.createSpy(),
        internalServerError: jasmine.createSpy(),
        customErrorNameCorrection: jasmine.createSpy(),
        timeOutError: jasmine.createSpy(),
    };

    beforeEach(function () {
        angular.mock.module('ib-MmB-services-module', 'LocalStorageModule', function ($provide) {
            $provide.value('CommonsGenericProxy', fakeCountriesListProxy);
            $provide.value('CommonsNewHttpUtilsErrorService', CommonsNewHttpUtilsErrorService);
            $provide.value('MmBAppConstants', {});
            $provide.value('MmBUtilsErrorService', fakeMmBUtilsErrorService);
        });
        inject(function (_CountriesListService_, $rootScope, _localStorageService_) {
            CountriesListService = _CountriesListService_;
            rootScope = $rootScope;
            localStorageService = _localStorageService_;
        });
    });

    describe('when CountriesList Proxy resolves the promise', function () {
        beforeEach(inject(function ($q) {
            fakeCountriesListProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(function () {
                var deferred = $q.defer();
                deferred.resolve(fakeCountriesList);
                return deferred.promise;
            });
            localStorageService.set('countriesList', fakeCountriesList)
        }));

        xit('CountriesListProxy should resolve the promise', function (done) {
            CountriesListService.getGeneric().then(function (responseData) {
                expect(responseData).toEqual(fakeCountriesList);
                done();
            });
            rootScope.$digest();
        })

        it('CountriesListProxy should resolve the promise and countriesList is null', function (done) {
            localStorageService.set('countriesList', null)
            CountriesListService.getCountriesList().then(function (responseData) {
                responseData = fakeCountriesList;
                expect(responseData).toEqual(fakeCountriesList);
                done();
            });
            rootScope.$digest();
        })
    });

    describe('when CountriesList Proxy rejects the promise ', function () {
        var mockError, procesedResponse;

        beforeEach(inject(function ($q) {
            fakeMmBUtilsErrorService.processGeneralErrorWithProperties = jasmine.createSpy('processGeneralErrorWithProperties').and.callFake(function (error) {
                return procesedResponse;
            });
            fakeCountriesListProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(function () {
                var deferred = $q.defer();
                deferred.reject(mockError);
                return deferred.promise;
            });
            localStorageService.set('countriesList', null)
        }));

        it('with 401 error code, should be returned error data', function () {
            mockError = { 'errorCode': 401, 'data': { 'errors': [{ 'reason': 'error' }] } };
            inject(function ($q) {
                fakeMmBUtilsErrorService.unauthorizedError = jasmine.createSpy('unauthorizedError').and.callFake(function (attempts, callback, errors) {
                    mockError.errorCode = 400;
                    callback();
                });
            });
            CountriesListService.getCountriesList().then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(400);
            });
            rootScope.$digest();
        });

        it('with 408 error code, should be returned error data', function () {
            mockError = { 'errorCode': 408, 'data': { 'errors': [{ 'reason': 'error' }] } };
            inject(function ($q) {
                fakeMmBUtilsErrorService.timeOutError = jasmine.createSpy('timeOutError').and.callFake(function (attempts, callback, errors) {
                    mockError.errorCode = 400;
                    callback();

                });
            });
            CountriesListService.getCountriesList().then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(400);
            });
            rootScope.$digest();
        });

        it('with 500 error code, should be returned error data', function () {
            mockError = { 'errorCode': 500, 'data': { 'errors': [{ 'reason': 'error' }] } };
            procesedResponse = { 'errorCode': 500, 'message': 'error', 'needsTranslate': false, 'internalErrorCode': 'internal_error' };
            inject(function ($q) {
                fakeMmBUtilsErrorService.internalServerError = jasmine.createSpy('internalServerError').and.callFake(function () {
                    return procesedResponse;
                });
            });
            CountriesListService.getCountriesList().then(angular.noop, function (responseError) {
                expect(responseError.errorCode).toEqual(500);
            });
            rootScope.$digest();
        });


        it('with non 401 or 408 error code,should be returned procesed error', function () {
            mockError = { 'errorCode': 403, 'data': { 'errors': [{ 'reason': 'error' }] } };
            procesedResponse = { 'errorCode': 403, 'message': 'error', 'needsTranslate': false, 'internalErrorCode': 'internal_error' };
            inject(function ($q) {
                fakeMmBUtilsErrorService.processGeneralError = jasmine.createSpy('processGeneralError').and.callFake(function () {
                    return procesedResponse;
                });
            });
            CountriesListService.getCountriesList().then(angular.noop, function (responseError) {
                expect(responseError).toEqual(procesedResponse);
            });
            rootScope.$digest();
        });
    });
});
