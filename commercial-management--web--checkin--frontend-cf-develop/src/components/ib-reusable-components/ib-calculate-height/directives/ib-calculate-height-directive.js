(function () {
    'use strict';
    angular
        .module('ib-calculate-height-module')
        .directive('ibCalculateHeight', ibCalculateHeight);

    ibCalculateHeight.$inject = ['$timeout'];

    function ibCalculateHeight($timeout) {
        return {
            restrict: 'A',
            link: link
        }
        function link(scope, element, attrs) {
            $timeout(function () {
                var $elements = angular.element(element).find(attrs.selector);
                var $auxHeight = [];
                var maxHeight;

                $elements.css('height', 'auto');

                angular.forEach($elements, function (value) {
                    var $this = angular.element(value);
                    $auxHeight.push($this[0].clientHeight);
                });

                maxHeight = Math.max.apply(Math, $auxHeight);
                $elements.css('min-height', maxHeight + 'px');
            }, 200);
        }
    }
})();
