(function () {
    'use strict';
    /* istanbul ignore next */
    angular.module('ib-pmt-slider-module')
        .component('ibPmtSlider', {
            controller: 'PmtSliderController',
            controllerAs: 'pmtSliderCtrl',
            bindings: {
                paymentInfo: '<',
                customerData: '<'
            },
            templateUrl: ['$rootScope', function ($rootScope) {
                return $rootScope.routes.templates + 'ib-pmt-slider-view.html';
            }]
        });
})();