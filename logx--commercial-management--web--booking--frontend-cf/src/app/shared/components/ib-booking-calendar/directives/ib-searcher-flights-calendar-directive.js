(function () {


    angular
        .module('ib-booking-calendar-module')
        .directive('searcherFlightsCalendar', searcherFlightsCalendar);

    searcherFlightsCalendar.$inject = ['$timeout', '$window'];
    function searcherFlightsCalendar ($timeout, $window) {
        return {
            restrict: 'AE',
            link: link
        };
        function link (scope, elem, attrs) {
            const items = elem[0].querySelectorAll('td:not(.ib-table-daily__col--empty):not(.ib-table-daily__title)');

            function headersHighlight (e) {
                let head;
                let body;
                let strHeaders = angular.element(e.currentTarget).attr('headers');
                strHeaders = strHeaders.split(' ');
                head = strHeaders[0];
                body = strHeaders[1];
                if (e.type === 'mouseenter' || e.type === 'mouseover') {
                    angular.element(elem[0].querySelector('#' + head)).addClass('ib-table-daily__title--hovered');
                    angular.element(elem[0].querySelector('#' + body)).addClass('ib-table-daily__title--hovered');
                } else{
                    angular.element(elem[0].querySelector('#' + head)).removeClass('ib-table-daily__title--hovered');
                    angular.element(elem[0].querySelector('#' + body)).removeClass('ib-table-daily__title--hovered');
                }
            }

            angular.element(items).on('mouseenter mouseleave', headersHighlight);
        }
    }
})();