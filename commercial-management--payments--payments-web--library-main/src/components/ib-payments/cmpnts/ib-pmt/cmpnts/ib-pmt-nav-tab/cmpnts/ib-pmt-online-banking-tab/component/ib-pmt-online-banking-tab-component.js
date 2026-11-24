(function () {
    'use strict';

    // Usage: <ib-pmt-online-banking></ib-pmt-online-banking>
    //
    // Creates: A HTML structure with the logo and text of the online banking provider.

    /* istanbul ignore next */
    angular.module('ib-pmt-online-banking-tab-module')
        .component('ibPmtOnlineBankingTab', {
            controller: 'IbPmtOnlineBankingTabController',
            controllerAs: 'onlineBankingTabCtrl',
            bindings: {
                onlineBankingInfo: '<',
                containerForm: '=',
                requiredFields: '<',
                submittedTab: '='
            },
            templateUrl: ['$rootScope', function ($rootScope) {
                return $rootScope.routes.templates + 'ib-pmt-online-banking-tab-view.html';
            }]
        });
})();