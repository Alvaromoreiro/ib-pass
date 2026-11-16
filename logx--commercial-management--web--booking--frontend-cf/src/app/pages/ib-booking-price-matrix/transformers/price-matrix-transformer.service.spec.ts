import { TestBed } from '@angular/core/testing';
import { AJSBookingUtilsService } from '@src/app/shared/services/ib-utils/ib-booking-utils-service-bridge.service';
import { AJSCurrencyService, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { StorageServiceMock } from '@test-mocks/Services/StorageServiceMock';
import { PriceMatrixTransformer } from './price-matrix-transformer.service';
import { BookingPriceMatrixConstants } from '../ib-booking-price-matrix-constants';
import { DateFormatPipe } from '@src/app/shared/pipes/date-format.pipe';

const fakeBookingUtilService = {
    generateCalendarRequestData: jasmine.createSpy('generateCalendarRequestData').and.returnValue({ slices: [], passengers: [], marketCode: '', preferredCabin: '' }),
    getFormatedDate: jasmine.createSpy('getFormatedDate').and.callFake((utilsDate) => `${utilsDate.year}-${utilsDate.monthNumber}-${utilsDate.day}`)
};

const fakeCurrencyService = {
    getCurrencyObject: jasmine.createSpy('getCurrencyObject').and.callFake((currency) => ({ code: currency.code, symbol: '€' }))
};

const fakeDateFormatPipe = {
    transform: jasmine.createSpy('transform').and.callFake((inputDate: string) => {
        const date = new Date(inputDate);
        return {
            year: date.getUTCFullYear(),
            monthNumber: date.getUTCMonth() + 1,
            day: date.getUTCDate()
        };
    })
};

// Helper: builds a ribbon-mode response. Dates from startDate, numCells cells.
// If useInBoundRow=true: outbound=null, inBoundRow has cells.
// If useInBoundRow=false: inbound=null, outBoundRow has cells.
function buildRibbonData(opts: {
    useInBoundRow?: boolean;
    startDate?: string;
    numCells?: number;
    withCurrency?: boolean;
} = {}) {
    const {
        useInBoundRow = true,
        startDate = '2023-07-03', // Monday
        numCells = 7,
        withCurrency = false
    } = opts;

    const cells = buildRibbonCells(startDate, numCells, withCurrency ? 'EUR' : null);
    const row = { cells, columns: [], rows: [] };

    return {
        data: {
            availability: { status: 'OK' },
            inbound: useInBoundRow ? { date: '2023-07-03' } : null,
            outbound: useInBoundRow ? null : { date: '2023-07-10' },
            flightRatio: '1.0',
            calendarRibbon: {
                inBoundRow: useInBoundRow ? row : null,
                outBoundRow: useInBoundRow ? null : row
            },
            contextMetadata: withCurrency
                ? { currencies: [{ code: 'EUR', symbol: '€', decimals: 2 }] }
                : undefined
        }
    };
}

function buildRibbonCells(startDate: string, numCells: number, currency: string | null) {
    const cells: any[] = [];
    const start = new Date(startDate);
    for (let i = 0; i < numCells; i++) {
        const d = new Date(start);
        d.setUTCDate(d.getUTCDate() + i);
        const boundDate =
            d.getUTCFullYear() +
            '-' + ('0' + (d.getUTCMonth() + 1)).slice(-2) +
            '-' + ('0' + d.getUTCDate()).slice(-2);
        const cell: any = { available: true, boundDate };
        if (i === 0 && currency) {
            cell.totalPrice = { currency };
        }
        cells.push(cell);
    }
    return cells;
}

// Helper: builds a 2x2 matrix-mode response.
function buildMatrixData() {
    return {
        data: {
            availability: { status: 'OK' },
            inbound: { date: '2023-06-15' },
            outbound: { date: '2023-06-10' },
            flightRatio: '1.0',
            calendarGrid: {
                columns: [
                    { inboundDate: '2023-06-15', selectedDate: true },
                    { inboundDate: '2023-06-16', selectedDate: false }
                ],
                rows: [
                    {
                        outboundDate: '2020-06-10',
                        selectedDate: true,
                        cells: [
                            { totalPrice: { currency: 'EUR', amount: 100 }, selectedCell: false },
                            { totalPrice: null, selectedCell: false }
                        ]
                    },
                    {
                        outboundDate: '2020-06-11',
                        selectedDate: false,
                        cells: [
                            { totalPrice: null, selectedCell: false },
                            { totalPrice: null, selectedCell: false }
                        ]
                    }
                ]
            },
            contextMetadata: undefined
        }
    };
}

describe('PriceMatrixTransformer', () => {
    let service: PriceMatrixTransformer;
    let sessionStorage: StorageServiceMock;
    beforeEach(() => {
        sessionStorage = new StorageServiceMock();
        fakeBookingUtilService.generateCalendarRequestData.calls.reset();
        fakeBookingUtilService.getFormatedDate.calls.reset();
        fakeCurrencyService.getCurrencyObject.calls.reset();
        fakeDateFormatPipe.transform.calls.reset();

        TestBed.configureTestingModule({
            providers: [
                { provide: AJSBookingUtilsService, useValue: fakeBookingUtilService },
                { provide: AJSCurrencyService, useValue: fakeCurrencyService },
                { provide: CommonsSessionStorageService, useValue: sessionStorage },
                { provide: DateFormatPipe, useValue: fakeDateFormatPipe }
            ]
        });
        service = TestBed.inject(PriceMatrixTransformer);
    });

    describe('getDateFormatted', () => {
        it('should zero-pad day and month when they are below 10', () => {
            expect(service.getDateFormatted(5, 3, 2023)).toBe('2023-03-05');
        });

        it('should not pad day and month when they are >= 10', () => {
            expect(service.getDateFormatted(15, 11, 2023)).toBe('2023-11-15');
        });

        it('should handle the last day of a month correctly', () => {
            expect(service.getDateFormatted(31, 12, 2023)).toBe('2023-12-31');
        });
    });

    describe('generateRequestData', () => {
        it('should call generateCalendarRequestData with constants from BookingPriceMatrixConstants', () => {
            service.generateRequestData();
            expect(fakeBookingUtilService.generateCalendarRequestData).toHaveBeenCalledWith(
                BookingPriceMatrixConstants.daysBeforeRibbon,
                BookingPriceMatrixConstants.daysAfterRibbon,
                BookingPriceMatrixConstants.daysBeforeCalendar,
                BookingPriceMatrixConstants.daysAfterCalendar
            );
        });

        it('should return the value from generateCalendarRequestData', () => {
            const result = service.generateRequestData();
            expect(result).toEqual({ slices: [], passengers: [], marketCode: '', preferredCabin: '' });
        });
    });

    describe('transformGetPriceMatrixData', () => {

        describe('ribbon mode (inbound or outbound is null)', () => {
            it('should set ribbon = true', () => {
                const data = buildRibbonData({ useInBoundRow: true });
                const result = service.transformGetPriceMatrixData(data);
                expect(result.ribbon).toBe(true);
            });

            it('should use calendarRibbon.inBoundRow as calendarGrid when inBoundRow is not null', () => {
                const data = buildRibbonData({ useInBoundRow: true });
                const result = service.transformGetPriceMatrixData(data);
                expect(result.trip).toEqual(data.data.inbound);
            });

            it('should use calendarRibbon.outBoundRow as calendarGrid when inBoundRow is null', () => {
                const data = buildRibbonData({ useInBoundRow: false });
                const result = service.transformGetPriceMatrixData(data);
                expect(result.trip).toEqual(data.data.outbound);
            });

            it('should set selectedCell = false for all cells', () => {
                const data = buildRibbonData({ useInBoundRow: true });
                const result = service.transformGetPriceMatrixData(data);
                result.calendarGrid.cells.forEach((cell) => {
                    expect(cell.selectedCell).toBe(false);
                });
            });

            it('should set transformedDate on each cell', () => {
                const data = buildRibbonData({ useInBoundRow: true });
                const result = service.transformGetPriceMatrixData(data);
                result.calendarGrid.cells.forEach((cell) => {
                    expect(cell.transformedDate).toBeDefined();
                });
            });

            it('should group cells into rows of 7', () => {
                // 2023-07-03 (Monday) + 7 cells = 1 full week, no padding needed
                const data = buildRibbonData({ useInBoundRow: true, startDate: '2023-07-03', numCells: 7 });
                const result = service.transformGetPriceMatrixData(data);
                expect(result.calendarGrid.rows.length).toBe(1);
                result.calendarGrid.rows.forEach((row) => {
                    expect(row.length).toBe(7);
                });
            });

            it('should prepend empty cells when first cell is not Monday', () => {
                // 2023-07-05 is Wednesday (getDay() = 3), so 2 empty cells should be prepended
                const data = buildRibbonData({ useInBoundRow: true, startDate: '2023-07-05', numCells: 5 });
                const result = service.transformGetPriceMatrixData(data);
                expect(result.calendarGrid.cells[0].empty).toBe(true);
                expect(result.calendarGrid.cells[1].empty).toBe(true);
                expect(result.calendarGrid.cells[2].empty).toBeUndefined();
            });

            it('should append empty cells when last cell is not Sunday', () => {
                // 2023-07-03 (Monday) + 5 cells = ends on Friday (getDay() = 5), 1 Saturday appended
                const data = buildRibbonData({ useInBoundRow: true, startDate: '2023-07-03', numCells: 5 });
                const result = service.transformGetPriceMatrixData(data);
                const lastCell = result.calendarGrid.cells[result.calendarGrid.cells.length - 1];
                expect(lastCell.empty).toBe(true);
            });

            it('should include availability in the result', () => {
                const data = buildRibbonData({ useInBoundRow: true });
                const result = service.transformGetPriceMatrixData(data);
                expect(result.availability).toEqual(data.data.availability);
            });

            it('should default flightRatio to empty string when absent', () => {
                const data = buildRibbonData({ useInBoundRow: true });
                delete (data.data as any).flightRatio;
                const result = service.transformGetPriceMatrixData(data);
                expect(result.flightRatio).toBe('');
            });

            it('should include flightRatio when present', () => {
                const data = buildRibbonData({ useInBoundRow: true });
                (data.data as any).flightRatio = '2.5';
                const result = service.transformGetPriceMatrixData(data);
                expect(result.flightRatio).toBe('2.5');
            });
        });

        describe('matrix mode (both inbound and outbound exist)', () => {
            it('should set ribbon = false', () => {
                const data = buildMatrixData();
                const result = service.transformGetPriceMatrixData(data);
                expect(result.ribbon).toBe(false);
            });

            it('should swap outbound/inbound dates between rows and columns', () => {
                const data = buildMatrixData();
                const result = service.transformGetPriceMatrixData(data);
                // Original rows[0].outboundDate was '2020-06-10' → year 2020
                // Original columns[0].inboundDate was '2023-06-15' → year 2023
                // After swap: rows[0].outboundDate should come from original column (year 2023)
                //             columns[0].inboundDate should come from original row (year 2020)
                expect((result.calendarGrid.rows[0].outboundDate as any).year).toBe(2023);
                expect((result.calendarGrid.columns[0].inboundDate as any).year).toBe(2020);
            });

            it('should swap selectedDate between rows and columns', () => {
                const data = buildMatrixData();
                // Original rows[0].selectedDate = true, columns[0].selectedDate = true
                // Original rows[1].selectedDate = false, columns[1].selectedDate = false
                const result = service.transformGetPriceMatrixData(data);
                // After swap: rows[0].selectedDate = original columns[0].selectedDate = true
                expect(result.calendarGrid.rows[0].selectedDate).toBe(true);
                // After swap: columns[0].selectedDate = original rows[0].selectedDate = true
                expect(result.calendarGrid.columns[0].selectedDate).toBe(true);
            });

            it('should set selectedCell = true when row and column are both selected', () => {
                const data = buildMatrixData();
                // rows[0].selectedDate=true, columns[0].selectedDate=true → selectedCell should be true
                const result = service.transformGetPriceMatrixData(data);
                expect(result.calendarGrid.rows[0].cells[0].selectedCell).toBe(true);
            });

            it('should set selectedCell = false when row or column is not selected', () => {
                const data = buildMatrixData();
                // rows[0].selectedDate=true, columns[1].selectedDate=false → selectedCell should be false
                const result = service.transformGetPriceMatrixData(data);
                expect(result.calendarGrid.rows[0].cells[1].selectedCell).toBe(false);
            });

            it('should transpose matrix cells (swap [i][j] with [j][i] when j > i)', () => {
                const data = buildMatrixData();
                const originalCell01 = data.data.calendarGrid.rows[0].cells[1];
                const originalCell10 = data.data.calendarGrid.rows[1].cells[0];
                const result = service.transformGetPriceMatrixData(data);
                // After transpose: rows[0].cells[1] = original rows[1].cells[0]
                expect(result.calendarGrid.rows[0].cells[1]).toBe(originalCell10);
                // After transpose: rows[1].cells[0] = original rows[0].cells[1]
                expect(result.calendarGrid.rows[1].cells[0]).toBe(originalCell01);
            });
        });

        describe('currency resolution', () => {
            it('should call getCurrencyObject when currency matches contextMetadata', () => {
                // Cell with totalPrice.currency = 'EUR' and contextMetadata has EUR
                const data = buildRibbonData({ useInBoundRow: true, withCurrency: true });
                service.transformGetPriceMatrixData(data);
                expect(fakeCurrencyService.getCurrencyObject).toHaveBeenCalled();
            });

            it('should set currency object in the result', () => {
                const data = buildRibbonData({ useInBoundRow: true, withCurrency: true });
                const result = service.transformGetPriceMatrixData(data);
                expect((result.currency as any).code).toBe('EUR');
            });

            it('should store the currency code in session storage under "moneda"', () => {
                const data = buildRibbonData({ useInBoundRow: true, withCurrency: true });
                service.transformGetPriceMatrixData(data);
                expect(sessionStorage.get<string>('moneda')).toBe('EUR');
            });

            it('should not call getCurrencyObject when there is no matching currency in contextMetadata', () => {
                const data = buildRibbonData({ useInBoundRow: true, withCurrency: false });
                service.transformGetPriceMatrixData(data);
                expect(fakeCurrencyService.getCurrencyObject).not.toHaveBeenCalled();
            });
        });
    });
});
