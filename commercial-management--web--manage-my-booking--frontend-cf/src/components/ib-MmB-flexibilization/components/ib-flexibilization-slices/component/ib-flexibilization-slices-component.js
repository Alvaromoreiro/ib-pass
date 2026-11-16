(function () {
    'use strict';

    // Usage: <ib-flexibilization-slices model="myCtrl.myModel"></ib-flexibilization-slices>

    /* istanbul ignore next */
    angular.module('ib-flexibilization-slices-module')
        .component('ibFlexibilizationSlices', {
            controller: 'IbFlexSlicesController',
            controllerAs: 'ibFlexSlicesCtrl',
            bindings: {
                slice: '<',
                sliceIndex: '<',
                listSlicesShow: '<',
                selectedSlice: '=',
                isConfirmationSlice: '<'
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-flexibilization-slices-view.html';
            }]
        });
})();