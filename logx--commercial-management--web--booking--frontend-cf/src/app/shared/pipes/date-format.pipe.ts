import dayjs from 'dayjs';
import { Inject, Pipe, PipeTransform } from '@angular/core';
import { AJSBookingUtilsService } from '../services/ib-utils/ib-booking-utils-service-bridge.service';

@Pipe({
    name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

    private months = [
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

    private weekDays = [
        'WEEKDAY_SUNDAY',
        'WEEKDAY_MONDAY',
        'WEEKDAY_TUESDAY',
        'WEEKDAY_WEDNESDAY',
        'WEEKDAY_THURSDAY',
        'WEEKDAY_FRYDAY',
        'WEEKDAY_SATURDAY'
    ];

    constructor (@Inject(AJSBookingUtilsService) private BookingUtilService) {}

    transform (inputDate: string, format: string): any {
        let auxInputDate, dateTime, date, numWeekDay, month, utilsDate, transformedDate, deleteHyphen;
        if (inputDate) {
            auxInputDate = inputDate.indexOf(' ') === -1 ? inputDate : inputDate.slice(0, inputDate.indexOf(' '));
            dateTime = inputDate.indexOf(' ') !== -1 ? inputDate.split(' ')[1] : '';
            date = new Date(auxInputDate);
            numWeekDay = date.getUTCDay();
            month = date.getUTCMonth();
            deleteHyphen = new RegExp('-', 'g');
            transformedDate = inputDate.replace(deleteHyphen, '/');
            utilsDate = {
                dateTime: dateTime,
                weekDay: this.weekDays[numWeekDay],
                hour: date.getHours(),
                minutes: date.getMinutes(),
                day: date.getUTCDate(),
                monthNumber: month + 1,
                month: this.months[month],
                year: date.getUTCFullYear(),
                originalDate: dayjs(transformedDate).format()
            };
            utilsDate.formatedDate = this.BookingUtilService.getFormatedDate(inputDate, format) ? this.BookingUtilService.getFormatedDate(inputDate, format).formatedDate : null;
        }
        return utilsDate;
    }

}
