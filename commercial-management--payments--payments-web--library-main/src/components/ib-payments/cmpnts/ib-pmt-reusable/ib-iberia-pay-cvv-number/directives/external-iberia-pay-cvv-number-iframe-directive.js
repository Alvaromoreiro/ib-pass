(function () {
    'use strict';

    angular
        .module('ib-iberia-pay-cvv-number-module')
        .directive('ibIberiaPayCardCvvNumberIframe', ibIberiaPayCardCvvNumberIframe);

    /* istanbul ignore next */
    ibIberiaPayCardCvvNumberIframe.$inject = ['$rootScope', '$sce'];
    function ibIberiaPayCardCvvNumberIframe ($rootScope, $sce) {
        // Usage: <div ib-iberia-pay-card-cvv-number-iframe></div>
        //
        // Creates: injects scripts in body for cvv number card controll and evoid fraud
        //
        const idIframe = 'ibdc-cvv-frame';
        return {
            restrict: 'E',
            template: `<iframe frameborder="0" width="100%" height="56px" scrolling="no" id="${idIframe}" marginwidth="0px" name="ibdc-cvv-frame"  class="ib-form-iframe--mask" ng-src ="{{urlIframeCvv}}"></iframe>`,
            link: link
        };

        function link (scope, element, attrs) {
            if (angular.isUndefined(IBDC) === false) {
                scope.urlIframeCvv = $sce.trustAsResourceUrl(attrs.urlIframeCvv);
            }

            window.addEventListener('blur', () => {
                if (document.activeElement === document.querySelector(`#${idIframe}`)) {
                    $rootScope.$broadcast('closeAllUiSelects', true);
                }
            });
        }
    }
})();