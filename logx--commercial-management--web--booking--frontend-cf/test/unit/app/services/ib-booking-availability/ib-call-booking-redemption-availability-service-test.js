import { HttpServicesConstants } from "@src/app/core/constants/ib-http-services-constants";
describe('CallBookingRedemptionAvailabilityService Test', function () {
    let localStorageService;
    var mockResponse = { 'data': 'promesa' };
    var requestData = 'test';
    var rootScope, CallBookingRedemptionAvailabilityService;
    var fakeBookingPromiseProxy = {
        post: jasmine.createSpy()
    };
    var fakeCommonsNewHttpUtilsErrorService = {
        controlError: jasmine.createSpy()
    };
    var fakeCommonsModalService = {
        finishWaiting: jasmine.createSpy()
    };

    beforeEach(function () {
        angular.mock.module('LocalStorageModule', 'ib-booking-availability-module', function ($provide) {
            $provide.value('BookingPromiseProxy', fakeBookingPromiseProxy);
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
            $provide.value('CommonsModalService', fakeCommonsModalService);
            $provide.value('HttpServicesConstants', HttpServicesConstants);
            $provide.value('BookingAppConstants', {
                'DEFAULT_ENDPOINTS': { 'availabilityServiceURI': 'availabilityServiceURI' }
            });
        });
        inject(function ($rootScope, _CallBookingRedemptionAvailabilityService_, _localStorageService_) {
            CallBookingRedemptionAvailabilityService = _CallBookingRedemptionAvailabilityService_;
            rootScope = $rootScope;
            rootScope.timeSession = {};
            localStorageService = _localStorageService_;
        });
    });

    describe('when getBookingRedemptionAvailability  is called', function () {
        beforeEach(inject(function ($q) {
            fakeBookingPromiseProxy.post = jasmine.createSpy('post').and.callFake(function () {
                var deferred = $q.defer();
                var response = deferred.promise;
                deferred.resolve(mockResponse);
                return response;
            });
        }));
        it('and responses with success code', function (done) {
            CallBookingRedemptionAvailabilityService.getBookingRedemptionAvailability(requestData).then(function (responseData) {
                expect(responseData.data).toEqual('promesa');
                done();
            }, angular.noop);
            rootScope.$digest();
        });

        it('when BookingRedemptionAvailabilityProxy rejects the promise with 400 errorCode', function () {
            var mockError;

            mockError = {
                'errorCode': 400,
                'data': {
                    'errors': [{ 'reason': 'error' }]
                }
            };
            fakeBookingPromiseProxy.post = jasmine.createSpy('post').and.callFake(function () {
                return Promise.reject(mockError);
            });

            CallBookingRedemptionAvailabilityService.getBookingRedemptionAvailability().then(angular.noop, function (responseError) {
                expect(responseError.message).toEqual('error');
                done();
            });
            rootScope.$digest();
        });
        it('when BookingRedemptionAvailabilityProxy rejects the promise with 404 errorCode', function () {
            var mockError;

            mockError = {
                'errorCode': 404,
                'data': {
                    'errors': [{ 'reason': 'error' }]
                }
            };
            fakeBookingPromiseProxy.post = jasmine.createSpy('post').and.callFake(function () {
                return Promise.reject(mockError);
            });

            CallBookingRedemptionAvailabilityService.getBookingRedemptionAvailability().then(angular.noop, function (responseError) {
                expect(responseError.message).toEqual('error');
                done();
            });
            rootScope.$digest();
        });
    });

})
