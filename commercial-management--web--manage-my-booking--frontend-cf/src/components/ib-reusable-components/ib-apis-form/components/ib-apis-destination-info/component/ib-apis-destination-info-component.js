(function () {
    'use strict';

    // Usage: <ib-apis-destination-info></ib-apis-destination-info>
    //
    // Creates: APIS form destination info section
    //
    /* istanbul ignore next */
    angular
        .module('ib-apis-destination-info-module')
        .component('ibApisDestinationInfo', {
            controller: 'ApisDestinationInfoController',
            controllerAs: 'apisDestinationInfoCtrl',
            bindings: {
                destinationData: '=',
                inTransit: '=',
                states: '<',
                requiredFields: '<',
                containerForm: '=',
                passengerData: '=',
                isInfant: '<',
                relatedAdultData: '<'
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-apis-destination-info-view.html';
            }]
        });
})();
