(function () {
    'use strict';

    angular
        .module('ib-iberia-pay-credit-card-number-module')
        .directive('ibIberiaPayCreditCardNumberIframe', ibIberiaPayCreditCardNumberIframe);

    /* istanbul ignore next */
    ibIberiaPayCreditCardNumberIframe.$inject = ['$sce', 'localStorageService', '$rootScope'];
    function ibIberiaPayCreditCardNumberIframe ($sce, localStorageService, $rootScope) {
        // Usage: <div ib-iberia-pay-card-number-iframe></div>
        //
        // Creates: injects scripts in body for number card controll and evoid fraud
        //
        return {
            restrict: 'E',
            template: '<iframe frameborder="0" width="100%" height="56px" scrolling="no" id="ibdc-number-frame" marginwidth="0px" name="ibdc-number-frame" class="ib-form-iframe--mask" ng-src ="{{urlIframeNumber}}" ></iframe>',
            link: link
        };

        function link (scope, element, attrs) {
            let typeCreditCard = false;
            const selectedLoggedCard = !!(localStorageService.get('userLogged') && localStorageService.get('selectedLoggedCard')),
                ccfResquest = localStorageService.get('ibpayCcFeeRequest');
            if (selectedLoggedCard && localStorageService.get('selectedLoggedCard').cardTypeCode) {
                typeCreditCard = localStorageService.get('selectedLoggedCard').cardTypeCode;
            } else if (selectedLoggedCard) {
                typeCreditCard = '';
            }
            if (angular.isUndefined(IBDC) === false) {
                IBDC.init(attrs.vaultId, true, typeCreditCard, ccfResquest);
                $rootScope.$broadcast('updateIberiaPayLoadingIframeStatus', true);
                localStorageService.set('initIframeLoading', new Date());
                scope.urlIframeNumber = $sce.trustAsResourceUrl(attrs.urlIframeNumber);
            }
        }
    }

})();