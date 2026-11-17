describe('HourFilter test', function () {

    var hourFilter;

    beforeEach(angular.mock.module('ib-filter-module'));


    beforeEach(inject(function ($filter) {
        hourFilter = $filter('HourFilter', {});
    }));

    describe('when HourFilter is called', function () {
        var date = '2016-12-31 12:45';

        it('should be able to format hour', inject(function () {
            expect(hourFilter(date)).toBe('12:45');
        }));

        it('and input date is null, should return empty string', inject(function () {
            expect(hourFilter(null)).toBe('');
        }));
    });
});