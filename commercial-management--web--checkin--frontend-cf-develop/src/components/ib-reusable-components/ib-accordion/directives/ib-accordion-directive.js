(function () {
    'use strict';
    angular
        .module('ib-accordion-module')
        .directive('ibAccordionDirective', ibAccordionDirective);

    ibAccordionDirective.$inject = ['CheckinRouterConstants'];
    function ibAccordionDirective(CheckinRouterConstants) {
        return {
            restrict: 'A',
            templateUrl: templateUrl
        }
        function templateUrl(scope, attrs) {
            return CheckinRouterConstants.templatesRoute + attrs.view + '.html'
        }
    }
})();
