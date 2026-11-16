describe('DateFormatFilter test', function () {

    var dateFormatFilter, getTimezoneOffset;
    var fakeBookingUtilService = {
        getFormatedDate: jasmine.createSpy()
    };
    var expectedResult = {
        'dateTime': '',
        'weekDay': 'WEEKDAY_SATURDAY',
        'day': 31,
        'monthNumber': 12,
        'month': 'MONTH_DECEMBER',
        'year': 2016,
        'hour': 0,
        'minutes': 0,
        'formatedDate': null
    }

    beforeEach(function () {
        angular.mock.module('LocalStorageModule', 'ib-booking-filters-module', function ($provide) {
            $provide.value('BookingUtilService', fakeBookingUtilService);
        });
        inject(function ($filter) {
            dateFormatFilter = $filter('DateFormatFilter', {});
        });
    });

    describe('when formatDate is called', function () {
        it('should be able to format date', function (done) {
            var dateTest = '2016-12-31 ', formattedDate;
            var currentTimeZoneOffsetInHours = (new Date('2016-12-31')).getTimezoneOffset() / 60;
            formattedDate = dateFormatFilter(dateTest);
            formattedDate.hour += currentTimeZoneOffsetInHours;
            expect(formattedDate).toEqual(expectedResult);
            dateTest = '2016-12-31';
            formattedDate = dateFormatFilter(dateTest);
            formattedDate.hour += currentTimeZoneOffsetInHours;
            expect(formattedDate).toEqual(expectedResult);
            done();
        });
    });
});