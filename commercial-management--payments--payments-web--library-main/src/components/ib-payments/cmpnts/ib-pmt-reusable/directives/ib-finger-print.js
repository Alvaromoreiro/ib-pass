(function () {
    'use strict';

    angular
        .module('ib-reusable-module')
        .directive('ibFingerPrint', ibFingerPrint);

    /* istanbul ignore next */
    ibFingerPrint.$inject = ['$document', '$compile', 'PmtConstants'];
    function ibFingerPrint($document, $compile, PmtConstants) {
        // Usage: ibFingerPrint
        //
        // Creates: injects scripts in head and body in order to send data to fraud control
        //
        var directive = {
            restrict: 'E',
            link: link
        };
        return directive;

        function link($scope, $element, $attrs) {
            var script = '<script type="text/javascript" src="https://h.online-metrix.net/fp/tags.js?org_id=' + PmtConstants.PAYMENTS.ORG_ID + '&session_id=' + $scope.$eval($attrs.sessionId) + '"></script>';
            var noScript = angular.element('<noscript></noscript>');
            var iframe = angular.element('<iframe style="width: 100px; height: 100px; border: 0; position:absolute; top: -5000px;" src="https://h.online-metrix.net/fp/tags?org_id=' + PmtConstants.PAYMENTS.ORG_ID + '&session_id=' + $scope.$eval($attrs.sessionId) + '"></iframe>');
            angular.element($document).find('head').append($compile(script)($scope));
            angular.element($document).find('body').prepend($compile(noScript.append(iframe))($scope));
        }
    }

})();