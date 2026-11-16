import { HttpServicesConstants } from "@src/app/core/constants/ib-http-services-constants";
describe('GetCompaniesService Test', function () {

    var fakeData = { data: 'Ok' }
    var BookingGetCompaniesService, rootScope, q, localStorageService;
    var fakeCommonsNewHttpUtilsErrorService = {
        controlError: jasmine.createSpy(),
    };
    var mockError = {
        'errorCode': 400,
        'data': {
            'errors': [{ 'reason': 'error' }]
        }
    };
    var fakeBookingPromiseProxy = {
        get: jasmine.createSpy()
    };
    var fakeBookingAppConstants = { 'DEFAULT_ENDPOINTS': { 'companiesServiceURI': 'companiesServiceURI' } };

    beforeEach(function () {
        angular.mock.module('LocalStorageModule','ib-booking-services-module', function ($provide) {
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
            $provide.value('BookingAppConstants', fakeBookingAppConstants);
            $provide.value('BookingPromiseProxy', fakeBookingPromiseProxy);
            $provide.value('HttpServicesConstants', HttpServicesConstants);
        });
        inject(function ($rootScope, _BookingGetCompaniesService_, $q, _localStorageService_) {
            BookingGetCompaniesService = _BookingGetCompaniesService_;
            rootScope = $rootScope;
            q= $q;
            localStorageService = _localStorageService_;
        });
    });

    describe('when getCompanies is called', function () {
        it('reject and should return an object with processed error structure', function (done) {
            inject(function () {
                fakeBookingPromiseProxy.get = jasmine.createSpy('get').and.callFake(function () {
                    var deferred = q.defer();
                    deferred.reject(mockError);
                    return deferred.promise;
                });
            })
            BookingGetCompaniesService.getCompanies().then(angular.noop, function (responseError) {
                expect(responseError.message).toEqual('error');
                expect(responseError.needsTranslate).toEqual(false);
                done();
            });
            rootScope.$digest();
            done();
        });
        xit(' resolve and return the rest service data', function (done) {
            inject(function () {
                fakeBookingPromiseProxy.get = jasmine.createSpy('get').and.callFake(function () {
                    var deferred = q.defer();
                    deferred.resolve(fakeData);
                    return deferred.promise;
                });
            });
            BookingGetCompaniesService.getCompanies().then(function (responseData) {
                expect(responseData).toEqual('Ok');
                done();
            }, angular.noop);
            rootScope.$digest();
            done();
        });
    });
});
