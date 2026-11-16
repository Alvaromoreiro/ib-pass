(function () {
    'use strict';

    // Usage: <ib-flexibilization-slice-confirmation model="myCtrl.myModel"></ib-flexibilization-slice-confirmation>

    /* istanbul ignore next */
    angular.module('ib-flexibilization-slice-confirmation-module')
        .component('ibFlexibilizationSliceConfirmation', {
            controller: 'IbFlexibilizationSliceConfirmationController',
            controllerAs: 'ibFlexSliceConfCtrl',
            bindings: {
                selectedSlices: '=',
                totalShow: '=',
                tripsLength: '=',
                listSlicesShow: '=',
                'relatedContent': '<',
                sisterCities : '<'
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-flexibilization-slice-confirmation-view.html';
            }]
        });
})();