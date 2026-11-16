import { HttpServicesConstants } from "@src/app/core/constants/ib-http-services-constants";
describe('BookingCancelOrderService Test', function () {

    var BookingCancelOrderService, rootScope, q;
    var fakeCommonsNewHttpUtilsErrorService = {
        controlError: jasmine.createSpy('controlError').and.callFake(function () {
            return 1;
        })
    };
    var mockError = {
        'errorCode': 400,
        'data': {
            'errors': [{ 'reason': 'error' }]
        }
    };
    var fakeData = { data: 'Ok' }
    var fakeBookingPromiseProxy = {
        delete: jasmine.createSpy()
    };
    var fakeBookingAppConstants = { 'DEFAULT_ENDPOINTS': { 'cancelOrderServiceURI': 'cancelOrderServiceURI' } };
    beforeEach(function () {
        angular.mock.module('ib-booking-services-module', function ($provide) {
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
            $provide.value('BookingAppConstants', fakeBookingAppConstants);
            $provide.value('BookingPromiseProxy', fakeBookingPromiseProxy);
            $provide.value('HttpServicesConstants', HttpServicesConstants);
        });
        inject(function ($rootScope, _BookingCancelOrderService_, $q) {
            BookingCancelOrderService = _BookingCancelOrderService_;
            rootScope = $rootScope;
            q= $q;
        });
    });

    describe('when cancelOrder is called and ', function () {
        it('reject and should return an object with processed error structure', function (done) {
            inject(function () {
                fakeBookingPromiseProxy.delete = jasmine.createSpy('delete').and.callFake(function () {
                    var deferred = q.defer();
                    deferred.reject(mockError);
                    return deferred.promise;
                });
            })
            BookingCancelOrderService.cancelOrder().then(angular.noop, function (responseError) {
                expect(responseError.message).toEqual('error');
                expect(responseError.needsTranslate).toEqual(false);
                done();
            });
            rootScope.$digest();
            done();
        });
        it('resolves the promise and fakeBookingPromiseProxy resolves the promise and cancelOrder returns with the data', function (done) {
            inject(function () {
                fakeBookingPromiseProxy.delete = jasmine.createSpy('delete').and.callFake(function () {
                    var deferred = q.defer();
                    deferred.resolve(fakeData);
                    return deferred.promise;
                });
            });
            BookingCancelOrderService.cancelOrder().then(function (responseData) {
                expect(responseData).toEqual('Ok');
                done();
            }, angular.noop);
            rootScope.$digest();
        });
    });
});
