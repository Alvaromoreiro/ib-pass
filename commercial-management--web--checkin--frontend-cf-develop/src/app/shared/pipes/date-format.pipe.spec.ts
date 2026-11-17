import { DateFormatPipe, DateFormatResult } from './date-format.pipe';

interface CaseIt {
    expectation: string;
    data: string;
    expected: {
        weekDay: string;
        monthDay: number;
        monthNumber: number;
        month: string;
        year: number;
        dateTime: string;
    };
};
describe('DateFormatPipe', () => {
    let pipe: DateFormatPipe;

    const emptyDateResult: DateFormatResult = {
        weekDay: '',
        monthDay: '',
        monthNumber: '',
        month: '',
        year: '',
        dateTime: ''
    };

    beforeEach(() => {
        pipe = new DateFormatPipe();
    });

    it('should create', () => {
        expect(pipe).toBeTruthy();
    });

    const duplicateCase: CaseIt[] = [
        {
            expectation: 'should format a valid date without time',
            data: '2024-02-29',
            expected: {
                weekDay: 'WEEKDAY_THURSDAY',
                monthDay: 29,
                monthNumber: 2,
                month: 'MONTH_FEBRUARY',
                year: 2024,
                dateTime: ''
            }
        },
        {
            expectation: 'should format a valid date with time',
            data: '2024-12-25 14:30:00',
            expected: {
                weekDay: 'WEEKDAY_WEDNESDAY',
                monthDay: 25,
                monthNumber: 12,
                month: 'MONTH_DECEMBER',
                year: 2024,
                dateTime: '14:30:00'
            }
        },
        {
            expectation: 'should use UTC values when formatting the date',
            data: '2024-01-01',
            expected: {
                weekDay: 'WEEKDAY_MONDAY',
                monthDay: 1,
                monthNumber: 1,
                month: 'MONTH_JANUARY',
                year: 2024,
                dateTime: ''
            }
        }
    ];

    duplicateCase.forEach(({expectation, data, expected}: CaseIt) => {
        it(expectation, () => {
            const result = pipe.transform(data);

            expect(result).toEqual(expected);
        });
    });

    it('should return an empty result when input is null', () => {
        expect(pipe.transform(null)).toEqual(emptyDateResult);
    });

    it('should return an empty result when input is undefined', () => {
        expect(pipe.transform(undefined)).toEqual(emptyDateResult);
    });

    it('should return an empty result when input is an empty string', () => {
        expect(pipe.transform('')).toEqual(emptyDateResult);
    });

    it('should return an empty result when input is an invalid date', () => {
        expect(pipe.transform('invalid-date')).toEqual(emptyDateResult);
    });

    it('should ignore the time part when calculating date values', () => {
        const result = pipe.transform('2025-07-04 23:59:59');

        expect(result.weekDay).toBe('WEEKDAY_FRIDAY');
        expect(result.monthDay).toBe(4);
        expect(result.monthNumber).toBe(7);
        expect(result.month).toBe('MONTH_JULY');
        expect(result.year).toBe(2025);
        expect(result.dateTime).toBe('23:59:59');
    });
});
