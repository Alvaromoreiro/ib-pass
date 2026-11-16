import { Component, Inject, Input, Output, ElementRef, ViewChild, Renderer2, AfterViewInit, OnChanges, OnDestroy, SimpleChanges, EventEmitter } from '@angular/core';
import { AutoComplete } from 'primeng/autocomplete';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { downgradeToAJSComponent, AJSRootScope, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import dayjs from 'dayjs';
import { BookingBirthDatesConstants } from '../../../../../../core/constants/ib-booking-dates-constant';
import { AJSBookingModalService, BookingModalServiceType } from '@src/app/shared/components/ib-booking-modal/services/upgraded/ib-booking-modal-service-bridge.service';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { TranslateService } from '@ngx-translate/core';
@Component({
    selector: 'ib-booking-passenger-birth-date',
    templateUrl: './ib-booking-passenger-birth-date.component.html',
    styleUrls: ['./ib-booking-passenger-birth-date.component.scss']
})

export class IbBookingPassengerBirthDateComponent implements OnChanges, AfterViewInit, OnDestroy {
    @Input() day: string;
    @Input() month: string;
    @Input() year: string;
    @Input() index: number;
    @Input() isFormSubmitted: boolean = false;
    @Input() haveBirthDate: boolean;
    @Input() yearsFrom: number;
    @Input() yearsTo: number;
    @Input() type: string;
    @Input() identifier: string;
    @Input() formatDate: string[];
    @Output() dayChange = new EventEmitter<string>();
    @Output() monthChange = new EventEmitter<string>();
    @Output() yearChange = new EventEmitter<string>();
    @Output() birthDateDataChange = new EventEmitter<{ day: string; month: string; year: string }>();
    @Output() formValidity = new EventEmitter<boolean>();
    
    @ViewChild('dayAutoComplete') dayAutoComplete!: AutoComplete;
    @ViewChild('monthAutoComplete') monthAutoComplete!: AutoComplete;
    @ViewChild('yearAutoComplete') yearAutoComplete!: AutoComplete;
    @ViewChild('autoComplete') autoComplete!: AutoComplete;

    previousDay: string = '';
    previousMonth: string = '';
    previousYear: string = '';

    filteredDays: string[] = [];
    filteredMonths: string[] = [];
    filteredYears: string[] = [];
    
    availableDays: string[] = [];
    availableMonths: string[] = [];
    availableMonthsIndex: number[] = [];
    availableYears: string[] = [];
    availableYearsOnInit: string[] = [];
    monthTranslate: { index: number; name: string }[] = [];
    
    dayChanged: boolean = false;
    dateChange:boolean = false;
    flightDate: string;

    birthDateForm: FormGroup;
    dayControl: FormControl;
    monthControl: FormControl;
    yearControl: FormControl;

    dayDropdownIcon: HTMLElement;
    monthDropdownIcon: HTMLElement;
    yearDropdownIcon: HTMLElement;

    private destroy$ = new Subject<void>();

    constructor (
        @Inject(AJSRootScope) private $rootScope: CommonsRootScope,
        @Inject(AJSBookingModalService) private BookingModalService: BookingModalServiceType,
        private renderer: Renderer2,
        private CommonSessionStorageService: CommonsSessionStorageService,
        private TranslateService: TranslateService,
        private fb: FormBuilder,
        private el: ElementRef
    ) {}

    private alreadyInitialized = false;
    private activate = (): void => {
        if (this.alreadyInitialized) return;
        this.alreadyInitialized = true;

        this.createForm();
        this.monthTranslate = this.getTranslatedMonths();
        this.availableMonths = BookingBirthDatesConstants.MONTH_NAMES_ARRAY;

        this.month && this.convertMonthNumberToName();

        this.$rootScope.$on('passengerWarning', this.enablePassengerWarning);
        this.availableYears = this.initializeYears(this.yearsFrom, this.yearsTo);
        this.availableYearsOnInit = this.availableYears;
        this.availableDays = BookingBirthDatesConstants.DAYS_ARRAY;
        this.availableMonths = this.monthTranslate.map(month => month.name);
        
        this.filteredDays = [...this.availableDays];
        this.filteredMonths = [...this.availableMonths];
        this.filteredYears = [...this.availableYears];
        
        this.flightDate = this.type !== 'ADULT' && this.CommonSessionStorageService.get<AvailabilityTransformerModel.AvailabilityRequestData>('availabilityRequestData').slices[1] ? this.CommonSessionStorageService.get<AvailabilityTransformerModel.AvailabilityRequestData>('availabilityRequestData').slices[1].date : this.CommonSessionStorageService.get<AvailabilityTransformerModel.AvailabilityRequestData>('availabilityRequestData').slices[0].date;
        
        this.hasBirthDateData() && this.yearsSelected();
        
        this.createInputsObs();
        this.setUpFormValueChanges();
        this.formatDate = this.getFormatDate();
    };

    ngOnChanges (changes: SimpleChanges): void {
        this.activate();
        if (this.shouldPatchBirthDateForm(changes)) {
            this.birthDateForm.patchValue({
                day: changes['day']?.currentValue ?? this.day ?? '',
                month: this.getMonthNameFromNumber(changes['month']?.currentValue ?? this.month ?? ''),
                year: changes['year']?.currentValue ?? this.year ?? ''
            }, { emitEvent: true });
        }
        if (changes['haveBirthDate']) {
            this.toggleBirthDateFields(this.haveBirthDate);
        }
        if ( changes['isFormSubmitted']?.currentValue) {
            this.birthDateForm.markAllAsTouched();
           
        }
        this.birthDateForm.updateValueAndValidity();

    }

    private shouldPatchBirthDateForm (changes: SimpleChanges): boolean {
        return  !!this.birthDateForm && (!!changes['day'] || !!changes['month'] || !!changes['year']);
    }

    private toggleBirthDateFields (disabled: boolean): void {
        if (!this.birthDateForm) return;
        const action = disabled ? 'disable' : 'enable';
        this.birthDateForm.get('day')?.[action]({ emitEvent: false });
        this.birthDateForm.get('month')?.[action]({ emitEvent: false });
        this.birthDateForm.get('year')?.[action]({ emitEvent: false });
    }

    hasBirthDateData (): boolean {
        return !!this.month || !!this.year || !!this.day;
    }
 
    initializeYears (numberYearsFrom: number, numberYearsTo: number): string[] {
        let index: number, 
            currentYear: number, 
            yearsArray: string[] = [], 
            maxYears: number, 
            slice, 
            returnDate;

        slice = this.CommonSessionStorageService.get<AvailabilityTransformerModel.AvailabilityRequestData>('availabilityRequestData').slices;
        returnDate = this.type === 'INFANT' ? dayjs() : dayjs(slice[slice.length - 1].date, 'YYYY-MM-DD');
        this.dayChanged = false;
        numberYearsFrom = numberYearsFrom || BookingBirthDatesConstants.DEFAULT_FROM_YEARS;
        numberYearsTo = numberYearsTo || BookingBirthDatesConstants.DEFAULT_TO_YEARS;
        maxYears = this.calculateMaxYears(numberYearsFrom, numberYearsTo, dayjs().year(), dayjs(slice[slice.length - 1].date, 'YYYY-MM-DD').year());
        currentYear = returnDate.year() - numberYearsFrom;
        for (index = 0; index <= maxYears; ++index) {
            yearsArray.push(currentYear.toString());
            currentYear--;
        }
    
        this.availableYearsOnInit = [...yearsArray];
    
        return yearsArray;
    }

    calculateMaxYears (numberYearsFrom: number, numberYearsTo: number, currentYear: number, returnYear: number): number {
        if (this.type === 'INFANT' && currentYear !== returnYear) {
            return numberYearsTo - 1;
        } else {
            return numberYearsTo - numberYearsFrom;
        }
    }
    
    getDaysOfMonth (month: number, year: number): string[] {
        const date = new Date();
        date.setFullYear(year, month, 0);
        const daysForCurrentMonth = BookingBirthDatesConstants.DAYS_ARRAY.slice(); 
        return daysForCurrentMonth.splice(0, date.getDate());
    }

    daysSelected (): void {
        if (this.day) {
            this.dayChanged = false;
        }
        if (this.type === 'INFANT') {
            this.validInfantDate(this.dayChanged);
        } else if ( this.type === 'CHILD' ) {
            this.validChildDate(this.dayChanged);
        }
    }

    validChildDate (monthChanges: boolean): void {
        const returnDate = dayjs(this.flightDate, 'YYYY-MM-DD');
        const returnDay = returnDate.date();
        const monthDays: string[] = this.getMonthDaysForChild();
        this.dayChanged = !!monthChanges;
        const lastAvailableMonthIndex = this.lastAvailableMonthIndex();

        if (this.isLastAvailableMonthForChild(lastAvailableMonthIndex)) {
            this.setAvailableDaysForChild(monthDays, returnDay);
        }

        this.handleDayChanged();
    }

    private getMonthDaysForChild (): string[] {
        if (this.month) {
            const year = this.year ? this.year : this.availableYears[0].toString();
            return this.getDaysOfMonth(parseInt(this.month), parseInt(year));
        }
        return BookingBirthDatesConstants.DAYS_ARRAY.slice();
    }

    private isLastAvailableMonthForChild (lastAvailableMonthIndex: number): boolean {
        return parseInt(this.month) === lastAvailableMonthIndex && this.year === this.availableYears[0];
    }

    private setAvailableDaysForChild (monthDays: string[], returnDay: number): void {
        if (this.type === 'CHILD') {
            this.availableDays = monthDays.splice(0, dayjs(this.flightDate, 'YYYY-MM-DD').date(), monthDays.length.toString());
        } else {
            this.availableDays = monthDays.splice(0, returnDay);
        }
        if (parseInt(this.day) > returnDay && this.type !== 'INFANT') {
            this.dayChanged = true;
        }
    }

    private handleDayChanged (): void {
        if (this.dayChanged === true) {
            this.showDateOfBirthError();
        } else {
            this.dateChange = false;
        }
    }
    
    validInfantDate (monthChanges: boolean): void {
        const returnDate = dayjs(this.flightDate, 'YYYY-MM-DD');
        const currentDay = dayjs().date();
        const returnDay = returnDate.date();
        const monthDays = this.month
            ? this.getDaysOfMonth(
                parseInt(this.month),
                parseInt(this.year ? this.year : this.availableYears[0].toString())
            )
            : [...BookingBirthDatesConstants.DAYS_ARRAY];
        const firstAvailableMonthIndex = this.firstAvailableMonthIndex();
        const lastAvailableMonthIndex = this.lastAvailableMonthIndex();

        this.dayChanged = !!monthChanges;

        if (this.isLastAvailableMonthForInfant(lastAvailableMonthIndex)) {
            this.handleLastAvailableMonthForInfant(monthDays, currentDay, returnDay);
        } else if (this.isFirstAvailableMonth(firstAvailableMonthIndex)) {
            this.dayChanged = true;
        } else if (this.isAfterLastAvailableMonth(lastAvailableMonthIndex)) {
            this.dayChanged = true;
        }

        this.handleDayChanged();
    }

    private isLastAvailableMonthForInfant (lastAvailableMonthIndex: number): boolean {
        return parseInt(this.month) === lastAvailableMonthIndex && this.year === this.availableYears[0];
    }

    private handleLastAvailableMonthForInfant (monthDays: string[], currentDay: number, returnDay: number): void {
        this.availableDays = this.type === 'INFANT'
            ? monthDays.slice(0, currentDay - 1)
            : monthDays.slice(0, returnDay);

        if (
            parseInt(this.day) > parseInt(this.availableDays[this.availableDays.length - 1]) &&
            this.type === 'INFANT'
        ) {
            this.dayChanged = true;
        }
    }

    private isFirstAvailableMonth (firstAvailableMonthIndex: number | undefined): boolean {
        return parseInt(this.month) < firstAvailableMonthIndex && 
           this.year === this.availableYears[this.availableYears.length - 1];
    }

    private isAfterLastAvailableMonth (lastAvailableMonthIndex: number): boolean {
        return (
            parseInt(this.month) > lastAvailableMonthIndex &&
            this.year === this.availableYears[0]
        );
    }

    monthsSelected =(monthChanges?) =>{
        const actualDay = this.day;
        const returnDate = dayjs(this.flightDate, 'YYYY-MM-DD');
        const currentDay = dayjs().date();
        const returnMonth = returnDate.month() + 1,
            returnDay = returnDate.date(),
            monthDays = this.month ? this.getDaysOfMonth(parseInt(this.month), parseInt(this.year ? this.year : this.availableYears[0].toString())) : BookingBirthDatesConstants.DAYS_ARRAY.slice();
        const firstAvailableMonthIndex = this.firstAvailableMonthIndex();
        const lastAvailableMonthIndex = this.lastAvailableMonthIndex();
        this.dayChanged = !!monthChanges;
        if (parseInt(this.month) === lastAvailableMonthIndex && this.year === this.availableYears[0]) {
            this.availableDays = this.type === 'CHILD' ? monthDays.splice(0, dayjs(this.flightDate, 'YYYY-MM-DD').date(), monthDays.length.toString()) : this.type === 'INFANT' ? monthDays.splice(0, currentDay - 1) : monthDays.splice(0, returnDay);
            if (parseInt(this.day) > returnDay && this.type !== 'INFANT') {
                this.dayChanged = true;
            } else if (parseInt(this.day) > parseInt(this.availableDays[this.availableDays.length - 1]) && this.type === 'INFANT') {
                this.dayChanged = true;
            }
        } else if (parseInt(this.month) <= firstAvailableMonthIndex && this.year === this.availableYears[this.availableYears.length - 1]) {
            this.availableDays = parseInt(this.month) === returnMonth ? monthDays.splice(returnDay, monthDays.length) : monthDays.splice(0, monthDays.length);
            if ((this.type === 'CHILD' || this.type === 'INFANT') && returnDay >= parseInt(this.day)) {
                this.dayChanged = true;
            } else if ( this.type === 'INFANT' && parseInt(this.day) > returnDay ) {
                this.day = actualDay;
            }
            if (actualDay !== this.day) {
                this.dayChanged = true;
                this.day = actualDay;
            }
        } else {
            this.availableDays = monthDays;
            if (parseInt(this.day) >= parseInt(this.availableDays[this.availableDays.length - 1])) {
                this.day = this.availableDays[this.availableDays.length - 1];
            }
        }
        this.handleDayChanged();
    };

    yearsSelected (): void {
        const currentMonth = dayjs().month() + 1;
        const returnDate = dayjs(this.flightDate, 'YYYY-MM-DD');
        const returnMonth = returnDate.month() + 1;
        const returnDay = returnDate.date();
        const currentMonthDays = this.getDaysOfMonth(returnMonth, parseInt(this.year));
        const isLastDay = parseInt(currentMonthDays[currentMonthDays.length - 1]) === returnDay;
        this.dayChanged = false;

        if (this.year === this.availableYears[0]) {
            this.handleFirstAvailableYear(currentMonth, returnMonth);
        } else if (this.year === this.availableYears[this.availableYears.length - 1]) {
            this.handleLastAvailableYear(isLastDay, returnMonth);
        } else {
            this.availableMonths = this.monthTranslate.map(month => month.name);
        }
        this.monthsSelected(this.dayChanged);
    }

    private handleFirstAvailableYear (currentMonth: number, returnMonth: number): void {
        this.availableMonths = this.getAvailableMonthsByType(currentMonth, returnMonth);
        let maxMonth = this.type === 'INFANT' ? currentMonth : returnMonth;
        const lastAvailableMonthIndex = this.lastAvailableMonthIndex();

        if (parseInt(this.month) > maxMonth) {
            this.dayChanged = true;
        } else if (lastAvailableMonthIndex && parseInt(this.month, 10) > lastAvailableMonthIndex) {
            this.dayChanged = true;
        }
    }

    private handleLastAvailableYear (isLastDay: boolean, returnMonth: number): void {
        if (isLastDay) {
            this.availableMonths = this.monthTranslate.map(month => month.name).slice(returnMonth, this.monthTranslate.length);
            const firstAvailableMonthIndex = this.firstAvailableMonthIndex();

            if (parseInt(this.month) < firstAvailableMonthIndex) {
                this.dayChanged = true;
            }
        } else {
            const startIndex = returnMonth - 1;
            const endIndex = this.monthTranslate.length;

            this.availableMonths = this.monthTranslate
                .map(month => month.name)
                .slice(startIndex, endIndex);
        }
        if (parseInt(this.month) < returnMonth) {
            this.dayChanged = true;
        }
    }

    showDateOfBirthError = () =>{
        this.BookingModalService.showBKIGenericModal(true, 'passenger-date-of-birth-error.html', { idModal: 'ib-modal-not-allowed-flow', title: 'GENERAL_ADVICE_TITLE', body: 'BIRTH_DATE_WARNING_CHANGE_MESSAGE', accept: 'VALID_BIRTH_DATE', cancel: 'GO_TO_HOME' }, '').result.then(() => {
            this.dateChange = true;
        }, () => {
        });
    };
    
    enablePassengerWarning (): void {
        this.dateChange = true;
    }
    
    public getFormatDate = (): string[] =>{
        const commercialData = this.CommonSessionStorageService.get<AvailabilityTransformerModel.AvailabilityCommercialData>('commercialData');
        const languageSelected = this.$rootScope.appLang;
        const formatString = commercialData?.languages?.find(language => language.code === languageSelected)?.dateFormat?.short?.toLowerCase() ?? 'dd/mm/yyyy';
        if (formatString.startsWith('y')) {
            return BookingAppConstants.DATE_FORMAT.YEARS_FIRST;
        }
        if (formatString.startsWith('m')) {
            return BookingAppConstants.DATE_FORMAT.MONTH_FIRST;
        }
        return BookingAppConstants.DATE_FORMAT.DEFAULT;
    };



    ngAfterViewInit (): void {
        const dayContainer = this.el.nativeElement.querySelector('#birth_date_day')?.parentNode;
        const monthContainer = this.el.nativeElement.querySelector('#birth_date_month')?.parentNode;
        const yearContainer = this.el.nativeElement.querySelector('#birth_date_year')?.parentNode;
    
        this.dayDropdownIcon = dayContainer?.querySelector('svg');
        this.monthDropdownIcon = monthContainer?.querySelector('svg');
        this.yearDropdownIcon = yearContainer?.querySelector('svg');
    }

    createForm (): void {
        this.birthDateForm = this.fb.group({
            day: [{ value: this.day || '', disabled: this.haveBirthDate }, Validators.required],
            month: [{ value: this.month || '', disabled: this.haveBirthDate }, Validators.required],
            year: [{ value: this.year || '', disabled: this.haveBirthDate }, Validators.required]
        });
        this.dayControl = this.birthDateForm.get('day') as FormControl;
        this.monthControl = this.birthDateForm.get('month') as FormControl;
        this.yearControl = this.birthDateForm.get('year') as FormControl;
    }

    private setUpFormValueChanges (): void {
        this.birthDateForm.statusChanges
            .pipe(
                takeUntil(this.destroy$),
                debounceTime(100)
            )
            .subscribe(() => {
                this.formValidity.emit(this.getValidity());
            });
    }

    private getValidity = (): boolean => {
        if (this.birthDateForm.disabled) {
            return this.birthDateForm.value.day !== '' || this.birthDateForm.value.month !== '' || this.birthDateForm.value.year !== ''; 
        }
        return this.birthDateForm.valid;
    };

    private createInputsObs (): void {
        this.birthDateForm.valueChanges.pipe(
            takeUntil(this.destroy$),
            debounceTime(100)
        ).subscribe(values => {

            if (values.day && values.day.trim() !== '') {
                this.previousDay = values.day;
            }
            if (values.month && values.month.trim() !== '') {
                this.previousMonth = values.month;
            }
            if (values.year && values.year.trim() !== '') {
                this.previousYear = values.year;
            }
            if (this.birthDateForm.valid) {
                const birthDateData = {
                    day: values.day,
                    month: values.month,
                    year: values.year
                };
                this.birthDateDataChange.emit(birthDateData);
            }
        });
    }

    getAvailableMonthsByType (currentMonth: number, returnMonth: number): string[] {
        const limitMonth = this.type === 'INFANT' ? currentMonth : returnMonth;
        return this.monthTranslate.slice(0, limitMonth).map(month => month.name);
    }

    firstAvailableMonthIndex (): number | undefined {
        return this.monthTranslate.find(month => month.name === this.availableMonths[0])?.index; 
    }

    lastAvailableMonthIndex (): number {
        return this.monthTranslate.find(month => month.name === this.availableMonths[this.availableMonths.length - 1])?.index;
        
    }

    getTranslatedMonths (): { index: number; name: string }[] {
        return BookingBirthDatesConstants.MONTH_NAMES_ARRAY.map((item, index) => {
            const translatedMonth = this.TranslateService.instant(item);
            const abbreviatedMonth = translatedMonth.slice(0, 3); 
            return { 
                index: index + 1, 
                name: abbreviatedMonth.charAt(0) + abbreviatedMonth.slice(1).toLowerCase() 
            };
        });
    }
    
    filterDays (event: any): void {
        const query = event.query.toLowerCase();
        this.filteredDays = this.availableDays.filter(day => 
            day.toLowerCase().includes(query)
        );
    }
    
    filterMonths (event: any): void {
        const query = event.query.toLowerCase();
        this.filteredMonths = this.availableMonths.filter(month => 
            month.toLowerCase().includes(query)
        );
    }
    
    filterYears (event: any): void {
        const query = event.query.toLowerCase();
        this.filteredYears = this.availableYears.filter(year => 
            year.toLowerCase().includes(query)
        );
    }
 
    onFocus = (selector?: string): void => {
        if (selector === 'day') this.dayAutoComplete?.show();
        else if (selector === 'month') this.monthAutoComplete?.show();
        else if (selector === 'year') this.yearAutoComplete?.show();
    };
    
    onShow = (selector: string): void => {
        if (selector === 'day' && this.dayDropdownIcon) {
            this.renderer.addClass(this.dayDropdownIcon, 'rotate');
        } else if (selector === 'month' && this.monthDropdownIcon) {
            this.renderer.addClass(this.monthDropdownIcon, 'rotate');
        } else if (selector === 'year' && this.yearDropdownIcon) {
            this.renderer.addClass(this.yearDropdownIcon, 'rotate');
        }
    };

    onHide = (selector: string): void => {
        if (selector === 'day' && this.dayDropdownIcon) {
            this.renderer.removeClass(this.dayDropdownIcon, 'rotate');
        } else if (selector === 'month' && this.monthDropdownIcon) {
            this.renderer.removeClass(this.monthDropdownIcon, 'rotate');
        } else if (selector === 'year' && this.yearDropdownIcon) {
            this.renderer.removeClass(this.yearDropdownIcon, 'rotate');
        }
    };
    
    
    onDaySelected (event: any): void {
        this.day = event;
        this.dayChange.emit(event);
        this.daysSelected();
    }
    
    onMonthSelected (event: any): void {
        const selectedMonth = this.monthTranslate.find(month => month.name === event);
        
        if (selectedMonth) {
            this.month = selectedMonth.index.toString();
            this.monthChange.emit(this.month); 
            this.monthsSelected(); 
        }
    }
    
    onYearSelected (event: string): void {
        this.year = event;
        this.yearChange.emit(event);
        this.yearsSelected();
    }

    onBlur (field: 'day' | 'month' | 'year'): void {
        let controlName = '';
        let previousValue = '';

        if (field === 'day') {
            controlName = 'day';
            previousValue = this.previousDay;
        } else if (field === 'month') {
            controlName = 'month';
            previousValue = this.previousMonth;
        } else if (field === 'year') {
            controlName = 'year';
            previousValue = this.previousYear;
        }

        const currentValue = this.birthDateForm.get(controlName)?.value;
        if (!currentValue || currentValue.trim() === '') {
            this.birthDateForm.get(controlName)?.setValue(previousValue || '');
        } else {
       
            if (field === 'day') this.previousDay = currentValue;
            if (field === 'month') this.previousMonth = currentValue;
            if (field === 'year') this.previousYear = currentValue;
        }
    }

    ngOnDestroy (): void {
        this.destroy$.next();
        this.destroy$.complete();
        this.formValidity.emit(true);
    }
    
    convertMonthNumberToName (): void {
        const monthNumber = parseInt(this.month);
        const monthTranslated = this.monthTranslate.find(month => month.index === monthNumber);
        
        if (monthTranslated) {
            this.birthDateForm.patchValue({
                month: monthTranslated.name
            }, { emitEvent: false });
            
            this.monthChange.emit(this.month);
        }
    }
    
    getMonthNameFromNumber (month: string | number): string {
        const monthNumber = typeof month === 'string' ? parseInt(month, 10) : month;
        const monthObj = this.monthTranslate.find(m => m.index === monthNumber);
        return monthObj ? monthObj.name : '';
    }
}

downgradeToAJSComponent('ibBookingPassengerBirthDateLegacy', {
    component: IbBookingPassengerBirthDateComponent,
    inputs: ['day', 'month', 'year', 'index', 'haveBirthDate', 'yearsFrom', 'yearsTo', 'type', 'identifier', 'formatDate'],
    outputs: ['dayChange', 'monthChange', 'yearChange', 'birthDateDataChange', 'formValidity']
}, 'ib-booking-passenger-info-module');
