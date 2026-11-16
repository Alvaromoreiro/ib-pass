(function () {


    angular
        .module('ib-booking-fare-details-module')
        .directive('iberiaFlightsFareDetails', iberiaFlightsFareDetails);

    iberiaFlightsFareDetails.$inject = ['$timeout', '$window'];

    function iberiaFlightsFareDetails ($timeout) {
        return {
            restrict: 'AE',
            link: link
        };
        function link (scope, elem) {
            // Launch event resize when clicks in a fare card
            $timeout(() => {
                angular.element('[data-attr="fare-collapse"]').bind('click', (e) => {

                    if( (elem[0].className === 'ib-box-select-simple__header-wrapper u-position-relative' ||
                    elem[0].className === 'ib-box-select-simple__header-wrapper u-position-relative ib-box-select-simple__header-wrapper--without-discount')) {
                        scope.$parent.collapse.isCollapsed = !scope.$parent.collapse.isCollapsed;
                    }
                });
            });
        }
    }
})();

