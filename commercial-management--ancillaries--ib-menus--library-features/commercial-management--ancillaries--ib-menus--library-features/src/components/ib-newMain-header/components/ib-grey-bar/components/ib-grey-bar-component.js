(function () {
    'use strict';

    angular
        .module('ib-grey-bar-module')
        .component('ibGreyBar', {
            controller: 'GreyBarController',
            controllerAs: 'greyBarCtrl',
            bindings: {
                model: '<'
            },
            templateUrl: ['$rootScope', function ($rootScope) {
                return $rootScope.routes.templates + 'ib-grey-bar-view.html';
            }]
        });
})();