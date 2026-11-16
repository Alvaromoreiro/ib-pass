(function () {


    // Usage: <ib-shuttle-fare-detail model="myCtrl.myModel"></ib-shuttle-fare-detail>

    /* istanbul ignore next */
    angular.module('ib-shuttle-fare-detail-module')
        .component('ibShuttleFareDetail', {
            controller: 'IbShuttleFareDetailController',
            controllerAs: 'ibShuttleFareDetailCtrl',
            bindings: {
                model: '='
            },
            templateUrl: ['BookingAppConstants', function (BookingAppConstants) {
                return BookingAppConstants.templatesRoute + 'ib-shuttle-fare-detail-view.html';
            }]
        });
})();