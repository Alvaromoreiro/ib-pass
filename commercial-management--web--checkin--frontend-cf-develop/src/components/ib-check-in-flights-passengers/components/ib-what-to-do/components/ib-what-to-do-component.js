(function () {
    'use strict';

    // Usage: <ib-what-to-do ></ib-what-to-do>
    // 
    // Creates: 
    // 

    /* istanbul ignore next */
    angular.module('ib-what-to-do-module')
        .component('ibWhatToDo', {
            controller: 'WhatToDoController',
            controllerAs: 'whatdCtrl',
            bindings: {
                'options': '=',
                'type': '<'
            },
            templateUrl: ['CheckinRouterConstants', function (CheckinRouterConstants) {
                return CheckinRouterConstants.templatesRoute + 'ib-what-to-do-view.html';
            }]
        });

})();