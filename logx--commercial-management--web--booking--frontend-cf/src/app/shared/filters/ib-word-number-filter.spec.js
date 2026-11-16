describe('WordNumberFormatFilter test', function () {

    var WordNumberFormatFilter;

    beforeEach(function () {
        angular.mock.module('ib-booking-filters-module');
        inject(function ($filter) {
            WordNumberFormatFilter = $filter('WordNumberFormatFilter', {});
        });
    });


    describe('when wordnumberString is called', function () {
        it('should be able to pluralize an string', function (done) {
            var stringInput = 'PRUEBA';
            expect(WordNumberFormatFilter(stringInput, 2)).toEqual('SOME_PRUEBA');
            done();
        });
        it('should be able to keep an string', function (done) {
            var stringInput = 'PRUEBA';
            expect(WordNumberFormatFilter(stringInput, 1)).toEqual('PRUEBA');
            done();
        });
    });

});