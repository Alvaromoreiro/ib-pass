(function () {
    'use strict';

    // Usage: <ib-pmt-wine-club></ib-pmt-wine-club>
    // 
    // Creates: A HTML structure with information and a link to the Wine Club's landing page

    /* istanbul ignore next */
    angular.module('ib-pmt-wine-club-module')
        .component('ibPmtWineClub', {
            controller: 'IbPmtWineClubController',
            controllerAs: 'wineClubCtrl',
            bindings: {
                model: '='
            },
            templateUrl: ['$rootScope', function ($rootScope) {
                return $rootScope.routes.templates + 'ib-pmt-wine-club-view.html';
            }]
        });
})();