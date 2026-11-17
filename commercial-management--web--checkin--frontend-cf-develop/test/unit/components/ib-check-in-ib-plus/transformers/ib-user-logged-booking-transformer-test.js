describe('UserLoggedBookingTransformer', function () {
    var transformer;
    var dateFormatFilter;

    beforeEach(function () {
        dateFormatFilter = jasmine.createSpy('DateFormatFilter').and.callFake(function (date) {
            return 'formatted-' + date;
        });
        angular.mock.module('ib-checkin-ib-plus', function ($provide) {
            $provide.value('CheckinAppConstants', { imgCities: '/cities' });
            $provide.value('$filter', function (filterName) {
                return filterName === 'DateFormatFilter' ? dateFormatFilter : angular.noop;
            });
        });
    });

    beforeEach(inject(function (UserLoggedBookingTransformer) {
        transformer = UserLoggedBookingTransformer;
    }));

    it('should add the matching city image and format the departure date', function () {
        var booking = {
            arrival: { city: { code: 'MAD' } },
            departureDate: '2026-10-06'
        };
        var images = [{ cityCode: 'MAD', url: 'madrid.jpg' }];

        var result = transformer.transformUserBookingInfo([booking], images);

        expect(result[0].cityImageUrl).toBe('/cities/madrid.jpg');
        expect(result[0].departureDate).toBe('formatted-2026-10-06');
        expect(dateFormatFilter).toHaveBeenCalledOnceWith('2026-10-06');
    });

    it('should use the generic image when there is no matching city image', function () {
        var booking = {
            arrival: { city: { code: 'LHR' } },
            departureDate: '2026-10-07'
        };

        var result = transformer.transformUserBookingInfo([booking], []);

        expect(result[0].cityImageUrl).toBe('/cities/GENERICA_720x384.jpg');
        expect(result[0].departureDate).toBe('formatted-2026-10-07');
    });

    it('should return an empty list when booking data is missing', function () {
        expect(transformer.transformUserBookingInfo(null, [])).toEqual([]);
    });
});