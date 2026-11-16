(function () {
    'use strict';
    angular
        .module('ib-alert-hide-module')
        .directive('ibAlertHide', ibAlertHide);
    
    /* istanbul ignore next */
    function ibAlertHide() {
        return {
            restrict: 'AE',
            link: angular.noop,
            controller: 'AlertHideController',
            controllerAs: 'alertCtrl'
        };
    }
})();