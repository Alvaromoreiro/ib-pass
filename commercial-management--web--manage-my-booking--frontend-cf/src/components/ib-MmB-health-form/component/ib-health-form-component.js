(function () {
    'use strict';

    // Usage: <ib-health-form model="myCtrl.myModel"></ib-health-form>

    /* istanbul ignore next */
    angular.module('ib-health-form-module')
        .component('ibHealthForm', {
            controller: 'IbHealthFormController',
            controllerAs: 'HealthFormCtrl',
            bindings: {
                passengers: '<',
                componentTitle: '<',
                isChangeFlight: '<',
                isRefund: '<'
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-health-form-view.html';
            }]
        });
})();