(function () {


    // Usage: <ib-shuttle-without-points model="myCtrl.myModel"></ib-shuttle-without-points>

    /* istanbul ignore next */
    angular.module('ib-shuttle-without-points-module')
        .component('ibShuttleWithoutPoints', {
            controller: 'IbShuttleWithoutPointsController',
            controllerAs: 'ibShuttleWithoutPointsCtrl',
            bindings: {
                model: '='
            },
            templateUrl: ['BookingAppConstants', function (BookingAppConstants) {
                return BookingAppConstants.templatesRoute + 'ib-shuttle-without-points-view.html';
            }]
        });
})();