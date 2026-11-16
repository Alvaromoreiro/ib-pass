(function () {


    angular
        .module('ib-booking-fare-details-module')
        .directive('iberiaFlightsCabinsDetail', iberiaFlightsCabinsDetail);

    iberiaFlightsCabinsDetail.$inject = ['$timeout', '$window'];

    function iberiaFlightsCabinsDetail ($timeout, $window) {
        return {
            restrict: 'AE',
            link: link
        };
        function link (scope, elem, attrs) {
            // Launch event resize when clicks in a radio button - Equal Height Fix
            $timeout(() => {
                angular.element('[data-box-select-radio="check-mobile"]').bind('click touchstart', () => {
                    if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
                        angular.element($window).trigger('resize');
                    } else {
                        $window.dispatchEvent(new Event('resize'));
                    }
                });
            });
        }
    }
})();