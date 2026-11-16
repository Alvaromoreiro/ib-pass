describe('MultiplyFare filter test', function () {

    var multiplyFare;

    beforeEach(function () {
        angular.mock.module('ib-booking-filters-module', function ($provide) {
        });

        inject(function ($filter) {
            multiplyFare = $filter('MultiplyFare');
        });
    });

    describe('when MultiplyFare is called', function () {

        describe('with invalid fare', function () {

            [
                { desc: 'fare is null', fare: null },
                { desc: 'fare is undefined', fare: undefined }
            ].forEach(function (testCase) {
                it(testCase.desc + ' then returns 0', function () {
                    expect(multiplyFare(testCase.fare)).toBe(0);
                });
            });
        });

        describe('with valid fare and no tier (defaults to classic)', function () {

            [
                { desc: 'tier is null', tier: null },
                { desc: 'tier is undefined', tier: undefined }
            ].forEach(function (testCase) {
                it(testCase.desc + ' then uses classic multiplier (x5)', function () {
                    expect(multiplyFare(10, testCase.tier)).toBe(50);
                });
            });
        });

        describe('with valid fare and each tier multiplier', function () {

            [
                { tier: 'classic',    multiplier: 5 },
                { tier: 'silver',     multiplier: 6 },
                { tier: 'gold',       multiplier: 7 },
                { tier: 'platinum',   multiplier: 8 },
                { tier: 'Infinity',   multiplier: 8 },
                { tier: 'InfinityPlus', multiplier: 8 }
            ].forEach(function (testCase) {
                it('tier ' + testCase.tier + ' multiplies fare by ' + testCase.multiplier, function () {
                    expect(multiplyFare(10, testCase.tier)).toBe(10 * testCase.multiplier);
                });
            });
        });

        it('rounds the result to the nearest integer', function () {
            expect(multiplyFare(1.3, 'classic')).toBe(Math.round(1.3 * 5));
        });
    });
});
