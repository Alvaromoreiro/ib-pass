(function () {
    'use strict',
        angular
            .module('ib-tab-panel-module')
            .directive('ibTabPanel', ibTabPanel);

    ibTabPanel.$inject = ['CheckinRouterConstants'];
    function ibTabPanel(CheckinRouterConstants) {
        return {
            restrict: 'A',
            templateUrl: templateUrl
        }
        function templateUrl(scope, attrs) {
            return CheckinRouterConstants.templatesRoute + attrs.view + '.html';
        }
    }
})();