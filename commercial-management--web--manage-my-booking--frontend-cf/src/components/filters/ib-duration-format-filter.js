(function () {
    'use strict';

    angular.module('ib-MmB-filters-module')
        .filter('DurationFormatFilter', DurationFormatFilter);

    function DurationFormatFilter() {
        return formatDuration;

        ////////////////

        function formatDuration(duration) {
            var durationFormatted, hoursFormatted = '';
            var hours = 0, minutes = 0;

            if (duration > 0) {
                hours = Math.floor(duration / 60);
                minutes = duration % 60;
                hoursFormatted = hours < 10 ? ('0' + hours) : hours;
                durationFormatted = (hours > 0 ? (hoursFormatted + 'h ') : '') + (minutes > 0 ? (minutes + 'min.') : '');
            }
            return durationFormatted;
        };
    }
})();