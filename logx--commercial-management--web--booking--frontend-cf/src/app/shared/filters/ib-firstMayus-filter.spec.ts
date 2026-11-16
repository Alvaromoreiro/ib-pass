describe('FirstMayusFilter test', function () {

    var FirstMayustFilter;

    beforeEach(function () {
        angular.mock.module('ib-booking-filters-module');
        inject(function ($filter) {
            FirstMayustFilter = $filter('FirstMayustFilter', {});
        });
    });
    describe('when firstMayus is called', function () {
        it('when string is pRoBaNdO returns "Probando"', function (done) {
            var stringInput = 'pRoBaNdO';
            expect(FirstMayustFilter(stringInput)).toEqual('Probando');
            done();
        });
    });
});