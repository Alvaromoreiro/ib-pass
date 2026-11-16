(function () {

    /* istanbul ignore next */
    const ibPriceMatrixCalendar = {
        controller: 'PriceMatrixCalendarController',
        controllerAs: 'priceCalendarCtrl',
        bindings: {
            priceMatrixData: '<' //One way binding
        },
        templateUrl: ['BookingAppConstants',function (BookingAppConstants) {
            return BookingAppConstants.templatesRoute + 'ib-price-matrix-calendar.html';
        }]
    };

    /* istanbul ignore next */
    angular.module('ib-price-matrix-calendar')
        .component('ibPriceMatrixCalendar', ibPriceMatrixCalendar);

})();