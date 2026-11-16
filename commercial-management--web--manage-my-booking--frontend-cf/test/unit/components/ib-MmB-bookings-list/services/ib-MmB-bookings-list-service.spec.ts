describe('BookingsListService Test', () => {

    let localStorageService, rootScope, bookingsListService;

    var mockResponse = { data: 'promesa' };

    var fakeCallBookingsListService = { 'getBookingsList': jasmine.createSpy() };

    var fakeBookingsListTransformer = {
        'transformBookingsListInfo': jasmine.createSpy('transformBookingsListInfo').and.callFake((bookList, imageList) => {
            return 'transformedBooking'
        })
    }

    var fakeMmBModalService = { 'showWaitingModal': jasmine.createSpy() };
    var fakeGetCitiesImagesService = { 'getCitiesImages': jasmine.createSpy() };

    let fakeCommonsUserUtilsService = {
        isIbZero: jasmine.createSpy()
    };

    let fakeLoadingSpinnerService = {
        'show': jasmine.createSpy('show'),
        'hide': jasmine.createSpy('hide'),
        'isLoading': jasmine.createSpy('isLoading').and.returnValue(false)
    };

    beforeEach(() => {
        angular.mock.module('LocalStorageModule', 'ib-MmB-bookings-list-module', 'ib-MmB-modal-module', ($provide) => {
            $provide.value('CallBookingsListService', fakeCallBookingsListService);
            $provide.value('BookingsListTransformer', fakeBookingsListTransformer);
            $provide.value('MmBModalService', fakeMmBModalService);
            $provide.value('GetCitiesImagesService', fakeGetCitiesImagesService);
            $provide.value('CommonsUserUtilsService', fakeCommonsUserUtilsService);
            $provide.value('LoadingSpinnerService', fakeLoadingSpinnerService);
        });
        inject(($rootScope, _BookingsListService_, _localStorageService_) => {
            bookingsListService = _BookingsListService_;
            rootScope = $rootScope;
            localStorageService = _localStorageService_;
        });
    });

    describe('When getBookingsList() is called', () => {
        it('and don´t have citiesImagesList in localStorage and getBookingsList() resolve promise,should be return data transformed', (done) => {
            localStorageService.set('citiesImagesList', null);
            localStorageService.set('bookingsList', 'bookingInfo');
            inject(($q) => {
                fakeCallBookingsListService.getBookingsList = jasmine.createSpy('getBookingsList').and.callFake(() => {
                    var deferred = $q.defer();
                    deferred.resolve(mockResponse);
                    return deferred.promise;
                });

                fakeGetCitiesImagesService.getCitiesImages = jasmine.createSpy('getCitiesImages').and.callFake(() => {
                    var deferred = $q.defer();
                    deferred.resolve();
                    return deferred.promise;
                });
                fakeCommonsUserUtilsService.isIbZero = jasmine.createSpy().and.callFake(() => {
                    return false;
                });
            });

            bookingsListService.getBookingsList().then((responseData) => {
                expect(responseData).toEqual('transformedBooking');
                done();
            });
            rootScope.$digest();
            localStorageService.clearAll();
        });


        it('and have citiesImagesList,bookingsList in localStorage and getBookingsList() resolve promise,should be return data transformed', (done) => {
            localStorageService.set('citiesImagesList', 'cities');
            localStorageService.set('bookingsList', 'bookingInfo');
            inject(($q) => {
                fakeCallBookingsListService.getBookingsList = jasmine.createSpy('getBookingsList').and.callFake(() => {
                    var deferred = $q.defer();
                    deferred.resolve(mockResponse);
                    return deferred.promise;
                });
                fakeCommonsUserUtilsService.isIbZero = jasmine.createSpy().and.callFake(() => {
                    return false;
                });
            });
            bookingsListService.getBookingsList().then((responseData) => {
                expect(responseData).toEqual('transformedBooking');
                done();
            });
            rootScope.$digest();
            localStorageService.clearAll();
        });
        it('and have citiesImagesList in localStorage and getBookingsList() resolve promise,should be return data transformed', (done) => {
            localStorageService.set('citiesImagesList', 'cities');
            localStorageService.set('bookingsList', null);
            inject(($q) => {
                fakeCallBookingsListService.getBookingsList = jasmine.createSpy('getBookingsList').and.callFake(() => {
                    var deferred = $q.defer();
                    deferred.resolve(mockResponse);
                    return deferred.promise;
                });
                fakeCommonsUserUtilsService.isIbZero = jasmine.createSpy().and.callFake(() => {
                    return false;
                });
            });
            bookingsListService.getBookingsList().then((responseData) => {
                expect(responseData).toEqual('transformedBooking');
                done();
            });
            rootScope.$digest();
            localStorageService.clearAll();
        });
        it('and have citiesImagesList in localStorage and getBookingsList(), reject promise,should be return data empty', (done) => {
            localStorageService.set('citiesImagesList', null);
            localStorageService.set('bookingsList', null);
            inject(($q) => {
                fakeGetCitiesImagesService.getCitiesImages = jasmine.createSpy('getCitiesImages').and.callFake(() => {
                    var deferred = $q.defer();
                    deferred.reject();
                    return deferred.promise;
                });
                fakeCallBookingsListService.getBookingsList = jasmine.createSpy('getBookingsList').and.callFake(() => {
                    var deferred = $q.defer();
                    deferred.reject();
                    return deferred.promise;
                });
                fakeCommonsUserUtilsService.isIbZero = jasmine.createSpy().and.callFake(() => {
                    return false;
                });
            });
            bookingsListService.getBookingsList().then((responseData) => {
                expect(localStorageService.get('bookingsList')).toEqual(null);
                expect(responseData).toEqual('transformedBooking');
                done();
            });
            rootScope.$digest();
            localStorageService.clearAll();
        });

        it('and have citiesImagesList in localStorage and getBookingsList(), reject promise,should be return data empty', (done) => {
            localStorageService.set('citiesImagesList', null);
            localStorageService.set('bookingsList', null);
            inject(($q) => {
                fakeGetCitiesImagesService.getCitiesImages = jasmine.createSpy('getCitiesImages').and.callFake(() => {
                    var deferred = $q.defer();
                    deferred.reject();
                    return deferred.promise;
                });
                fakeCommonsUserUtilsService.isIbZero = jasmine.createSpy().and.callFake(() => {
                    return true;
                });
            });
            bookingsListService.getBookingsList().then((responseData) => {
                expect(localStorageService.get('bookingsList')).toEqual(null);
                expect(responseData).toEqual('transformedBooking');
                done();
            });
            rootScope.$digest();
            localStorageService.clearAll();
        });
    });
});
