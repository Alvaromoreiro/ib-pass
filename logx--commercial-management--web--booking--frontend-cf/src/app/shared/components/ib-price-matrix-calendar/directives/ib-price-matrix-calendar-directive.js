(function () {


    angular
        .module('ib-price-matrix-calendar')
        .directive('ibFlightsCalendar', ibFlightsCalendar);

    ibFlightsCalendar.$inject = ['$timeout'];
    /* istanbul ignore next */
    function ibFlightsCalendar ($timeout) {
        return {
            restrict: 'AE',
            link: link
        };

        ///////////

        /**
         * This directive adds a mousenter event to all calendar cells that have price. This event is used to
         * change the background color of mouseovered cell matrix headers
         * @param {Object} scope - the angular scope which the directive´s element belongs
         * @param {Object} elem - The directive´s DOM element
         * @param {Object} attrs - the html attributes of directive´s DOM element
         */
        function link (scope, elem, attrs) {
            $timeout(() => {
                const items = elem[0].querySelectorAll('td:not(.ib-table-daily__col--empty):not(.ib-table-daily__title)');
                function headersHighlight (e) {
                    let head, body;
                    let strHeaders = angular.element(e.currentTarget).attr('headers');
                    strHeaders = strHeaders.split(' ');
                    head = strHeaders[0];
                    body = strHeaders[1];
                    if (e.type === 'mouseenter') {
                        angular.element(elem[0].querySelector('#' + head)).addClass('ib-table-daily__title--hovered');
                        angular.element(elem[0].querySelector('#' + body)).addClass('ib-table-daily__title--hovered');
                    } else {
                        angular.element(elem[0].querySelector('#' + head)).removeClass('ib-table-daily__title--hovered');
                        angular.element(elem[0].querySelector('#' + body)).removeClass('ib-table-daily__title--hovered');
                    }
                }
                angular.element(items).on('mouseenter mouseleave', headersHighlight);
            },0);
        }
    }
})();