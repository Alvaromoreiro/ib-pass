import { TestBed } from '@angular/core/testing';
import { DateFormatPipe } from '@shared/pipes/date-format.pipe';
import { AJSBookingUtilsService } from '@src/app/shared/services/ib-utils/ib-booking-utils-service-bridge.service';
import dayjs from 'dayjs';

const fakeBookingUtilsService = {
    getFormatedDate: jasmine.createSpy('getFormatedDate')
}

const mockResponse = {
    dateTime: '14:30',
    weekDay: 'WEEKDAY_SUNDAY',
    hour: 2,
    minutes: 0,
    day: 15,
    monthNumber: 10,
    month: 'MONTH_OCTOBER',
    year: 2023,
    originalDate: '2023-10-15T14:30:00+02:00',
    formatedDate: null
}

describe('DateFormatPipe', () => {
    let pipe: DateFormatPipe;
    beforeEach(() => {
            TestBed.configureTestingModule({
                providers:[
                    { provide: AJSBookingUtilsService, useValue: fakeBookingUtilsService },
                ],
            });
            pipe = new DateFormatPipe(fakeBookingUtilsService);
        });
    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

  describe('if inputValue is filled ', () => {
    beforeEach(()=>{
        fakeBookingUtilsService.getFormatedDate = jasmine.createSpy('getFormatedDate').and.returnValue({formatedDate:'formatedDate'})
    })
    it('withoud time and format is null, should return formattedDate according to default format',()=>{
        fakeBookingUtilsService.getFormatedDate = jasmine.createSpy('getFormatedDate').and.returnValue(null);
        mockResponse.formatedDate = null;
        const inputDate = '2023-10-15';
        let resultValue = pipe.transform(inputDate, null);
        expect(resultValue.dateTime).toEqual('')
        expect(resultValue.originalDate).toEqual(dayjs(inputDate).format())
    })
    it('and format is null, should return formattedDate according to default format',()=>{
        fakeBookingUtilsService.getFormatedDate = jasmine.createSpy('getFormatedDate').and.returnValue(null);
        mockResponse.formatedDate = null;
        const inputDate = '2023-10-15 14:30';
        mockResponse.originalDate = dayjs(inputDate).format();
        mockResponse.hour = new Date('2023-10-15').getHours();
        let resultValue = pipe.transform(inputDate, null);
        expect(resultValue).toEqual(mockResponse)
    })
    it('and format is filled, should return formattedDate according to format string',()=>{
        const inputDate = '2023-10-15 14:30';
        const format = 'YYYY-MM-DD';
        mockResponse.formatedDate = 'formatedDate';
        mockResponse.originalDate = dayjs(inputDate).format();
        mockResponse.hour = new Date('2023-10-15').getHours();
        let resultValue = pipe.transform(inputDate, format);
        expect(resultValue).toEqual(mockResponse);
    })
   })
});
