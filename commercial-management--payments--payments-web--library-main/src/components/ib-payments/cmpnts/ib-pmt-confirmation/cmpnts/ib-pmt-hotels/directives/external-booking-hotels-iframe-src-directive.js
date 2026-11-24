(function () {
    'use strict';

    angular
        .module('ib-pmt-hotels-module')
        .directive('externalBookingHotelsIframeSrc', externalBookingHotelsIframeSrc);

    externalBookingHotelsIframeSrc.$inject = ['$document','$rootScope'];
    /* istanbul ignore next */
    function externalBookingHotelsIframeSrc ($document,$rootScope) {
        return {
            restrict: 'AE',
            link: link
        };
        function link (scope, elem, attrs) {
            let lang = $rootScope.appLang || 'es';
            if (lang === 'en') lang = 'en-gb';

            angular.element($document).find('body')
                .append(' <script type="text/javascript" id="sp_widget" data-hash="_07f3f87e4c4a1" data-container="b_container" data-size="95%x400" data-tpncy="false" src="https://aff.bstatic.com/static/affiliate_base/js/booking_sp_widget.js?checkin=' + attrs.checkInDate + '&checkout=' + attrs.checkOutDate + '&iata_orr=1&iata=' + attrs.destinationCode + '&lang=' + lang + '"><\/script>');
        }

    }
})();