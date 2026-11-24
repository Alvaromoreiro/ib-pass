(function () {
    'use strict';
    angular
        .module('ib-pmt-order-confirmation-module')
        .directive('pmtAlertConfirmation', pmtAlertConfirmation);

    pmtAlertConfirmation.$inject = ['$timeout', '$window'];
    function pmtAlertConfirmation($timeout, $window) {
        return {
            restrict: 'AE',
            link: link
        }
        function link(scope, elem, attr) {
            var $alert, $target, targetTop, targetLeft, targetHeight, targetHalfWidth, alertPosTop, alertPosLeft;

            $timeout(function () {
                $alert = angular.element(elem).find('.ib-alert-confirmation');
                $target = angular.element('[class="ib-header-common__items-item__icon icon-usuario_logado"]');
                if ($target && $target.offset()) {
                    targetTop = $target.offset().top;
                    targetLeft = $target.offset().left + (+($target.css('padding-left').replace('px', '')));
                    targetHeight = $target.height();
                    targetHalfWidth = $target.innerWidth() / 2;
                    alertPosTop = (targetTop + targetHeight) + 15 + 9; //15px alert arrow height + 9px by design
                    alertPosLeft = targetLeft - targetHalfWidth;
                }
                if ($alert && $window.innerWidth >= 1024) {
                    $alert.css({
                        'position': 'absolute',
                        'top': alertPosTop,
                        'left': alertPosLeft,
                        'display': 'block'
                    });
                }
                $timeout(function () {
                    scope.pmtConfOrderCtrl.model.confirmationInfo.showSuccesfulCardAlert = false;
                }, 5000);
            });
        }
    }
})();