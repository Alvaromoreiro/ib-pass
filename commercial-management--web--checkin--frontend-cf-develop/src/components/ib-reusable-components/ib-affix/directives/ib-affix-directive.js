(function () {
    'use strict';
    angular
        .module('ib-affix-module')
        .directive('ibAffix', ibAffix);

    ibAffix.$inject = ['$timeout'];
    function ibAffix($timeout) {
        return {
            restrict: 'A',
            link: link
        }

        function link($scope, $elem, $attrs) {
            var node = angular.element($elem);
            node.stick_in_parent()
                .on('sticky_kit:bottom', function () {
                    node.css({
                        'bottom': '0',
                        'right': 'auto',
                        'left': 'auto'
                    });
                })
                .on('sticky_kit:unbottom', function () {
                    node.css({
                        'bottom': 'auto',
                        'right': 'auto',
                        'left': 'auto'
                    });
                });

            //If slick element has more outer height than its linked element, resize de linked element
            $timeout(function () {
                var affixElement = angular.element('[data-equal="' + $attrs['ibAffix'] + '"]').eq(0);
                var linkedItem = angular.element('[data-equal="' + $attrs['ibAffix'] + '"]').eq(1);
                if (affixElement && linkedItem && affixElement.outerHeight() > linkedItem.outerHeight()) {
                    linkedItem.css('min-height', affixElement.outerHeight()+1);
                }
            });
        }
    }
})();