(function () {
    'use strict';

    // Usage: <ib-flexibilization-availability model="myCtrl.myModel"></ib-flexibilization-availability>

    /* istanbul ignore next */
    angular.module('ib-flexibilization-availability-module')
        .component('ibFlexibilizationAvailability', {
            controller: 'IbFlexAvailabilityController',
            controllerAs: 'ibFlexAvailabilityCtrl',
            bindings: {
                availabilityData: '=',
                newSisterCitiesModel: '='
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-flexibilization-availability-view.html';
            }]
        });
})();