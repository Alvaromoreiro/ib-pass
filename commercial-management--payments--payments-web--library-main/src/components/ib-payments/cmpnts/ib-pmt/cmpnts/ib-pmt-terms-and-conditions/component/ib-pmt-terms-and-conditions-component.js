(function () {
    'use strict';

    // Usage: <ib-pmt-terms-and-conditions></ib-pmt-terms-and-conditions>
    // 
    // Creates: A HTML struture with the info of the terms-and-conditions

    /* istanbul ignore next */
    angular.module('ib-pmt-terms-conditions-module')
        .component('ibPmtTermsAndConditions', {
            controller: 'IbPmtTermsAndConditionsController',
            controllerAs: 'pmtTermsAndConditionCtr',
            bindings: {

            },
            templateUrl: ['PmtConstants', function (PmtConstants) {
                return PmtConstants.ROUTES.templates + 'ib-pmt-terms-and-conditions-view.html';
            }]
        });
})();