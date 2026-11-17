describe('DateFormatFilter test', function () {

    var dateFormatFilter;

    var expectedResult = {
        'weekDay': 'WEEKDAY_SATURDAY',
        'monthDay': 31,
        'monthNumber': 12,
        'month': 'MONTH_DECEMBER',
        'year': 2016,
        'dateTime': '15:30'
    };

    var emptyResult = {
        'weekDay': '',
        'monthDay': '',
        'monthNumber': '',
        'month': '',
        'year': '',
        'dateTime': ''
    };

    beforeEach(angular.mock.module('ib-filter-module'));

    beforeEach(inject(function (_$filter_) {
        dateFormatFilter = _$filter_('DateFormatFilter', {});
    }));

    describe('when formatDate is called', function () {



        it('should be able to format date', inject(function () {
            var dateTest = '2016-12-31 15:30';
            var result = dateFormatFilter(dateTest);
            expect(angular.equals(expectedResult, result)).toBe(true);
        }));

        it('should be able to format date and null', inject(function () {
            var dateTest = null;
            var result = dateFormatFilter(dateTest);
            expect(result).toEqual(emptyResult);
        }));
    });
});
