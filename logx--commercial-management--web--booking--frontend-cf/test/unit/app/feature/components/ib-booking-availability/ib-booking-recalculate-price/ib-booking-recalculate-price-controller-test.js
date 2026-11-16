describe('BookingRecalculatePriceController Test', function () {
    var scope, controller, localStorageService;



    beforeEach(function () {

        angular.mock.module('ib-booking-recalculate-price-module', 'LocalStorageModule', function ($provide) {
        });

        inject(function ($controller, $rootScope, _localStorageService_) {
            scope = $rootScope.$new();
            localStorageService = _localStorageService_;

            controller = $controller('BookingRecalculatePriceController', {
                '$scope': scope
            });

            scope.$digest();
        });

    });

    describe('When recalculatePrice is called', function () {
        it(' recalculatePrice is emmited', function (done) {

            spyOn(scope, '$emit');

            controller.recalculatePrice();

            expect(scope.$emit).toHaveBeenCalledWith('recalculatePrice');
            done();
        });
    });

});
