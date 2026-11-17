(function () {
    'use strict';

    angular
        .module('ib-collapse')
        .directive('collapseCloseContent', collapseCloseContent);

    collapseCloseContent.$inject = ['$document', '$animate', '$timeout'];
    function collapseCloseContent($document, $animate, $timeout) {
        return {
            restrict: 'AE',
            controller: 'CollapseDetailsController',
            link: link
        }
        function link(scope, elem, attrs) {
            scope.$on('closeContent', function (event, element) {
                var element = angular.element('[collapse-close-content]');
                $animate.addClass(element, 'fadeInDown').then(function () {
                    $animate.removeClass(element, 'fadeInDown');
                    $timeout(function () {
                        scope.$apply(function () {
                            $animate.addClass(element, 'fadeOutDown');
                        });
                    });

                });
            });
        }

    }
})();