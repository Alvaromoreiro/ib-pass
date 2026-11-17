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
            templateUrl: ['CheckinRouterConstants', function (CheckinRouterConstants) {
                return CheckinRouterConstants.templatesRoute + 'ib-anonymous-search-view.html';
            }]
        });
})();