describe('BookingsListTransformer test', () => {
    let bookingsListTransformer, windowLocation, filter;

    let fakeBookingInfo = [{
        'arrival': {
            'airport': { 'code': 'MAD', 'country': 'ES', 'description': 'Adolfo suarez' },
            'city': { 'code': 'MAD', 'countryCode': 'ES', 'description': 'Madrid', 'timezone': 'Europe/Madrid' }
        },
        'departure': {
            'airport': { 'code': 'MAD', 'country': 'ES', 'description': 'Barna' },
            'city': { 'code': 'MAD', 'countryCode': 'ES', 'description': 'Barceloa', 'timezone': 'Europe/Madrid' }
        },
        'departureDate': '2017-11-17 ',
        'flightNumber': {
            'company': { 'code': 'IB', 'description': 'IBERIA AEROLINEAS' },
            'number': '12'
        },
        'locator': 'first',
        'name': 'jhone',
        'surname': 'dhoe'
    }];

    let fakeCities = [{ 'cityCode': 'MAD', 'cityDescription': 'Aalborg', 'url': 'rutaAal.jpg' }, { 'cityCode': 'ZAL', 'cityDescription': 'Zalborg', 'url': 'rutaZal.jpg' }];

    let fakeDateFormatFilter = (inputDate) => {
        return inputDate;
    }

    let fakeMmBUtilService = {
        'getFormatedDate': jasmine.createSpy('getFormatedDate').and.callFake(() => {
            return { 'formatedDate': '12/12/2012', 'dateFormatByLanguage': {} };
        })
    };

    beforeEach(() => {
        angular.mock.module('ib-MmB-filters-module', 'ib-MmB-bookings-list-module', ($provide) => {
            $provide.value('MmBAppConstants', { 'citiesBaseRoute': '/ciudades/', 'defaultCityImage': 'GENERICA.jpg' });
            $provide.value('DateFormatFilter', fakeDateFormatFilter);
            $provide.value('MmBUtilService', fakeMmBUtilService);
        });

        inject((_BookingsListTransformer_, $window, _DateFormatFilter_) => {
            bookingsListTransformer = _BookingsListTransformer_;
            windowLocation = $window;
            filter = _DateFormatFilter_;
        });
    });

    describe('when transformBookingsListInfo function is called ', () => {
        it('and should return transformedInfo with bookingList and homeURL', (done) => {
            let mockBookingInfo = [...fakeBookingInfo];
            mockBookingInfo[0].departureDate = '2017-11-17';
            let returnedValue = bookingsListTransformer.transformBookingsListInfo(mockBookingInfo, fakeCities);
            expect(returnedValue.bookingList[0].cityURL).toEqual('/ciudades/rutaAal.jpg');
            expect(returnedValue.bookingList[0].locator).toEqual('first');
            expect(returnedValue.bookingList[0].arrival.code).toEqual('MAD');
            expect(returnedValue.bookingList[0].departureDate).toEqual(new Date('2017-11-17'));
            expect(returnedValue.homeURL).toEqual(windowLocation.location.origin);
            done();
        });
        it('and should departureDate null and filterDate empty', (done) => {
            let mockBookingInfo = [...fakeBookingInfo];
            mockBookingInfo[0].departureDate = null;
            let returnedValue = bookingsListTransformer.transformBookingsListInfo(mockBookingInfo, fakeCities);
            expect(returnedValue.bookingList[0].cityURL).toEqual('/ciudades/rutaAal.jpg');
            expect(returnedValue.bookingList[0].locator).toEqual('first');
            expect(returnedValue.bookingList[0].arrival.code).toEqual('MAD');
            expect(returnedValue.bookingList[0].departureDate).toBe(null);
            expect(returnedValue.bookingList[0].filterDate).toBe('');
            expect(returnedValue.homeURL).toEqual(windowLocation.location.origin);
            done();
        });
    });
});
