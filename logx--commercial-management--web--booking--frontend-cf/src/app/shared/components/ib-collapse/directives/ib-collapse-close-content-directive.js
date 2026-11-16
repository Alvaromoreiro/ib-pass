(function () {


    angular
        .module('ib-collapse')
        .directive('collapseCloseContent', collapseCloseContent);

    collapseCloseContent.$inject = ['$animate', '$timeout'];
    function collapseCloseContent ($animate, $timeout) {
        return {
            restrict: 'AE',
            controller: 'ibCollapseController',
            link: link
        };
        function link (scope) {
            scope.$on('closeContent', () => {
                const element = angular.element('[close-content]');
                $animate.addClass(element, 'fadeInDown').then(() => {
                    $animate.removeClass(element, 'fadeInDown');
                    $timeout(() => {
                        scope.$apply(() => {
                            $animate.addClass(element, 'fadeOutDown');
                        });
                    });
                });
            });
        }

    }
})();