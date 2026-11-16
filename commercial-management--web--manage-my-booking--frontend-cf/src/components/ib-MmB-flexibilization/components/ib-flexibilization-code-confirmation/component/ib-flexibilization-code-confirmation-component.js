(function () {
    'use strict';

    // Usage: <ib-flexibilization-code-confirmation model="myCtrl.myModel"></ib-flexibilization-code-confirmation>

    /* istanbul ignore next */
    angular.module('ib-flexibilization-code-confirmation-module')
        .component('ibFlexibilizationCodeConfirmation', {
            controller: 'IbFlexibilizationCodeConfirmationController',
            controllerAs: 'ibFlexibilizationCodeConfirmationCtrl',
            bindings: {
                model: '=',
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-flexibilization-code-confirmation-view.html';
            }]
        });
})();