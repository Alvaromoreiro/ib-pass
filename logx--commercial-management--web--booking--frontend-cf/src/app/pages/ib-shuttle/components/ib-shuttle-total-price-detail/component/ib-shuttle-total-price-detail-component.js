(function () {


    // Usage: <ib-shuttle-total-price-detail model="myCtrl.myModel"></ib-shuttle-total-price-detail>

    /* istanbul ignore next */
    angular.module('ib-shuttle-total-price-detail-module')
        .component('ibShuttleTotalPriceDetail', {
            controller: 'IbShuttleTotalPriceDetailController',
            controllerAs: 'ibShuttleTotalPriceDetailCtrl',
            bindings: {
                model: '=',
                redemptionPrice: '<'
            },
            templateUrl: ['BookingAppConstants', function (BookingAppConstants) {
                return BookingAppConstants.templatesRoute + 'ib-shuttle-total-price-detail-view.html';
            }]
        });
})();
