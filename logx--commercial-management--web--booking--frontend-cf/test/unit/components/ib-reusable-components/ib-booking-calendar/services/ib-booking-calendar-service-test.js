import { StorageServiceMock } from '@test/mocks/Services/StorageServiceMock';

describe('BookingCalendarService test', () => {

    let BookingCalendarService, rootScope, $q, localStorageService;
    const fakeBookingAvailabilityTransformer = { createRequestAvailability: jasmine.createSpy() };
    const fakeBookingCalendarGridService = { getRedemptionCalendarData: jasmine.createSpy() };
    const fakeBookingCalendarTransformer = { getRedemptionCalendarModel: jasmine.createSpy() };

    beforeEach(() => {
        localStorageService = new StorageServiceMock();
        angular.mock.module('ib-booking-calendar-module', 'ib-booking-services-module', 'ib-booking-modal-module', 'LocalStorageModule', ($provide) => {
            $provide.value('BookingAvailabilityTransformer', fakeBookingAvailabilityTransformer);
            $provide.value('BookingCalendarGridService', fakeBookingCalendarGridService);
            $provide.value('BookingCalendarTransformer', fakeBookingCalendarTransformer);
            $provide.value('CommonsSessionStorageService', localStorageService);
        } );

        inject((_BookingCalendarService_, $rootScope, _$q_) => {
            BookingCalendarService = _BookingCalendarService_;
            rootScope = $rootScope;
            $q = _$q_;

            fakeBookingCalendarGridService.getRedemptionCalendarData = jasmine.createSpy('getRedemptionCalendarData').and.callFake(() => {
                const deferred = $q.defer();
                deferred.resolve(true);
                return deferred.promise;
            });

            fakeBookingAvailabilityTransformer.createRequestAvailability = jasmine.createSpy('createRequestAvailability').and.callFake(() => {
                return { slices: [{ origin: 'MAD', destination: 'ROM' }, { origin: 'ROM', destination: 'MAD' }] };
            });

            fakeBookingCalendarTransformer.getRedemptionCalendarModel = jasmine.createSpy('getRedemptionCalendarModel').and.callFake(() => {
                return { transformedData: 'ok' };
            });

            localStorageService.set('newAvailabilitySearch', { slices: [{ origin: 'MAD', destination: 'ROM' }, { origin: 'ROM', destination: 'MAD' }] });

        });

    });
    describe('When the user initializes the calendar grid in the redemption flow and the BookingCalendarService initialize the model', () => {
        describe('and the BookingCalendarService have all data', () => {
            it('then the service resolves the promise ', (done) => {
                BookingCalendarService.initRedemptionCalendar(0).then((data) => {
                    expect(data.transformedData).toEqual('ok');
                    done();
                }, angular.noop);
                rootScope.$digest();
            });
            it('and the localStorageService dont have data then the service resolves the promise ', (done) => {
                localStorageService.remove('newAvailabilitySearch');
                BookingCalendarService.initRedemptionCalendar(0).then((data) => {
                    expect(data.transformedData).toEqual('ok');
                    done();
                }, angular.noop);
                rootScope.$digest();
            });
        });
        describe('and the BookingCalendarService have a problem', () => {
            it('then the service rejects the promise ', (done) => {
                const mockError = {
                    errorCode: 412,
                    data: {
                        errors: [{ reason: 'error' }]
                    }
                };

                fakeBookingCalendarGridService.getRedemptionCalendarData = jasmine.createSpy('getRedemptionCalendarData').and.callFake(() => {
                    const deferred = $q.defer();
                    deferred.reject(mockError);
                    return deferred.promise;
                });

                BookingCalendarService.initRedemptionCalendar().then(angular.noop, (data) => {
                    expect(data.errorCode).toEqual(412);
                    expect(data.data.errors[0].reason).toEqual('error');
                    done();
                });
                rootScope.$digest();
            });
        });
    });
});
