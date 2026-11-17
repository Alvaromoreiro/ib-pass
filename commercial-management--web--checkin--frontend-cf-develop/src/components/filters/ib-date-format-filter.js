(function () {
    'use strict';

    angular
        .module('ib-filter-module')
        .filter('DateFormatFilter', DateFormatFilter);

    function DateFormatFilter() {

        var months = [
            'MONTH_JANUARY',
            'MONTH_FEBRUARY',
            'MONTH_MARCH',
            'MONTH_APRIL',
            'MONTH_MAY',
            'MONTH_JUNE',
            'MONTH_JULY',
            'MONTH_AUGUST',
            'MONTH_SEPTEMBER',
            'MONTH_OCTOBER',
            'MONTH_NOVEMBER',
            'MONTH_DECEMBER'
        ];
        var weekDays = [
            'WEEKDAY_SUNDAY',
            'WEEKDAY_MONDAY',
            'WEEKDAY_TUESDAY',
            'WEEKDAY_WEDNESDAY',
            'WEEKDAY_THURSDAY',
            'WEEKDAY_FRYDAY',
            'WEEKDAY_SATURDAY',
        ];

        return formatDate;

        ////////////////

        function formatDate(inputDate) {
            var dateTime, numWeekDay, month, utilsDate, auxInputDate, date;
            if (inputDate != null) {
                dateTime = inputDate.indexOf(' ') !== -1 ? inputDate.split(' ')[1] : '';
                auxInputDate = inputDate.indexOf(' ') === -1 ? inputDate : inputDate.slice(0, inputDate.indexOf(' '));
                date = new Date(auxInputDate);
                numWeekDay = date.getUTCDay();
                month = date.getUTCMonth();

                utilsDate = {
                    'weekDay': weekDays[numWeekDay],
                    'monthDay': date.getUTCDate(),
                    'monthNumber': month + 1,
                    'month': months[month],
                    'year': date.getUTCFullYear(),
                    'dateTime': dateTime,
                };
            } else {
                utilsDate = {
                    'weekDay': '',
                    'monthDay': '',
                    'monthNumber': '',
                    'month': '',
                    'year': '',
                    'dateTime': ''
                };
            }


            return utilsDate;
        }
    }
})();
