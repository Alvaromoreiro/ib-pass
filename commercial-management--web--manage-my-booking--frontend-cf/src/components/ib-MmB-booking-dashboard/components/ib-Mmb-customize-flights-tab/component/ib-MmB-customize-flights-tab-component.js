(function () {
    'use strict';

    // Usage: <ib-MmB-customize-tab></ib-MmB-customize-tab>
    // 
    // Creates: 
    // 
    /* istanbul ignore next */
    angular
        .module('ib-MmB-customize-flights-tab-module')
        .component('ibMmbCustomizeFlightTab', {
            controller: 'CustomizeFlightTabController',
            controllerAs: 'custFlightTabCtrl',
            bindings: {
                model: '=',
                showAncillaries: '=',
                showSpecialMeals: '=',
                ancillariesToShow: '=',
                showRedirection: '=',
                showRedirectionCheckin: '=',
                bidableInfo: '=',
                seatChangeConditions: '<'
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-MmB-customize-flights-tab-view.html';
            }]
        });

})();