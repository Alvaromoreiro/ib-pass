(function () {


    angular
        .module('ib-booking-trip-info-module')
        .directive('ibAppendAccordionWrapper', ibAppendAccordionWrapper);

    ibAppendAccordionWrapper.$inject = [];

    function ibAppendAccordionWrapper () {
        // Usage: If showAccordion is true, appends accordion as child node of the div. It mantains content and wrapp it inside an accordion.
        //     <div ib-append-accordion-wrapper show-accordion="true"></div>
        // Creates: uib accordion that contains div content (Depending on showAccordion boolean)
        //
        const directive = {
            restrict: 'A',
            transclude: true,
            scope: {
                showAccordion: '='
            },
            template: '<uib-accordion ng-show="showAccordion" class="ib-accordion ib-accordion--double-dashed ib-accordion--normal ib-accordion--scala" close-others="oneAtATime"> <div uib-accordion-group ng-click="eventClick(status.open)" ng-init="status.open = $root.redemptionAccordion" class="panel-default" is-open="status.open" template-url="web-booking/templates/ib-accordion-heading-template-border-collapse-inverse.html"><uib-accordion-heading><span class="ib-heading ib-heading--type-4">{{"AVAILABILITY_REDEMPTION_OTHER_FLIGHTS_TITLE"|translate}}</span><span class="ib-accordion__icon " ng-class="{\'icon-flecha_1_arriba\': status.open, \'icon-flecha_1_abajo\': !status.open}"></span></uib-accordion-heading><div ng-transclude></div></div></uib-accordion><div ng-show="!showAccordion" ng-transclude></div>',
            link: function (scope, element, attr) {
                scope.eventClick = function (estado) {
                    scope.$root.redemptionAccordion = estado;
                };
            }
        };
        return directive;

    }

})();