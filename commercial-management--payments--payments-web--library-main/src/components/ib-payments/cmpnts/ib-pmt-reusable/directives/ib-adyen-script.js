(function () {
    'use strict';

    angular
        .module('ib-reusable-module')
        .directive('ibAdyenScript', ibAdyenScript);

    /* istanbul ignore next */
    ibAdyenScript.$inject = ['$document', '$compile', '$sce', '$rootScope', 'PmtConstants', 'PmtUtilsService'];
    function ibAdyenScript($document, $compile, $sce, $rootScope, PmtConstants, PmtUtilsService) {
        // Usage: <ib-adyen-script></ib-adyen-script>
        //
        // Creates: inject adyen script for 3ds2
        //
        var directive = {
            restrict: 'E',
            link: link
        };
        return directive;

        function link($scope) {
            var script, cssStyle, url = $rootScope.production ? 'https://checkoutshopper-live.adyen.com/checkoutshopper/sdk/3.23.0/' : 'https://checkoutshopper-test.adyen.com/checkoutshopper/sdk/3.23.0/';
            script = '<script type="text/javascript" src="' + $sce.trustAsResourceUrl(url + 'adyen.js') + '" integrity="sha384-fErYEDZTTzeO2aEcuTtsB49H+E6rwz7ODY7lMfb2/H9WKf20W0KaMbQFS17q6YE/" crossorigin="anonymous"></script>';
            cssStyle = '<link rel="stylesheet" href="' + $sce.trustAsResourceUrl(url + 'adyen.css') + '" integrity="sha384-2ZygKOnU23yWkltsfDRsIMKXUBpYbr9Jx8kmIcgRnnoniBN6hwnyCr87XoYVv8Ux" crossorigin="anonymous">';
            angular.element($document).find('body').prepend($compile(script)($scope));
            angular.element($document).find('body').prepend($compile(cssStyle)($scope));
        }
    }

})();