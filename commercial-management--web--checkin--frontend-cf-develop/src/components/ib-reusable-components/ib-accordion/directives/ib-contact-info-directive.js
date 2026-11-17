(function () {
    'use strict';

    angular
        .module('ib-accordion-module')
        .directive('ibContactInfo', ContactInfoDirective);

    ContactInfoDirective.$inject = ['CheckinRouterConstants'];
    function ContactInfoDirective(CheckinRouterConstants) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            restrict: 'A',
            bindToController: true,
            scope: {
                accModel: '='
            },
            templateUrl: function (scope, attrs) {
                return CheckinRouterConstants.templatesRoute + attrs.view + '.html'
            },
            controller: 'AccordionFlightsPassengersController',
            controllerAs: 'accCtrl'
        };
        return directive;
    }
})();