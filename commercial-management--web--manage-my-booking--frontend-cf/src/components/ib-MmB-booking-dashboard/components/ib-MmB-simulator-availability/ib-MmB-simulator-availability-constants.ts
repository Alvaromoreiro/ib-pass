(function () {
    'use strict';

    angular.module('ib-MmB-simulator-availability-module').constant('SimulatorAvailabilityConstants', {
        'SLICK_STATUS': {
            'LOADING': 'LOADING',
            'NOT_AVAILABLE': 'NOT_AVAILABLE',
            'AVAILABLE': 'AVAILABLE',
            'DISABLED': 'DISABLED'
        },
        'CARROUSEL_FLIGHT_SELECTED': {
            'OUTBOUND_FLIGHT': 0,
            'RETURN_FLIGHT': 1
        },
        'daysAfter': 3,
        'daysBefore': 3,
        'WEEKDAYS': {
            1: 'WEEKDAY_MONDAY',
            2: 'WEEKDAY_TUESDAY',
            3: 'WEEKDAY_WEDNESDAY',
            4: 'WEEKDAY_THURSDAY',
            5: 'WEEKDAY_FRYDAY',
            6: 'WEEKDAY_SATURDAY',
            0: 'WEEKDAY_SUNDAY'
        },
        'MONTHS': {
            0: 'MONTH_JANUARY',
            1: 'MONTH_FEBRUARY',
            2: 'MONTH_MARCH',
            3: 'MONTH_APRIL',
            4: 'MONTH_MAY',
            5: 'MONTH_JUNE',
            6: 'MONTH_JULY',
            7: 'MONTH_AUGUST',
            8: 'MONTH_SEPTEMBER',
            9: 'MONTH_OCTOBER',
            10: 'MONTH_NOVEMBER',
            11: 'MONTH_DECEMBER'
        }
    });
})();
