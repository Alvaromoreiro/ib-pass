describe('BookingBackgroundImagesService Test', function () {

    var fakeBookingPromiseProxy = { 'get': jasmine.createSpy() };
    var mockResponse = 'Ok';
    var BookingBackgroundImagesService, rootScope, localStorageService, q;
    var fakeBookingAppConstants = { 'backgroundImagesJsonRoute': 'backgroundImagesJsonRoute' };

    beforeEach(function () {
        angular.mock.module('LocalStorageModule', 'ib-booking-services-module', function ($provide) {
            $provide.value('BookingPromiseProxy', fakeBookingPromiseProxy);
            $provide.value('BookingAppConstants', fakeBookingAppConstants);
        });
        inject(function ($rootScope, _BookingBackgroundImagesService_, _localStorageService_, $q) {
            BookingBackgroundImagesService = _BookingBackgroundImagesService_;
            rootScope = $rootScope;
            localStorageService = _localStorageService_;
            q= $q;
        });
    });

    it('when backgroundImages data is in local storage, the promise must be resolved with the data', function (done) {
        var backgroundImagesList = [{ 'url': 'test' }];
        localStorageService.set('backgroundImagesList', backgroundImagesList);
        BookingBackgroundImagesService.getBackgroundImages().then(function (responseData) {
            expect(responseData).toEqual(backgroundImagesList);
            localStorageService.clearAll();
            done();
        }, angular.noop);
        rootScope.$digest();
    });

    describe('when backgroundImagesList data is not in local storage', function () {
        it('and BookingBackgroundImagesProxy resolves the promise, then the service must return proxy´s data', function (done) {
            inject(function () {
                fakeBookingPromiseProxy.get = jasmine.createSpy('get').and.callFake(function () {
                    return Promise.resolve(mockResponse);
                });
            });
            BookingBackgroundImagesService.getBackgroundImages().then(function (responseData) {
                localStorageService.clearAll();
                done();
            }, angular.noop);
            rootScope.$digest();
        });

        it('and BookingBackgroundImagesProxy rejects the promise, general error response must be rejected and empty list in local storage must be set', function (done) {
            var errorResponse = { 'errorCode': '', 'message': 'REST_SERVICE_ERROR_GENERAL', 'needsTranslate': true, 'internalErrorCode': '' };
            inject(function () {
                fakeBookingPromiseProxy.get = jasmine.createSpy('get').and.callFake(function () {
                    return Promise.reject('');
                });
            })
            BookingBackgroundImagesService.getBackgroundImages().then(angular.noop, function (responseError) {
                expect(responseError).toEqual(errorResponse);
                expect(localStorageService.get('backgroundImagesList')).toEqual([]);
                localStorageService.clearAll();
                done();
            });
            rootScope.$digest();
        });
    });
});
