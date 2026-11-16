(function () {

    /* istanbul ignore next */
    const ibPriceMatrixCalendarOutbound = {
        controller: 'PriceMatrixCalendarOutboundController',
        controllerAs: 'priceCalendarOutCtrl',
        bindings: {
            priceMatrixData: '<' //One way binding
        },
        templateUrl: ['BookingAppConstants',function (BookingAppConstants) {
            return BookingAppConstants.templatesRoute + 'ib-price-matrix-calendar-outbound.html';
        }]
    };

    /* istanbul ignore next */
    angular.module('ib-price-matrix-calendar-outbound')
        .component('ibPriceMatrixCalendarOutbound', ibPriceMatrixCalendarOutbound);

})();