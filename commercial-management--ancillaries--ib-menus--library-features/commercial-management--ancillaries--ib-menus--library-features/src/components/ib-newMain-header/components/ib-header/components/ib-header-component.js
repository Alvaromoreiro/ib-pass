(function () {
    'use strict';

    angular
        .module('ib-header-module')
        .component('ibHeader', {
            controller: 'HeaderController',
            controllerAs: 'headerCtrl',
            bindings: {
                model: '<',
                login: '=',
                advancedSearch:'='
            },
            templateUrl: ['$rootScope', '$attrs', function ($rootScope) {
                return $rootScope.routes.templates + 'ib-header-view.html';
            }]
        });
})();