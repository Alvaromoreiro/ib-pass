(function () {
    'use strict';

    angular
        .module('ib-filter-module')
        .filter('HourFilter', HourFilter);

    function HourFilter() {
        return formatHour;

        ////////////////

        function formatHour(date) {
            return date ? date.split(' ')[1] : '';
        }

    }
})();