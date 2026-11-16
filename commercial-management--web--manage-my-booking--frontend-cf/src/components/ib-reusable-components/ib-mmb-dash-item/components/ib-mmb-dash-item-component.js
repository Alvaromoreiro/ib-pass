(function () {
'use strict';

// Usage: <ib-mmb-dash-item></ib-mmb-dash-item>
    // 
    // Creates: 
    // 
    /* istanbul ignore next */

angular
.module('ib-mmb-dash-item')
.component('ibMmbDashItem', {
    controller: 'ibMmbDashItemController',
    controllerAs: 'mmbDashItemCtrl',
    bindings: {
        model: '=',
        ancillariesInfo: '<'
    },
    templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
        return MmBAppConstants.templatesRoute + 'ib-mmb-dash-item.html';
    }]
});
})();