(function () {
    'use strict';

    // Usage: <ib-apis-visa-expiry-date></ib-apis-visa-expiry-date>
    //
    // Creates: component VISA date selector
    //
    /* istanbul ignore next */
    angular
        .module('ib-apis-visa-expiry-date-module')
        .component('ibApisVisaExpiryDate', {
            controller: 'ApisVisaExpiryDateController',
            controllerAs: 'apisVisaExpiryDateCtrl',
            bindings: {
                showDay: '@',
                visa: '=?',
                containerForm: '=?',
                day: '=?', //two-way binding
                month: '=?',
                year: '=?',
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-apis-visa-expiry-date-view.html';
            }]
        });
})();
