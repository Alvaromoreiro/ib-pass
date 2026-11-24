(function () {
    'use strict';

    angular
        .module('ib-reusable-module')
        .directive('ibIberiaPayScript', ibIberiaPayScript);

    /* istanbul ignore next */
    ibIberiaPayScript.$inject = ['$document', '$rootScope', '$window', '$timeout'];
    function ibIberiaPayScript($document, $rootScope, $window, $timeout) {
        var MAX_LOAD_ATTEMPTS = 3;
        var RETRY_DELAY_MS = 750;
        var directive = {
            restrict: 'E',
            link: link
        };
        return directive;

        function getScriptUrl(attempt) {
            var baseUrl = $rootScope.production
                ? 'https://pay-iberia-pci.indra-netplus.com/iberiapay/js/ibdc-2.0.0.js'
                : 'https://www.test.indra-netplus.com/iberiapay/js/ibdc-2.0.0.js';
            if (attempt <= 1) {
                return baseUrl;
            }
            return baseUrl + (baseUrl.indexOf('?') === -1 ? '?' : '&') + 'retry=' + attempt + '&_=' + Date.now();
        }

        function appendScript(attempt) {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = getScriptUrl(attempt);
            script.onload = function () {
                $rootScope.$broadcast('ibdcScriptLoadSuccess');
            };
            script.onerror = function () {
                console.error(`[PMT][IberiaPay] IBDC script load failed, attempt ${attempt}`);
                if (attempt < MAX_LOAD_ATTEMPTS) {
                    $timeout(function () {
                        if ($window.IBDC) {
                            $rootScope.$broadcast('ibdcScriptLoadSuccess');
                            return;
                        }
                        appendScript(attempt + 1);
                    }, RETRY_DELAY_MS);
                    return;
                }
                $rootScope.$broadcast('ibdcScriptLoadError');
            };
            angular.element($document).find('head')[0].appendChild(script);
        }

        function link() {
            if ($window.IBDC) {
                return;
            }
            appendScript(1);
        }
    }

})();
