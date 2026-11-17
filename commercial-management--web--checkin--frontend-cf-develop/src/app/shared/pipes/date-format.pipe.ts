import { Pipe, PipeTransform } from '@angular/core';

export interface DateFormatResult {
    weekDay: string;
    monthDay: number | '';
    monthNumber: number | '';
    month: string;
    year: number | '';
    dateTime: string;
}

@Pipe({
    name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
    private readonly months = [
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

    private readonly weekDays = [
        'WEEKDAY_SUNDAY',
        'WEEKDAY_MONDAY',
        'WEEKDAY_TUESDAY',
        'WEEKDAY_WEDNESDAY',
        'WEEKDAY_THURSDAY',
        'WEEKDAY_FRIDAY',
        'WEEKDAY_SATURDAY'
    ];

    /**
     * Converts a date string into date parts and translation keys.
     * The date portion is interpreted in UTC to preserve the legacy filter behavior.
     *
     * @param inputDate Date string, optionally including a time after a space.
     * @returns Date parts, or an empty result when the input is missing or invalid.
     */
    transform (inputDate: string | null | undefined): DateFormatResult {
        if (!inputDate) {
            return this.getEmptyDateResult();
        }

        const separatorIndex = inputDate.indexOf(' ');
        const datePart =
            separatorIndex === -1
                ? inputDate
                : inputDate.slice(0, separatorIndex);

        const dateTime =
            separatorIndex === -1
                ? ''
                : inputDate.split(' ')[1];

        const date = new Date(datePart);

        if (Number.isNaN(date.getTime())) {
            return this.getEmptyDateResult();
        }

        const month = date.getUTCMonth();

        return {
            weekDay: this.weekDays[date.getUTCDay()],
            monthDay: date.getUTCDate(),
            monthNumber: month + 1,
            month: this.months[month],
            year: date.getUTCFullYear(),
            dateTime
        };
    }

    /**
     * Returns the default value used when no valid date is available.
     */
    private getEmptyDateResult (): DateFormatResult {
        return {
            weekDay: '',
            monthDay: '',
            monthNumber: '',
            month: '',
            year: '',
            dateTime: ''
        };
    }
}
