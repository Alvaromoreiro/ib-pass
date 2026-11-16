describe('CallBookingsListService test', () => {

    var callBookingsListService, rootScope, mockResponse = { data: 'promesa' };
    var fakeMmBUtilsErrorService = {
        controlError: jasmine.createSpy('controlError').and.callFake((error) => {
            return error;
        })
    };

    var fakeBookingsListProxy = {
        getGeneric: jasmine.createSpy()
    };

    beforeEach(() => {
        angular.mock.module('ib-MmB-bookings-list-module', ($provide) => {
            $provide.value('MmBAppConstants', { bookingsListURI: '/sse-orm/rs/v2/order/bookings' });
            $provide.value('CommonsNewHttpUtilsErrorService', fakeMmBUtilsErrorService);
            $provide.value('CommonsGenericProxy', fakeBookingsListProxy);
        });

        inject((_CallBookingsListService_, $rootScope) => {
            callBookingsListService = _CallBookingsListService_;
            rootScope = $rootScope;
        });
    });


    describe('When getBookingsList() is called', () => {
        it('and resolve promise, should returned data', (done) => {
            inject(($q) => {
                fakeBookingsListProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(() => {
                    var deferred = $q.defer();
                    deferred.resolve(mockResponse);
                    return deferred.promise;
                });
            });
            callBookingsListService.getBookingsList().then((returnedInfo) => {
                expect(returnedInfo.data).toEqual(mockResponse.data);
                done();
            });
            rootScope.$digest();
        });
    });

    describe('When getBookingList() reject the promise', () => {
        it('with non 401 or 408 errorCode', () => {;
            var mockError = { 'errorCode': 400, 'data': { 'errors': [{ 'reason': 'error' }] } };
            inject(($q) => {
                fakeBookingsListProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(() => {
                    var deferred = $q.defer();
                    deferred.reject(mockError);
                    return deferred.promise;
                });
            });
            callBookingsListService.getBookingsList().then(angular.noop, (responseError) => {
                expect(responseError).toEqual(mockError);

            });
            rootScope.$digest();
        });

        it('with 408 errorCode,should be returned errorObject', () => {
            var mockError = { 'errorCode': 408, 'data': { 'errors': [{ 'reason': 'error' }] } };
            inject(($q) => {
                fakeBookingsListProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(() => {
                    var deferred = $q.defer();
                    deferred.reject(mockError);
                    return deferred.promise;
                });
            });
            callBookingsListService.getBookingsList().then(angular.noop, (responseError) => {
                expect(responseError).toEqual(mockError);
            });
            rootScope.$digest();
        });

        it('with 401 errorCode,should be returned errorObject', () => {
            var mockError = { 'errorCode': 401, 'data': { 'errors': [{ 'reason': 'error' }] } };
            inject(($q) => {
                fakeBookingsListProxy.getGeneric = jasmine.createSpy('getGeneric').and.callFake(() => {
                    var deferred = $q.defer();
                    deferred.reject(mockError);
                    return deferred.promise;
                });
            });
            callBookingsListService.getBookingsList().then(angular.noop, (responseError) => {
                expect(responseError).toEqual(mockError);
            });
            rootScope.$digest();
        });
    });

});
