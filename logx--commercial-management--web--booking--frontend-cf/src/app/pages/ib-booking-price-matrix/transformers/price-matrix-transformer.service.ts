import { Inject, Injectable } from '@angular/core';
import { RibbonRequest } from '@src/app/core/models/ib-booking-availability/ribbon-models';
import { AJSBookingUtilsService } from '@src/app/shared/services/ib-utils/ib-booking-utils-service-bridge.service';
import { BookingPriceMatrixConstants } from '../ib-booking-price-matrix-constants';
import { AJSCurrencyService, CommonsSessionStorageService, downgradeToAJSService } from 'ib-web-commons/utils';
import { DateFormatPipe } from '@src/app/shared/pipes/date-format.pipe';

export interface TotalPrice {
    currency: string;
}

export interface TransformedPriceMatrixData {
    availability: any;
    inbound?: any;
    outbound?: any;
    ribbon: boolean;
    trip: any;
    currency: any;
    calendarGrid: {
        cells: Cell[];
        columns: MatrixColumn[];
        rows: any[];
    };
    flightRatio: string;
}

export interface Cell {
    available: boolean;
    empty: boolean;
    selectedCell: boolean;
    boundDate: string;
    transformedDate: any;
    totalPrice?: TotalPrice;
}

export interface MatrixCell {
    totalPrice?: TotalPrice;
    selectedCell: boolean;
}

export interface MatrixRow {
    outboundDate: string;
    selectedDate: boolean;
    cells: MatrixCell[];
}

export interface MatrixColumn {
    inboundDate: string;
    selectedDate: boolean;
}




@Injectable( {
    providedIn: 'root'
})
export class PriceMatrixTransformer {
    private DateFormatPipe: DateFormatPipe;
    constructor (
        @Inject( AJSBookingUtilsService ) private BookingUtilService,
        @Inject( AJSCurrencyService ) private CurrencyService,
        private CommonsSessionStorageService: CommonsSessionStorageService
    ) { 
        this.DateFormatPipe = new DateFormatPipe(this.BookingUtilService);
    }
    
    
    /**
     * Transforms the price matrix data received from the rest service in a model object to use in the view.
     * @param {Object} getPriceMatrixData - The price matrix data received from the rest service
     * @returns {TransformedPriceMatrixData} - returns the input price matrix data into a well-structured object for the view
     */
    public transformGetPriceMatrixData (getPriceMatrixData): TransformedPriceMatrixData {
        const transformedData = this.initializeTransformedData(getPriceMatrixData);
        const isRibbonMode = getPriceMatrixData.data.inbound === null || getPriceMatrixData.data.outbound === null;

        const currency = isRibbonMode
            ? this.processRibbonData(transformedData, getPriceMatrixData)
            : this.processMatrixData(transformedData, getPriceMatrixData);

        this.applyCurrencyMetadata(transformedData, getPriceMatrixData, currency);

        return transformedData;
    }

    /**
     * Creates the initial structure for transformed price matrix data.
     * @param getPriceMatrixData - Raw data from the REST service
     * @returns Initial TransformedPriceMatrixData with default values
     */
    private initializeTransformedData (getPriceMatrixData): TransformedPriceMatrixData {
        return {
            availability: getPriceMatrixData.data.availability,
            currency: {},
            calendarGrid: { cells: [], columns: [], rows: [] },
            flightRatio: getPriceMatrixData?.data?.flightRatio ?? '',
            ribbon: false,
            trip: {}
        };
    }

    /**
     * Processes price matrix data in ribbon mode (one-way flights).
     * Handles calendar grid assignment, cell transformation, and week padding.
     * @param transformedData - The data structure being populated
     * @param getPriceMatrixData - Raw data from the REST service
     * @returns The currency code extracted from the cells
     */
    private processRibbonData (transformedData: TransformedPriceMatrixData, getPriceMatrixData): string {
        transformedData.ribbon = true;
        this.assignRibbonCalendarGrid(transformedData, getPriceMatrixData);

        const currency = this.transformRibbonCells(transformedData.calendarGrid.cells);
        this.padWeekStart(transformedData.calendarGrid.cells);
        this.removeLeadingSunday(transformedData.calendarGrid.cells);
        this.padWeekEnd(transformedData.calendarGrid.cells);
        this.groupCellsIntoRows(transformedData);

        return currency;
    }

    /**
     * Assigns the appropriate calendar ribbon data based on flight direction.
     * Prioritizes inbound row if available, otherwise uses outbound row.
     * @param transformedData - The data structure being populated
     * @param getPriceMatrixData - Raw data from the REST service
     */
    private assignRibbonCalendarGrid (transformedData: TransformedPriceMatrixData, getPriceMatrixData): void {
        const { calendarRibbon, inbound, outbound } = getPriceMatrixData.data;

        if (calendarRibbon.inBoundRow !== null) {
            transformedData.calendarGrid = calendarRibbon.inBoundRow;
            transformedData.trip = inbound;
        } else if (calendarRibbon.outBoundRow !== null) {
            transformedData.calendarGrid = calendarRibbon.outBoundRow;
            transformedData.trip = outbound;
        }
    }

    /**
     * Transforms ribbon cells by setting selection state and formatting dates.
     * Also extracts the currency from the first cell that has price information.
     * @param cells - Array of calendar cells to transform
     * @returns The currency code found in cells, or empty string if none
     */
    private transformRibbonCells (cells: Cell[]): string {
        let currency = '';

        for (const cell of cells) {
            if (currency === '' && cell.totalPrice?.currency) {
                currency = cell.totalPrice.currency;
            }
            cell.selectedCell = false;
            cell.transformedDate = this.DateFormatPipe.transform(cell.boundDate, '');
        }

        return currency;
    }

    /**
     * Pads the beginning of the cells array to start on Monday.
     * Adds empty cells before the first date if it doesn't start on Monday.
     * @param cells - Array of calendar cells to pad (modified in place)
     */
    private padWeekStart (cells: Cell[]): void {
        const firstDay = new Date(cells[0].boundDate).getDay();
        if (firstDay === 1 || firstDay === 0) {
            return;
        }

        let currentDate = new Date(cells[0].boundDate);
        for (let k = 1; k < firstDay; k++) {
            currentDate = new Date(currentDate.getTime() - 86400000);
            cells.unshift(this.createEmptyCell(currentDate));
        }
    }

    /**
     * Removes a leading Sunday from the cells array.
     * Ensures the week starts on Monday by removing any Sunday at position 0.
     * @param cells - Array of calendar cells (modified in place)
     */
    private removeLeadingSunday (cells: Cell[]): void {
        if (new Date(cells[0].boundDate).getDay() === 0) {
            cells.shift();
        }
    }

    /**
     * Pads the end of the cells array to complete the week through Sunday.
     * Adds empty cells after the last date if it doesn't end on Sunday.
     * @param cells - Array of calendar cells to pad (modified in place)
     */
    private padWeekEnd (cells: Cell[]): void {
        const lastDay = new Date(cells[cells.length - 1].boundDate).getDay();
        if (lastDay === 0) {
            return;
        }

        let currentDate = new Date(cells[cells.length - 1].boundDate);
        for (let k = lastDay; k <= 6; k++) {
            currentDate = new Date(currentDate);
            currentDate.setDate(currentDate.getDate() + 1);
            cells.push(this.createEmptyCell(currentDate));
        }
    }

    /**
     * Creates an empty calendar cell for padding purposes.
     * @param date - The date for the empty cell
     * @returns A Cell object marked as empty and unavailable
     */
    private createEmptyCell (date: Date): Cell {
        const boundDate = this.formatDateToString(date);
        return {
            available: false,
            empty: true,
            selectedCell: false,
            boundDate,
            transformedDate: this.DateFormatPipe.transform(boundDate, '')
        };
    }

    /**
     * Formats a Date object to ISO date string (YYYY-MM-DD).
     * @param date - The date to format
     * @returns Formatted date string in YYYY-MM-DD format
     */
    private formatDateToString (date: Date): string {
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    }

    /**
     * Groups calendar cells into rows of 7 days (one week per row).
     * @param transformedData - The data structure containing cells to group
     */
    private groupCellsIntoRows (transformedData: TransformedPriceMatrixData): void {
        transformedData.calendarGrid.rows = [];
        const cells = transformedData.calendarGrid.cells;

        for (let i = 0; i < cells.length; i += 7) {
            transformedData.calendarGrid.rows.push(cells.slice(i, i + 7));
        }
    }

    /**
     * Processes price matrix data in matrix mode (round-trip flights).
     * Sets up the calendar grid with columns and rows for inbound/outbound dates.
     * @param transformedData - The data structure being populated
     * @param getPriceMatrixData - Raw data from the REST service
     * @returns The currency code extracted from the matrix cells
     */
    private processMatrixData (transformedData: TransformedPriceMatrixData, getPriceMatrixData): string {
        transformedData.ribbon = false;
        transformedData.inbound = getPriceMatrixData.data.inbound;
        transformedData.outbound = getPriceMatrixData.data.outbound;
        transformedData.calendarGrid = {
            columns: getPriceMatrixData.data.calendarGrid.columns,
            rows: getPriceMatrixData.data.calendarGrid.rows,
            cells: []
        };

        return this.transposeAndTransformMatrix(transformedData, getPriceMatrixData);
    }

    /**
     * Transposes the price matrix and transforms cell data.
     * Swaps row/column dates and cell positions to display correctly in the view.
     * @param transformedData - The data structure being populated
     * @param getPriceMatrixData - Raw data from the REST service
     * @returns The currency code extracted from the matrix cells
     */
    private transposeAndTransformMatrix (transformedData: TransformedPriceMatrixData, getPriceMatrixData): string {
        const { rows, columns } = transformedData.calendarGrid;
        let currency = '';

        if (rows.length !== columns.length) {
            return currency;
        }

        for (let i = 0; i < rows.length; i++) {
            this.swapRowAndColumnDates(rows[i], columns[i]);

            for (let j = 0; j < rows[i].cells.length; j++) {
                this.swapMatrixCells(rows, i, j);
                currency = this.extractCurrencyFromCell(rows[i].cells[j], getPriceMatrixData.data.calendarGrid.rows[i]?.cells[j], currency);
                rows[i].cells[j].selectedCell = rows[i].selectedDate && columns[j].selectedDate;
            }
        }

        return currency;
    }

    /**
     * Swaps date and selection state between a row and column.
     * Part of the matrix transposition process.
     * @param row - The matrix row to swap
     * @param column - The matrix column to swap with
     */
    private swapRowAndColumnDates (row: MatrixRow, column: MatrixColumn): void {
        const auxDate = this.DateFormatPipe.transform(row.outboundDate, '');
        const auxSelectedDate = row.selectedDate;

        row.outboundDate = this.DateFormatPipe.transform(column.inboundDate, '');
        row.selectedDate = column.selectedDate;
        column.inboundDate = auxDate;
        column.selectedDate = auxSelectedDate;
    }

    /**
     * Swaps matrix cells across the diagonal for transposition.
     * Only swaps when j > i to avoid double-swapping.
     * @param rows - The matrix rows array
     * @param i - Current row index
     * @param j - Current column index
     */
    private swapMatrixCells (rows: MatrixRow[], i: number, j: number): void {
        if (j > i) {
            const auxCell = rows[j].cells[i];
            rows[j].cells[i] = rows[i].cells[j];
            rows[i].cells[j] = auxCell;
        }
    }

    /**
     * Extracts currency code from a matrix cell if not already found.
     * Returns the existing currency if already set.
     * @param cell - The transformed matrix cell
     * @param originalCell - The original cell from raw data
     * @param currentCurrency - The currency found so far (empty string if none)
     * @returns The currency code or empty string
     */
    private extractCurrencyFromCell (cell: MatrixCell, originalCell, currentCurrency: string): string {
        if (currentCurrency !== '') {
            return currentCurrency;
        }

        if (cell?.totalPrice && originalCell?.totalPrice?.currency) {
            return cell.totalPrice.currency;
        }

        return currentCurrency;
    }

    /**
     * Applies currency metadata to the transformed data.
     * Finds the matching currency object and stores it in session storage.
     * @param transformedData - The data structure being populated
     * @param getPriceMatrixData - Raw data containing currency metadata
     * @param currency - The currency code to look up
     */
    private applyCurrencyMetadata (transformedData: TransformedPriceMatrixData, getPriceMatrixData, currency: string): void {
        const currencies = getPriceMatrixData.data.contextMetadata?.currencies;
        if (!currencies) {
            return;
        }

        const matchingCurrency = currencies.find(c => c.code === currency);
        if (matchingCurrency) {
            transformedData.currency = this.CurrencyService.getCurrencyObject(matchingCurrency);
            this.CommonsSessionStorageService.set('moneda', currency);
        }
    }
    
    
    
    public generateRequestData = (): RibbonRequest => {
        return this.BookingUtilService.generateCalendarRequestData(BookingPriceMatrixConstants.daysBeforeRibbon, BookingPriceMatrixConstants.daysAfterRibbon, BookingPriceMatrixConstants.daysBeforeCalendar, BookingPriceMatrixConstants.daysAfterCalendar);
    }; 
    
    
    public getDateFormatted (day: number, month: number, year: number): string {
        const parsedDay = day < 10 ? '0' + day : day;
        const parsedMonth = month < 10 ? '0' + month : month;
        return year + '-' + parsedMonth + '-' + parsedDay;
    }
}
downgradeToAJSService( 'BookingPriceMatrixTransformer', PriceMatrixTransformer, 'ib-booking-price-matrix-module' );
