(function () {
    'use strict';

    // Usage: <ib-MmB-car-card></ib-MmB-car-card>
    //
    // Creates:
    //
    /* istanbul ignore next */
    angular.module('ib-MmB-car-card-module')
        .component('ibMmbCarCard', {
            controller: 'MmBCarController',
            controllerAs: 'carCardCtrl',
            bindings: {
                model: '=',
                index: '='
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-MmB-car-card-view.html';
            }]
        });
})();
