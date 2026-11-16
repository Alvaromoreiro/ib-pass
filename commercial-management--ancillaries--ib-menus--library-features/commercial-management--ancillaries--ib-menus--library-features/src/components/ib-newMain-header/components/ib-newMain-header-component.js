(function () {
    'use strict';
    // Usage: <ib-new-main-header></ib-new-main-header>
    //
    // Creates: The header for booking flow, with the iberia´s logo and one world´s logo
    angular
        .module('ib-newMain-header-module')
        .component('ibNewMainHeader', {
            controller: 'NewMainHeaderController',
            controllerAs: 'newMainHeaderCtrl',
            bindings: {},
            templateUrl: ['$rootScope', function ($rootScope) {
                return $rootScope.routes.templates + 'ib-newMain-header-view.html';
            }]
        });
})();