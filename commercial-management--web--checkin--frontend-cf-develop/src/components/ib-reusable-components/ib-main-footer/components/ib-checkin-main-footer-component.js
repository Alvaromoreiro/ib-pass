(function () {
    'use strict';

    /* istanbul ignore next */
    angular
        .module('ib-checkin-main-footer-module')
        .component('ibCheckinMainFooter', {
            controller: 'IbCheckinMainFooterController',
            controllerAs: 'ckMainFooterCtrl',
            templateUrl: ['CheckinRouterConstants', function (CheckinRouterConstants) {
                return CheckinRouterConstants.templatesRoute + 'ib-checkin-main-footer.html';
            }]
        });

})();