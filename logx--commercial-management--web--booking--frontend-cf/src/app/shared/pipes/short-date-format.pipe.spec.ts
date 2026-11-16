import { TestBed } from '@angular/core/testing';
import { ShortDateFormatPipe } from '@src/app/shared/pipes/short-date-format.pipe';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';

describe('ShortDateFormatPipe', () => {
    let pipe: ShortDateFormatPipe;
    let mockSessionStorageService: jasmine.SpyObj<CommonsSessionStorageService>;

    const mockCommercialData = {
        languages: [
            {
                code: 'en',
                dateFormat: {
                    short: 'MM/dd/yyyy'
                }
            },
            {
                code: 'es',
                dateFormat: {
                    short: 'dd/MM/yyyy'
                }
            },
                        {
                code: 'fr',
                dateFormat: {
                    short: 'm.d.yyyy'
                }
            },
        ]
    };

    beforeEach(() => {
        mockSessionStorageService = jasmine.createSpyObj('CommonsSessionStorageService', ['get']);
        mockSessionStorageService.get.and.returnValue(mockCommercialData);

        TestBed.configureTestingModule({
            providers: [
                ShortDateFormatPipe,
                { provide: CommonsSessionStorageService, useValue: mockSessionStorageService }
            ]
        });

        pipe = new ShortDateFormatPipe(mockSessionStorageService);
    });

    afterEach(() => {
        BookingAppConstants.lang = 'es';
    });

    it('should create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should format date in month first format (en)', () => {
        const inputDate = '24/01/2024';
        BookingAppConstants.lang = 'en';
        expect(pipe.transform(inputDate)).toBe('01/24/2024');
    });

    it('should format date in day first format (es)', () => {
        const inputDate = '24/01/2024';
        BookingAppConstants.lang = 'es';
        expect(pipe.transform(inputDate)).toBe('24/01/2024');
    });

    it('should format date with different separators', () => {
        const inputDate = '24/01/2024';
        BookingAppConstants.lang = 'fr';
        expect(pipe.transform(inputDate)).toBe('01/24/2024');
    });
});
