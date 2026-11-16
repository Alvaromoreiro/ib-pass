describe('BookingRedirectionMarketModel Test', function () {
    var model;

    beforeEach(function () {

        angular.mock.module('ib-booking-redirection-market-module', function ($provide) {
        });

        inject(function (_BookingRedirectionMarketModel_) {
            model = _BookingRedirectionMarketModel_;
        });

    });

    describe('When initializeModel is called', function () {
        it(' do nothing', function (done) {
            expect( model.initializeModel()).toBe(undefined);
            done();
        });
    });

});
