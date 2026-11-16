(function () {
    'use strict';

    // Usage: <ib-involuntary-change model="" ></ib-involuntary-change>
    //
    // Creates:
    //

    /* istanbul ignore next */
    angular.module('ib-MmB-involuntary-change-module')
        .component('ibMmbInvoluntaryChange', {
            controller: 'MmBInvoluntaryChangeController',
            controllerAs: 'mmBInvoluntaryChangeCtrl',
            bindings: {
                model: '='
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-MmB-time-change-view.html';
            }]
        });
})();
