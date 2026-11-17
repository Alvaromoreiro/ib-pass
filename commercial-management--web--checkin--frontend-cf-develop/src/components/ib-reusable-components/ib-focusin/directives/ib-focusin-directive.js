(function () {
    'use strict';

    angular
        .module('ib-focusin')
        .directive('focusin', focusin);

    focusin.$inject = [];
    function focusin() {
        return {
            restrict: 'A',
            link: link
        };
        function link(scope, elem, attrs) {
            //Remove or add class 'focus' in element focused
            var focusHandler = function (isClick) {
                if (isClick) {
                    elem.removeClass('focus');
                } else {
                    elem.addClass('focus');
                }
            };

            // Keydown and Mousedown Events
            angular.element(elem).mousedown(function() {
                focusHandler(true);
            });
            angular.element(elem).keyup(function() {
                focusHandler(false);
            });
            angular.element(elem).focusout(function() {
                focusHandler(true);
            });
        }
    }
})();