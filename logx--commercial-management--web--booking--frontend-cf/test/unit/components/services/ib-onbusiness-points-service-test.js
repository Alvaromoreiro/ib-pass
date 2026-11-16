import { HttpServicesConstants } from "@src/app/core/constants/ib-http-services-constants";
describe('OnBusinessPointsService Test', function () {

    var fakeData = { data: 'Ok' }
    var OnBusinessPointsService, rootScope, q;
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
        post: jasmine.createSpy()
    };
    var fakeBookingAppConstants = { 'DEFAULT_ENDPOINTS': { 'onBusinessPointsURI': 'onBusinessPointsURI' } };

    beforeEach(function () {
        angular.mock.module('LocalStorageModule', 'ib-booking-services-module', function ($provide) {
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
            $provide.value('BookingAppConstants', fakeBookingAppConstants);
            $provide.value('BookingPromiseProxy', fakeBookingPromiseProxy);
            $provide.value('HttpServicesConstants', HttpServicesConstants);
        });
        inject(function ($rootScope, _OnBusinessPointsService_, $q) {
            OnBusinessPointsService = _OnBusinessPointsService_;
            rootScope = $rootScope;
            q= $q;
        });
    });

    describe('when getOnBusinessPoints is called', function () {
        it('reject and should return an object with processed error structure', function (done) {
            inject(function () {
                fakeBookingPromiseProxy.post = jasmine.createSpy('post').and.callFake(function () {
                    var deferred = q.defer();
                    deferred.reject(mockError);
                    return deferred.promise;
                });
            })
            OnBusinessPointsService.getOnBusinessPoints().then(angular.noop, function (responseError) {
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
            OnBusinessPointsService.getOnBusinessPoints().then(function (responseData) {
                expect(responseData).toEqual('Ok');
                // done();
            }, angular.noop);
            rootScope.$digest();
            done();
        });
    });
});
