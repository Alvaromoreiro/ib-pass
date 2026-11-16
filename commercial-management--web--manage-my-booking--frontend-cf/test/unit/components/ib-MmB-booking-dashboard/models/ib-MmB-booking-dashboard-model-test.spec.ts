describe('BookingDashboardModel test', function () {


    var BookingDashboardModel;

    beforeEach(function () {
        angular.mock.module('ib-MmB-booking-dashboard-module',  function () {

        });
        inject(function (_BookingDashboardModel_) {
            BookingDashboardModel = _BookingDashboardModel_;
        });
    });


    describe('when BookingDashboardModel() is called', function () {
        it('Should return model correctly', function () {
            BookingDashboardModel.initializeModel();
            expect(BookingDashboardModel).toBeDefined();
        });
    });
});
