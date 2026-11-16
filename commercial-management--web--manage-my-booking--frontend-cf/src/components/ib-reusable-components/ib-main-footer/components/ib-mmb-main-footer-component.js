(function() {
    'use strict';

    /* istanbul ignore next */
    var ibMainFooter = {
        controller: 'mainFooterController',
        controllerAs: 'mainFooterCtrl',
        bindings: {
            'footerModel' :'<',
            'isFullWidth' : '<',
            'isFixed' : '<',
        },
        templateUrl: ['MmBAppConstants', function (MmBAppConstants) {
            return MmBAppConstants.templatesRoute + 'ib-mmb-main-footer.html';
        }]
    };

    angular
        .module('ib-mmb-main-footer-module')
        .component('ibMmbMainFooter', ibMainFooter);

})();
