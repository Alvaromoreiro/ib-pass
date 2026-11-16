(function () {
    'use strict';

    // Usage: <ib-steps position="1"></ib-steps>
    //
    // Creates:
    //
    angular
        .module('ib-steps-module')
        .component('ibSteps', {
            controller: 'StepsController',
            controllerAs: 'stepsCtrl',
            bindings: {
                model: '<'
            },
            templateUrl: ['$rootScope', function ($rootScope) {
                return $rootScope.routes.templates + 'ib-steps-view.html';
            }]
        });

})();