(function () {
    'use strict';

    angular
        .module('ib-scroll-module')
        .directive('ibFormScrollToError', ibFormScrollToError);

    ibFormScrollToError.$inject = ['$timeout'];
    function ibFormScrollToError($timeout) {
        // Usage: <form ib-form-scroll-to-error></form>
        //
        // Creates:
        //
        var directive = {
            link: link,
            restrict: 'A',
            required: '^form'
        };
        return directive;

        function link($scope, $element, $attrs) {

            $element.on('submit', checkFirstFormElementError);

            function checkFirstFormElementError() {
                var firstInvalid = angular.element($element).find('.ng-invalid').first();

                if (firstInvalid.length > 0) {
                    $timeout(function () {
                        if ($attrs.modal) {
                            angular.element('.modal-dialog').scrollToElementAnimated(firstInvalid, 20);
                        } else {
                            angular.element('html, body').animate({ 'scrollTop': firstInvalid.offset().top - 20 });
                        }
                    });
                }
            }
        }
    }

})();