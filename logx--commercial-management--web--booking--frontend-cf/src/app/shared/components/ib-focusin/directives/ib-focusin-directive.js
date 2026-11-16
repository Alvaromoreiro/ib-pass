(function () {


    angular
        .module('ib-focusin')
        .directive('focusin', focusin);

    focusin.$inject = [];
    function focusin () {
        return {
            restrict: 'A',
            link: link
        };
        function link (scope, elem, attrs) {
            //Remove or add class 'focus' in element focused
            const focusHandler = function (isClick) {
                if (isClick) {
                    elem.removeClass('focus');
                } else {
                    elem.addClass('focus');
                }
            };

            // Keydown and Mousedown Events
            angular.element(elem).mousedown(() => {
                focusHandler(true);
            });
            angular.element(elem).keyup(() => {
                focusHandler(false);
            });
            angular.element(elem).focusout(() => {
                focusHandler(true);
            });
        }
    }
})();