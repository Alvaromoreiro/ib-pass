(function () {
    'use strict';

    // Usage: <ib-banner></ib-banner>
    // 
    // Creates: A HTML struture with a promotional banner. 

    /* istanbul ignore next */
    angular.module('ib-banner-module')
        .component('ibBanner', {
            controller: 'IbBookingBannerController',
            controllerAs: 'bannerCtrl',
            bindings: {
                'showAds': '<'
            },
            templateUrl: ['CheckinRouterConstants', function (CheckinRouterConstants) {
                return CheckinRouterConstants.templatesRoute + 'ib-banner-view.html';
            }]
        });
})();