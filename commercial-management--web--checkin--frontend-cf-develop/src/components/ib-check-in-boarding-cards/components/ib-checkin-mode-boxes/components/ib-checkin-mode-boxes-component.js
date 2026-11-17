(function () {
    'use strict';

    // Usage: <ib-check-in-mode-boxes></ib-check-in-mode-boxes>
    // 
    // Creates: 
    // 

    /* istanbul ignore next */
    angular.module('ib-checkin-mode-boxes-module')
        .component('ibCheckInModeBoxes', {
            controller: 'IbCheckInModeBoxesController',
            controllerAs: 'modeBoxesCtrl',
            bindings: {
                modesList: '='
            },
            templateUrl: ['CheckinRouterConstants',function (CheckinRouterConstants) {
                return CheckinRouterConstants.templatesRoute + 'ib-checkin-mode-boxes-view.html';
            }]
        });

})();