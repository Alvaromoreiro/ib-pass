describe('DurationFormatFilter test', function () {

    var DurationFormatFilter;

    beforeEach(function () {
        angular.mock.module('ib-booking-filters-module');
        inject(function ($filter) {
            DurationFormatFilter = $filter('DurationFormatFilter', {});
        });
    });
    describe('when formatDuration is called', function () {
        it('when duration is 0 returns ""', function (done) {
            var durationInput = 0;
            expect(DurationFormatFilter(durationInput)).toEqual('');
            done();
        });
        it('when duration is > 0 returns duration with hours and minutes', function (done) {
            var durationInput = 80;
            expect(DurationFormatFilter(durationInput)).toEqual('1h 20min.');
            done();
        });
    });
});