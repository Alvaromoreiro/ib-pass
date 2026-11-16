(function () {
    'use strict';

    angular
        .module('ib-collapse')
        .directive('collapseCloseContent', collapseCloseContent);

    collapseCloseContent.$inject = ['$document','$animate','$timeout'];
    function collapseCloseContent($document, $animate,$timeout) {
        return {
            restrict: 'AE',
            controller: 'ibCollapseController',
            link: link
        };
        function link(scope) {
            scope.$on('closeContent', function() {
                var element = angular.element('[close-content]');
                $animate.addClass(element, 'fadeInDown').then(function() {
                    $animate.removeClass(element, 'fadeInDown');
                    $timeout(function() {
                        scope.$apply(function() {
                            $animate.addClass(element, 'fadeOutDown');
                        });
                    });
      
                });
            });
        }
    }
})();