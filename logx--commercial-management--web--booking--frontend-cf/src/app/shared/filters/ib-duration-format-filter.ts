(function () {


    angular.module('ib-booking-filters-module')
        .filter('DurationFormatFilter', DurationFormatFilter);

    function DurationFormatFilter () {
        return formatDuration;

        ////////////////

        function formatDuration (duration) {
            let durationFormatted = '';
            let hours = 0, minutes = 0;

            if (duration > 0) {
                hours = Math.floor(duration / 60);
                minutes = duration % 60;
                durationFormatted = (hours > 0 ? (hours + 'h ') : '') + (minutes > 0 ? (minutes + 'min.') : '');
            }
            return durationFormatted;
        }
    }
})();