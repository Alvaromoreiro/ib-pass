import { StorageServiceMock } from "../../../mocks/Services/StorageServiceMock";
import { HttpServicesConstants } from "@src/app/core/constants/ib-http-services-constants";
describe('BookingFareRedemptionService Test', function () {

    var fakeData = { data: {offers: [{flightRatio: 'RT'} ]} }
    var BookingFareRedemptionService, rootScope, q;
    const fakeSessionStorage = new StorageServiceMock();
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
    var fakeBookingAppConstants = { 'DEFAULT_ENDPOINTS': { 'fareRedemptionServiceURI': 'fareRedemptionServiceURI' } };
    var fakeCurrencyService = {
        formatPrice: jasmine.createSpy(),
        getCurrencyObject: jasmine.createSpy()
    };
    var fakeBookingModalService = {
        showGenericModal: jasmine.createSpy()
    };
    var fakeRedirectionService = {
        'externalRedirect': jasmine.createSpy()
    };
    var fakeNewMainHeaderFacade = {
        initHeader: jasmine.createSpy(),
        deleteTripsBasketFromDispo: jasmine.createSpy(),
        updateTripsBasketFromDispo: jasmine.createSpy(),
    }
    var fakeBookingUtilService = {
        addflightRatioInDataLayer: jasmine.createSpy(),
        addflightHaulInDigitalInfo: jasmine.createSpy()
    };

    beforeEach(function () {
        fakeSessionStorage.clear();
        angular.mock.module('ib-booking-services-module', function ($provide) {
            $provide.value('CommonsNewHttpUtilsErrorService', fakeCommonsNewHttpUtilsErrorService);
            $provide.value('BookingAppConstants', fakeBookingAppConstants);
            $provide.value('BookingPromiseProxy', fakeBookingPromiseProxy);
            $provide.value('CommonsSessionStorageService', fakeSessionStorage);
            $provide.value('CurrencyService', fakeCurrencyService);
            $provide.value('BookingModalService', fakeBookingModalService);
            $provide.value('BookingRedirectionService', fakeRedirectionService);
            $provide.value('NewMainHeaderFacade', fakeNewMainHeaderFacade);
            $provide.value('BookingUtilService', fakeBookingUtilService);
            $provide.value('HttpServicesConstants', HttpServicesConstants);
        });
        inject(function ($rootScope, _BookingFareRedemptionService_, $q) {
            BookingFareRedemptionService = _BookingFareRedemptionService_;
            rootScope = $rootScope;
            q= $q;
            rootScope.timeSession ={
                startTime : ''
            };
        });
    });

    describe('when getBookingRedemptionFare is called', function () {
        it('reject and should return an object with processed error structure', function (done) {
            inject(function () {
                fakeBookingPromiseProxy.post = jasmine.createSpy('post').and.callFake(function () {
                    var deferred = q.defer();
                    deferred.reject(mockError);
                    return deferred.promise;
                });
            })
            BookingFareRedemptionService.getBookingRedemptionFare().then(angular.noop, function (responseError) {
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
            BookingFareRedemptionService.getBookingRedemptionFare().then(function (responseData) {
                expect(responseData).toEqual({offers: [{flightRatio: 'RT'} ]});
                // done();
            }, angular.noop);
            rootScope.$digest();
            done();
        });
    });
});
