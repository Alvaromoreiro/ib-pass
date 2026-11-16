(function () {
    'use strict';

    /* istanbul ignore next */
    angular.module('ib-partner-box-module')
        .component('ibPartnerBoxModule', {
            controller: 'PartnerBoxModuleController',
            controllerAs: 'partnerBoxModuleCtrl',
            bindings: {
                partners: '<'
            },
            templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-partner-box-view.html';
            }]
        });

})();
