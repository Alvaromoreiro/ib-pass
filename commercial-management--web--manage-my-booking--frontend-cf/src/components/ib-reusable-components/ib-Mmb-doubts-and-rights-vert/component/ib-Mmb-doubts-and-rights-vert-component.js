(function () {
    'use strict';

    // Usage: <ib-MmB-doubts-and-rights-vert> </ib-MmB-doubts-and-rights-vert>
    // 
    // Creates: 
    // 
    /* istanbul ignore next */
    angular.module('ib-MmB-doubts-and-rights-vert-module')
        .component('ibMmbDoubtsAndRightsVert', {
            controller: 'MmbDoubtsAndRightsVertController',
            controllerAs: 'doubtsAndRightsVertCtrl',
            bindings: {
                phone: '<',
                isVoucher: '<'
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-Mmb-doubts-and-rights-vert-view.html';
            }]
        });
})();
