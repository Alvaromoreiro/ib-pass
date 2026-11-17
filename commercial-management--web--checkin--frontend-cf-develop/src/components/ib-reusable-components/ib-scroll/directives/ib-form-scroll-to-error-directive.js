(function () {
    'use strict';

    angular
        .module('ib-scroll-module')
        .directive('ibFormScrollToError', ibFormScrollToError);

    ibFormScrollToError.$inject = ['$timeout'];
    function ibFormScrollToError ($timeout) {
        // Usage: <form ib-form-scroll-to-error></form>
        //
        // Creates:
        //
        const directive = {
            link: link,
            restrict: 'A',
            required: '^form'
        };
        return directive;

        function link ($scope, $element, $attrs) {

            $element.on('submit', checkFirstFormElementError);

            function checkFirstFormElementError () {
                const firstInvalid = angular.element($element).find('.ng-invalid').first();
                if (firstInvalid.length > 0) {
                    $timeout(() => {
                        angular.element('html, body').animate({ scrollTop: firstInvalid.offset().top - angular.element('.ib-header-common--full-container').innerHeight() });
                    });
                }
            }
        }
    }

})();