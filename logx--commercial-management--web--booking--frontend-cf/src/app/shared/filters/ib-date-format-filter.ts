import angular from 'angular';

angular
    .module('ib-booking-filters-module')
    .filter('DateFormatFilter', DateFormatFilter);

DateFormatFilter.$inject = ['BookingUtilService'];
export function DateFormatFilter (BookingUtilService) {

    const months = [
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
    const weekDays = [
        'WEEKDAY_SUNDAY',
        'WEEKDAY_MONDAY',
        'WEEKDAY_TUESDAY',
        'WEEKDAY_WEDNESDAY',
        'WEEKDAY_THURSDAY',
        'WEEKDAY_FRYDAY',
        'WEEKDAY_SATURDAY'
    ];

    return formatDate;

    ////////////////

    function formatDate (inputDate:string, format:string) {
        let auxInputDate, dateTime, date, numWeekDay, month, utilsDate;
        if (inputDate) {
            auxInputDate = inputDate.indexOf(' ') === -1 ? inputDate : inputDate.slice(0, inputDate.indexOf(' '));
            dateTime = inputDate.indexOf(' ') !== -1 ? inputDate.split(' ')[1] : '';
            date = new Date(auxInputDate);
            numWeekDay = date.getUTCDay();
            month = date.getUTCMonth();
            utilsDate = {
                dateTime: dateTime,
                weekDay: weekDays[numWeekDay],
                hour: date.getHours(),
                minutes: date.getMinutes(),
                day: date.getUTCDate(),
                monthNumber: month + 1,
                month: months[month],
                year: date.getUTCFullYear()
            };
            utilsDate.formatedDate = BookingUtilService.getFormatedDate(inputDate, format) ? BookingUtilService.getFormatedDate(inputDate, format).formatedDate : null;
        }
        return utilsDate;
    }

}
