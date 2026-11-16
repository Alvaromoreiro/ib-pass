describe('LoggedBookingItemController test', () => {
    var scope, controller;

    var controllerDependencies = {
        '$scope': {},
    };

    var ctrlBinds = {
        'bookingItemModel': true
    };


    beforeEach(() => {
        angular.mock.module('ib-logged-booking-item-module');

        inject(($componentController, $rootScope) => {
            scope = $rootScope.$new();
            controllerDependencies.$scope = scope;
            controller = $componentController('ibLoggedBookingItem', {
                $scope: scope
            }, ctrlBinds);
            controller.$onInit();
        });
    });

    it('When manageBooking() is called, should emit event', (done) => {
        controller.manageBooking();
        scope.$on('searchBookingItem');
        done();
    });
});
