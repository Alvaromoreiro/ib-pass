(function () {


    // Usage: <ib-banner></ib-banner>
    //
    // Creates: A HTML struture with a promotional banner.

    /* istanbul ignore next */
    angular.module('ib-banner-module')
        .component('ibBanner', {
            controller: 'IbBookingBannerController',
            controllerAs: 'bannerCtrl',
            bindings: {
            },
            templateUrl: ['BookingAppConstants', function (BookingAppConstants) {
                return BookingAppConstants.templatesRoute + 'ib-banner-view.html';
            }]
        });
})();