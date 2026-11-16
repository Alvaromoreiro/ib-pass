(function () {
    'use strict';

    /* istanbul ignore next */
    angular.module('ib-disruption-passenger-rights-module')
        .component('ibDisruptionPassengerRights', {
            bindings: {
                onShowPassengerRights: '&'
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-disruption-passenger-rights-view.html';
            }]
        });
})();
