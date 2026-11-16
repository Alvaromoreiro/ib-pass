(function () {
    'use strict';

    // Usage:
    // 
    // Creates:
    // 
    /* istanbul ignore next */
    angular
        .module('ib-anonymous-search-module')
        .component('ibAnonymousSearch', {
            controller: 'AnonymousSearchController',
            controllerAs: 'searchCtrl',
            bindings: {
                title: '@searchTitle',
                buttonText: '@buttonText',
                buttonStyle: '@buttonStyle',
                titleStyle: '@'
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-anonymous-search-view.html';
            }]
        });
})();