(function () {
    'use strict';

    // Usage: <ib-flexibilization-confirmation model="myCtrl.myModel"></ib-flexibilization-confirmation>

    /* istanbul ignore next */
    angular.module('ib-flexibilization-confirmation-module')
        .component('ibFlexibilizationConfirmation', {
            controller: 'IbFlexibilizationConfirmationController',
            controllerAs: 'ibFlexibilizationConfirmationCtrl',
            bindings: {
                model: '<',
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-flexibilization-confirmation-view.html';
            }]
        });
})();