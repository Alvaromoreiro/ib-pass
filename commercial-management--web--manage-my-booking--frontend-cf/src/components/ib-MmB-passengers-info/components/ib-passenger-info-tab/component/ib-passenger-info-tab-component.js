(function () {
    'use strict';

    /**
     *  Usage: <ib-passenger-info-tab></ib-passenger-info-tab>
     *    
     * Creates: Creates an html section with the passengeres information tab compent and its forms
     */
    /* istanbul ignore next */
    angular.module('ib-passenger-info-tab-module')
        .component('ibPassengerInfoTab', {
            controller: 'PassengerInfoTabController',
            controllerAs: 'pasInTabCtrl',
            bindings: {
                passengersTabModel: '=',
                companies: '<',
                indexTab: '<',
                optionalInformation:'<',
                passengerInformation: '<'
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-passenger-info-tab-view.html';
            }]
        });
})();