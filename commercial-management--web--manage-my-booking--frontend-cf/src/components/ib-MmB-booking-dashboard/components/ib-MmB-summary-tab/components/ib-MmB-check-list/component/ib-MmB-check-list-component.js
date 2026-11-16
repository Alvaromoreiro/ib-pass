

(function () {
    'use strict';

    // Usage: 
    // Creates: 

    /* istanbul ignore next */
    angular.module('ib-MmB-check-list-module')
        .component('ibMmbCheckList', {
            controller: 'MmBCheckListController',
            controllerAs: 'chkListCtrl',
            bindings: {
                model: '='
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-MmB-check-list-view.html';
            }]
        });
})();

