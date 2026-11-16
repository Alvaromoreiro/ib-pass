

(function () {
    'use strict';

    // Usage: 
    // Creates: 

    /* istanbul ignore next */
    angular.module('ib-ancillaries-module')
        .component('ibAncillaries', {
            controller: 'AncillariesController',
            controllerAs: 'ancillaCtrl',
            bindings: {
                model: '='
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-ancillaries-view.html';
            }]
        });
})();

