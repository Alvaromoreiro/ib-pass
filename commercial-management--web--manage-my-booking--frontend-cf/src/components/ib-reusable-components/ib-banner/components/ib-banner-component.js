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
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-banner-view.html';
            }]
        });
})();