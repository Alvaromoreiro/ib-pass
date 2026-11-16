(function () {
    'use strict';

    /* istanbul ignore next */
    angular.module('ib-disruption-main-module')
        .component('ibDisruptionDashBoardComponent', {
            controller: 'DisruptionDashboardController',
            controllerAs: 'disruptionCtrl',
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-disruption-main-view.html';
            }]
        });
})();
