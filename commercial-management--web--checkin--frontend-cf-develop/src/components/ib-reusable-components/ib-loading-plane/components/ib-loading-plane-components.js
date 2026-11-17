(function () {
    'use strict';

    // Usage: <ib-loading-plane></ib-loading-plane>
    // 
    // Creates: A HTML structure with the loading plane transition


    /* istanbul ignore next */
    angular.module('ib-loading-plane-module')
        .component('ibLoadingPlane', {
            controller: 'ibLoadingPlaneController',
            controllerAs: 'loadingPlaneCtrl',
            bindings: {
            },
            templateUrl: ['CheckinRouterConstants', function (CheckinRouterConstants) {
                return CheckinRouterConstants.templatesRoute + 'ib-loading-plane-view.html';
            }]
        });
})();