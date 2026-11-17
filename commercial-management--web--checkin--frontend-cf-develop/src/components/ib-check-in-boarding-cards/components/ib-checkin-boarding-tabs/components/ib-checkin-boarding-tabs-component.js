(function () {
    'use strict';

    // Usage: <ib-check-in-boarding-tabs passengers-list="" passenger-selected="" prefix-list=""></ib-check-in-boarding-tabs>
    // 
    // Creates: 
    // 

    /* istanbul ignore next */
    angular.module('ib-checkin-boarding-tabs-module')
        .component('ibCheckInBoardingTabs', {
            controller: 'IbCheckInBoardingTabsController',
            controllerAs: 'tabsCtrl',
            bindings: {
                passengersList: '=',
                indexPassengerSelected: '=',
                prefixList: '<',
                passInfoForm: '=',
                selectedTab: '=',
                showEmail: '<',
                showPhone: '<'
            },
            templateUrl: ['CheckinRouterConstants', function (CheckinRouterConstants) {
                return CheckinRouterConstants.templatesRoute + 'ib-checkin-boarding-tabs-view.html';
            }]
        });

})();