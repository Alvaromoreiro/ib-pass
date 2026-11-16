(function () {
    'use strict';

    // Usage: <ib-login-access ></ib-login-access>
    // 
    // Creates: A HTML struture with the login modules to access. 


    /* istanbul ignore next */
    angular.module('ib-login-access-old-module')
        .component('ibLoginAccessOld', {
            controller: 'IbLoginAccessOldController',
            controllerAs: 'loginAccessCtrl',
            bindings: {
            },
            templateUrl: ['MmBAppConstants',function (MmBAppConstants) {
                return MmBAppConstants.templatesRoute + 'ib-login-access-view.html';
            }]
        });
})();