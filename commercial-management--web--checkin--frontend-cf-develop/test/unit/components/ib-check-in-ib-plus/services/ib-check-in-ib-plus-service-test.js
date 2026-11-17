describe('CheckInIbPlusService', function () {
    var service;
    var rootScope;
    var q;
    var fakeUserLoggedBookingTransformer;
    var fakeGetCitiesImagesService;
    var fakeUserLoggedBookingService;
    var fakeModalService;

    beforeEach(function () {
        fakeUserLoggedBookingTransformer = {
            transformUserBookingInfo: jasmine.createSpy('transformUserBookingInfo')
        };
        fakeGetCitiesImagesService = {
            getCitiesImages: jasmine.createSpy('getCitiesImages')
        };
        fakeUserLoggedBookingService = {
            getUserLoggedBookingInformation: jasmine.createSpy('getUserLoggedBookingInformation')
        };
        fakeModalService = {
            isNotWaiting: jasmine.createSpy('isNotWaiting'),
            setErrorMessage: jasmine.createSpy('setErrorMessage'),
            setErrorCode: jasmine.createSpy('setErrorCode'),
            isError: jasmine.createSpy('isError')
        };
    });

    beforeEach(angular.mock.module('ib-checkin-ib-plus'));

    beforeEach(angular.mock.module(function ($provide) {
        $provide.value('UserLoggedBookingTransformer', fakeUserLoggedBookingTransformer);
        $provide.value('GetCitiesImagesService', fakeGetCitiesImagesService);
        $provide.value('UserLoggedBookingService', fakeUserLoggedBookingService);
        $provide.value('ModalService', fakeModalService);
    }));

    beforeEach(inject(function (CheckInIbPlusService, $rootScope, $q) {
        service = CheckInIbPlusService;
        rootScope = $rootScope;
        q = $q;
    }));

    it('should fetch city images and transform the logged booking information', function () {
        var cityImages = [{ city: 'Madrid' }];
        var loggedBookingInfo = { locator: 'ABC123' };
        var transformedInfo = [{ locator: 'ABC123', image: 'madrid.jpg' }];
        var result;
        fakeGetCitiesImagesService.getCitiesImages.and.returnValue(q.when(cityImages));
        fakeUserLoggedBookingService.getUserLoggedBookingInformation.and.returnValue(q.when(loggedBookingInfo));
        fakeUserLoggedBookingTransformer.transformUserBookingInfo.and.returnValue(transformedInfo);

        service.searchUserLoggedBookings().then(function (response) {
            result = response;
        });
        rootScope.$digest();

        expect(fakeGetCitiesImagesService.getCitiesImages).toHaveBeenCalledTimes(1);
        expect(fakeUserLoggedBookingService.getUserLoggedBookingInformation).toHaveBeenCalledTimes(1);
        expect(fakeUserLoggedBookingTransformer.transformUserBookingInfo).toHaveBeenCalledWith(loggedBookingInfo, cityImages);
        expect(fakeModalService.isNotWaiting).toHaveBeenCalledTimes(1);
        expect(result).toEqual({ data: transformedInfo, isError: false });
    });

    it('should report booking errors that require an error message', function () {
        var bookingError = { showError: true, message: 'Booking lookup failed', code: 'BOOKING_ERROR' };
        var result;
        fakeGetCitiesImagesService.getCitiesImages.and.returnValue(q.when([]));
        fakeUserLoggedBookingService.getUserLoggedBookingInformation.and.returnValue(q.reject(bookingError));

        service.searchUserLoggedBookings().then(function (response) {
            result = response;
        });
        rootScope.$digest();

        expect(fakeModalService.isNotWaiting).toHaveBeenCalledTimes(1);
        expect(fakeModalService.setErrorMessage).toHaveBeenCalledOnceWith(bookingError.message);
        expect(fakeModalService.setErrorCode).toHaveBeenCalledOnceWith(bookingError.code);
        expect(fakeModalService.isError).toHaveBeenCalledOnceWith(bookingError);
        expect(result).toEqual({ data: [], isError: true });
    });

    it('should return an empty result without showing an error when the booking error is not user-facing', function () {
        var bookingError = { showError: false, message: 'Internal error', code: 'INTERNAL_ERROR' };
        var result;
        fakeGetCitiesImagesService.getCitiesImages.and.returnValue(q.when([]));
        fakeUserLoggedBookingService.getUserLoggedBookingInformation.and.returnValue(q.reject(bookingError));

        service.searchUserLoggedBookings().then(function (response) {
            result = response;
        });
        rootScope.$digest();

        expect(fakeModalService.isNotWaiting).toHaveBeenCalledTimes(1);
        expect(fakeModalService.setErrorMessage).not.toHaveBeenCalled();
        expect(fakeModalService.setErrorCode).not.toHaveBeenCalled();
        expect(fakeModalService.isError).not.toHaveBeenCalled();
        expect(result).toEqual({ data: [], isError: false });
    });
});