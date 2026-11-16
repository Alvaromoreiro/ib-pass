import { HttpServicesConstants } from "@src/app/core/constants/ib-http-services-constants";
describe('BookingCalendarGridService Test', function () {

    var fakeData = { data: 'Ok' }
    var BookingCalendarGridService, rootScope, q;
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
        postGeneric: jasmine.createSpy()
    };
    var fakeBookingAppConstants = { 'DEFAULT_ENDPOINTS': { 'BookingCalendarGridServiceURI': 'BookingCalendarGridServiceURI' } };

    beforeEach(function () {
        angular.mock.module('ib-booking-services-module', function ($provide) {
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
            $provide.value('BookingAppConstants', fakeBookingAppConstants);
            $provide.value('BookingPromiseProxy', fakeBookingPromiseProxy);
            $provide.value('HttpServicesConstants', HttpServicesConstants);
        });
        inject(function ($rootScope, _BookingCalendarGridService_, $q) {
            BookingCalendarGridService = _BookingCalendarGridService_;
            rootScope = $rootScope;
            q= $q;
        });
    });

    describe('when getRedemptionCalendarData is called', function () {
        it('reject and should return an object with processed error structure', function (done) {
            inject(function () {
                fakeBookingPromiseProxy.post = jasmine.createSpy('post').and.callFake(function () {
                    var deferred = q.defer();
                    deferred.reject(mockError);
                    return deferred.promise;
                });
            })
            BookingCalendarGridService.getRedemptionCalendarData().then(angular.noop, function (responseError) {
                expect(responseError.message).toEqual('error');
                expect(responseError.needsTranslate).toEqual(false);
                done();
            });
            rootScope.$digest();
            done();
        });
        it(' resolve and return the rest service destination areas list data', function (done) {
            inject(function () {
                fakeBookingPromiseProxy.post = jasmine.createSpy('post').and.callFake(function () {
                    var deferred = q.defer();
                    deferred.resolve(fakeData);
                    return deferred.promise;
                });
            });
            BookingCalendarGridService.getRedemptionCalendarData().then(function (responseData) {
                expect(responseData).toEqual('Ok');
                // done();
            }, angular.noop);
            rootScope.$digest();
            done();
        });
    });
});
