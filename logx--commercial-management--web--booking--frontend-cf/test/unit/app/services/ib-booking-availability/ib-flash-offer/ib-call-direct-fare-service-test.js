import { HttpServicesConstants } from "@src/app/core/constants/ib-http-services-constants";
describe('IbCallDirectFareService test', function () {

    var rootScope, IbCallDirectFareService, BookingAppConstants;
    var mockResponse = 'promesa';
    var responseData = 'promesa';
    var requestData = 'test';
    var mockError = 'test error';
    var fakeBookingPromiseProxy = {
        post: jasmine.createSpy()
    };

    var fakeCommonsNewHttpUtilsErrorService = {
        controlError: jasmine.createSpy()
    }


    beforeEach(function () {
        angular.mock.module('ib-flash-offer-service-module', function ($provide) {
            $provide.value('BookingAppConstants', { 'DEFAULT_ENDPOINTS': { 'availabilityServiceURI': 'availabilityServiceURI', 'availabilityServiceURI': 'availabilityServiceURI' } });
            $provide.value('BookingPromiseProxy', fakeBookingPromiseProxy);
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
            $provide.value('HttpServicesConstants', HttpServicesConstants);
        });
        inject(function ($rootScope, _BookingAppConstants_,_IbCallDirectFareService_) {
            BookingAppConstants = _BookingAppConstants_;
            IbCallDirectFareService = _IbCallDirectFareService_
            rootScope = $rootScope;
        });
    })

    describe('When getDirectFare()', function () {

        beforeEach(inject(function ($q) {
            fakeBookingPromiseProxy.post = jasmine.createSpy('getDirectFare').and.callFake(function () {
                var deferred = $q.defer();
                var response = deferred.promise;
                deferred.resolve(mockResponse);
                return response;
            });
        }));

        it('Test success and exists endopoints', function (done) {
            IbCallDirectFareService.getDirectFare().then(function (responseData) {
                expect(responseData).toEqual('promesa');
                done();
            }, angular.noop);
            rootScope.$digest();
        });
    })

    xdescribe('when getDirectFare Proxy rejects the promise', function () {
        var mockError, processedResponse;
        beforeEach(inject(function ($q) {
            mockError = {
                'errorCode': 400,
                'data': {
                    'errors': [{ 'reason': 'error' }]
                }
            };
            processedResponse = {
                errorCode: 400,
                message: 'error',
                needsTranslate: false,
                internalErrorCode: 'internal_error'
            }
            fakeBookingPromiseProxy.post = jasmine.createSpy('post').and.callFake(function () {
                var deferred = $q.defer();
                deferred.reject(mockError);
                return deferred.promise;
            });
            fakeCommonsHttpUtilsErrorService.controlError =  jasmine.createSpy('controlError').and.callFake(function (error, numberAttemps, Callback, defer) {
                return processedResponse;
            });
        }));
        it('and error code', function (done) {
            IbCallDirectFareService.getDirectFare().then(angular.noop, function (responseError) {
                expect(responseError.message).toEqual('error');
                done();
            });
            rootScope.$digest();
        });
    });
});
