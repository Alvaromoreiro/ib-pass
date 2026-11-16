(function () {
    'use strict';

    // Usage: <ib-MmB-manage-invoice-info model="myCtrl.myModel"></ib-MmB-manage-invoice-info>

    // Creates: Booking common data dashboard.

    /* istanbul ignore next */
    angular.module('ib-MmB-manage-invoice-info-module')
        .component('ibMmbManageInvoiceInfo', {
            controller: 'MmbManageInvoiceInfoController',
            controllerAs: 'manageInvoiceInfoCtrl',
            bindings: {
                model: '=',
                pricemodel: '=',
                passengers: '=',
                baggages: '=',
                co2Footprint: '='
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-MmB-manage-invoice-info-view.html';
            }]
        });
})();
