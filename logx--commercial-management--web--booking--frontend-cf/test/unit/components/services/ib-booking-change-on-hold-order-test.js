import { HttpServicesConstants } from "@src/app/core/constants/ib-http-services-constants";
describe('BookingChangeOnHoldOrderService Test', function () {

    var fakeData = { data: 'Ok' }
    var BookingChangeOnHoldOrderService, rootScope, q;
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
        put: jasmine.createSpy()
    };
    var fakeBookingAppConstants = { 'DEFAULT_ENDPOINTS': { 'changeOnHoldOrder': 'changeOnHoldOrder' } };

    beforeEach(function () {
        angular.mock.module('ib-booking-services-module', function ($provide) {
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
            $provide.value('BookingAppConstants', fakeBookingAppConstants);
            $provide.value('BookingPromiseProxy', fakeBookingPromiseProxy);
            $provide.value('HttpServicesConstants', HttpServicesConstants);
        });
        inject(function ($rootScope, _BookingChangeOnHoldOrderService_, $q) {
            BookingChangeOnHoldOrderService = _BookingChangeOnHoldOrderService_;
            rootScope = $rootScope;
            q= $q;
        });
    });

    describe('when changeOnHoldOrder called and BookingPromiseProxy resolves the promise', function () {
        it('reject and should return an object with processed error structure', function (done) {
            inject(function () {
                fakeBookingPromiseProxy.put = jasmine.createSpy('put').and.callFake(function () {
                    var deferred = q.defer();
                    deferred.reject(mockError);
                    return deferred.promise;
                });
            })
            BookingChangeOnHoldOrderService.changeOnHoldOrder('12').then(angular.noop, function (responseError) {
                expect(responseError.message).toEqual('error');
                expect(responseError.needsTranslate).toEqual(false);
                done();
            });
            rootScope.$digest();
            done();
        });
        it(' resolve and return data', function (done) {
            inject(function () {
                fakeBookingPromiseProxy.put = jasmine.createSpy('put').and.callFake(function () {
                    var deferred = q.defer();
                    deferred.resolve(fakeData);
                    return deferred.promise;
                });
            });
            BookingChangeOnHoldOrderService.changeOnHoldOrder('21').then(function (responseData) {
                expect(responseData).toEqual('Ok');
                done();
            }, angular.noop);
            rootScope.$digest();
        });
    });
});
