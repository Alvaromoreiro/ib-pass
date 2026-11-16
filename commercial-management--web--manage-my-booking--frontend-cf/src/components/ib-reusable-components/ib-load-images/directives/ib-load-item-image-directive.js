(function () {
    'use strict';

    angular
        .module('ib-load-images-module')
        .directive('ibLoadItemImage', ibLoadItemImage);

    ibLoadItemImage.$inject = ['$rootScope'];
    function ibLoadItemImage($rootScope) {
        // Usage: 
        //
        // Creates:
        //
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link($scope, $element, $attrs) {
            $attrs.$observe('ibLoadItemImage', function () {
                var image;

                if (!$attrs.ibLoadItemImage) {
                    // No attribute specified, so use default
                    angular.element($element).css('background-image', 'url(' + $attrs.defaultImage + ')');
                } else {
                    image = new Image();
                    image.src = $attrs.ibLoadItemImage;
                    image.onload = function () {
                        //Image loaded- set the background image to it
                        angular.element($element).css('background-image', 'url(' + $attrs.ibLoadItemImage + ')');
                    };
                    image.onerror = function () {
                        //Image failed to load- use default
                        angular.element($element).css('background-image', 'url(' + $attrs.defaultImage + ')');
                    };
                }
            });

        }
    }

})();