(function () {


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
                let firstInvalid, errorIberiaPay, elementFound = null;
                firstInvalid = angular.element($element).find('.ng-invalid').first();
                errorIberiaPay = angular.element($element).find('#creditCardNumberIbPay');
                elementFound = firstInvalid.length > 0 ? firstInvalid : errorIberiaPay.length > 0 ? errorIberiaPay : null;
                if (elementFound) {
                    $timeout(() => {
                        angular.element('html, body').animate({ scrollTop: elementFound.offset().top - 20 });
                    });
                }
            }
        }
    }

})();