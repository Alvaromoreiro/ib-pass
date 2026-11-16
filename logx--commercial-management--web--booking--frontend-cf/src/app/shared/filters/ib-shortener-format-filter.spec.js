describe('ShortenerFormatFilter test', function () {

    var ShortenerFormatFilter;

    beforeEach(function () {
        angular.mock.module('ib-booking-filters-module');
        inject(function ($filter) {
            ShortenerFormatFilter = $filter('ShortenerFormatFilter', {});
        });
    });


    describe('when shortenerString is called', function () {
        it('should be able to short and capitalize string', function (done) {
            var stringInput = 'prueba';
            expect(ShortenerFormatFilter(stringInput, 4, true, false)).toEqual('Prue');
            done();
        });
        it('should be able to short and capitalize string', function (done) {
            var stringInput = 'PRUEBA';
            expect(ShortenerFormatFilter(stringInput, null, false, true)).toEqual('pru');
            done();
        });
    });

});