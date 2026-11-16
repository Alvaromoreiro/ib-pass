(function () {
    'use strict';

    angular
        .module('ib-bob-widget-module')
        .directive('externalBobIframeSrc', externalBobIframeSrc);

    externalBobIframeSrc.$inject = ['$rootScope', '$document', 'localStorageService', 'MmBAppConstants'];
    /* istanbul ignore next */
    function externalBobIframeSrc ($rootScope, $document, localStorageService, MmBAppConstants) {
        return {
            restrict: 'AE',
            link: link
        };
        function link (scope, elem, attrs) {
            const vm = this;
            vm.passengers = localStorageService.get('passengers');
            vm.bookingInfo = localStorageService.get('bookingInfo');
            const operator = vm.bookingInfo.order.slices[0].segments[0].flight.operationalCarrier.code;
            const flightCode = vm.bookingInfo.order.slices[0].segments[0].flight.marketingCarrier.code + vm.bookingInfo.order.slices[0].segments[0].flight.marketingFlightNumber;
            const date = vm.bookingInfo.order.slices[0].segments[0].departureUtcDateTime.split('T')[0];
            const departureFrom = vm.bookingInfo.order.slices[0].segments[0].departure.code;
            const arrivalTo = vm.bookingInfo.order.slices[0].segments[0].arrival.code;
            const specialUserBob = localStorageService.get('specialUserBob');
            const language = $rootScope.appLang;
            const bobUrl = MmBAppConstants.BOB_WIDGET_URL ? MmBAppConstants.BOB_WIDGET_URL : 'https://pre.booking.bob.io' ;
            const ownerId = MmBAppConstants.BOB_WIDGET_OWNER_ID ? MmBAppConstants.BOB_WIDGET_OWNER_ID : '2559e2e8-42dc-4507-b290-ed74632a2ffe';
            const type_checkin_payload = specialUserBob ? '&type_checkin=business' : '';

            if(document.getElementById('bob-widget-script') === null) { // if it's not already present
                // append the widget to the page
                angular.element($document).find('body').append('<script type = "text/javascript" id="bob-widget-script" data-container="b_container" src="' + bobUrl + '/widget/main.js?affiliate=iberia&widget-owner=' + ownerId + '&widget-load-hidden=true&lang=' + language +'&operator=' + operator + '&marketer=IB&date=' + date + '&from=' + departureFrom + '&to=' + arrivalTo + '&flightcode=' + flightCode + type_checkin_payload + '"><\/script>');
            }

        }

    }
})();