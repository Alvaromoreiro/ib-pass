

(function () {
    'use strict';

    // Usage: 
    // Creates: 

    /* istanbul ignore next */
    angular.module('ib-MmB-time-line-module')
        .component('ibMmbTimeLine', {
            controller: 'TimeLineController',
            controllerAs: 'timeLineCtrl',
            bindings: {
                listTimeLine: '='
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-MmB-time-line-view.html';
            }]
        });
})();

