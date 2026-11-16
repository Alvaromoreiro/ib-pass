import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import { AutoComplete } from 'primeng/autocomplete';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookingAppConstants } from '@core/constants/ib-booking-constants';
import { PrefixData } from '@core/models/ib-booking-passenger-info/components/ib-booking-contact-form-model';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { IbBookingContactFormDataService } from '../../services/ib-booking-contact-form-data.service';

@Component({
    selector: 'ib-booking-phone-number',
    templateUrl: './ib-booking-phone-number.component.html',
    styleUrls: ['./ib-booking-phone-number.component.scss']
})
export class IbBookingPhoneNumberComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

    @Input() submitState: boolean = false;
    @Input() prefixList: PrefixData[];
    @Input() selectedPrefix; 
    @Input() fallbackDisabled: boolean = false;
    @Output() phoneFormValidity = new EventEmitter<boolean>();
    @ViewChild('autoComplete') autoComplete!: AutoComplete;

    private destroy$ = new Subject<void>();
    phoneForm: FormGroup;
    PHONE_CLEANER = BookingAppConstants.bookingPatterns.PHONE_CLEANER;
    filteredPrefix: PrefixData[] = [];
    dropdownIcon: HTMLElement;
    previousPrefix:string;
    constructor (
        private renderer: Renderer2,
        private fb: FormBuilder,
        private el: ElementRef,
        private IbBookingContactFormDataService: IbBookingContactFormDataService) {}

    ngOnInit (): void {
        this.createForm();
        this.createInputsObs();
        this.setUpFormValueChanges();
    }

    ngAfterViewInit (): void {
        this.dropdownIcon = this.el.nativeElement.querySelector('svg');
    }
    
    ngOnDestroy (): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    ngOnChanges (changes: SimpleChanges): void {

        if (changes?.prefixList && this.prefixList?.length > 0) {
            this.updatePrefixValues();
        }

        if (changes?.selectedPrefix && this.phoneForm) {
            this.phoneForm.controls['prefix'].setValue(this.selectedPrefix);
        }
        this.handleFallbackDisabledChange(changes);
    }

    handleFallbackDisabledChange (changes: SimpleChanges): void {
        if (!changes['fallbackDisabled']) return;
        if (!this.phoneForm) return;

        const prefixCtrl = this.phoneForm.controls['prefix'];
        this.fallbackDisabled ? prefixCtrl.disable({ emitEvent: false }) : prefixCtrl.enable({ emitEvent: false });
    }


    filterPrefix = (event) => {
        let query = event.query.trim().toLowerCase();
        this.filteredPrefix = this.prefixList.filter(phone => 
            phone.description.toLowerCase().includes(query)
        );
    };

    onFocus = () => {
        this.autoComplete.show();
    };
    
    onShow = () => {
        this.renderer.addClass(this.dropdownIcon, 'rotate');
    };

    onHide = () => {
        this.renderer.removeClass(this.dropdownIcon, 'rotate');
    };

    onBlur (): void {
        const currentValue = this.phoneForm.get('prefix')?.value;
        if (!currentValue || currentValue?.code?.trim() === '') {
            this.phoneForm.get('prefix')?.setValue(this.previousPrefix);
        } else {
            this.previousPrefix = currentValue;
        }
    }
    
    private createForm = () =>{
        this.phoneForm = this.fb.group({
            prefix: [{ value: this.selectedPrefix, disabled: this.fallbackDisabled }, Validators.required],
            phone: ['', [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(60),
                Validators.pattern(BookingAppConstants.bookingPatterns.PHONE_PATTERN)
            ]] 
        });
    };

    private createInputsObs = () => {
        this.IbBookingContactFormDataService.prefix$
            .pipe(
                takeUntil(this.destroy$),
                debounceTime(100),
                distinctUntilChanged()
            )
            .subscribe(value =>{
                if(value?.code){
                    if(value?.code?.includes('+')){
                        this.phoneForm.patchValue({
                            prefix:value
                        });
                    } else{
                        this.phoneForm.patchValue({
                            prefix:{...value, code: `+${value.code}`}
                        });
                    }
                    this.previousPrefix = this.phoneForm.get('prefix')?.value;
                }
            });
        this.IbBookingContactFormDataService.phone$
            .pipe(
                takeUntil(this.destroy$),
                debounceTime(100),
                distinctUntilChanged()
            )
            .subscribe(value =>{
                this.phoneForm.patchValue({
                    phone:value
                });
            });
    };

    private setUpFormValueChanges = () => {
        this.phoneForm.statusChanges
            .pipe(
                takeUntil(this.destroy$),
                debounceTime(100)
            )
            .subscribe(() => {
                this.phoneFormValidity.emit(this.phoneForm.valid);
            });
        this.setupValueChangesObs<PrefixData>('prefix', this.IbBookingContactFormDataService.setPrefix);
        this.setupValueChangesObs<string>('phone', this.IbBookingContactFormDataService.setPhone);
    };

    private setupValueChangesObs = <T>(fieldName: string, setter: (value: T) => void) => {
        this.phoneForm.get(fieldName)?.valueChanges
            .pipe(
                takeUntil(this.destroy$),
                distinctUntilChanged()
            )
            .subscribe(value => {
                setter.call(this.IbBookingContactFormDataService, value);
            });
    };

    private updatePrefixValues = () =>{
        this.prefixList = this.prefixList.map(phone => {
            return { ...phone, code: '+' + phone.code };
        });
        this.removeDuplicateCountry();
        this.filteredPrefix = [...this.prefixList];
    };

    private removeDuplicateCountry = () =>{
        let firsIndex;
        firsIndex = this.prefixList.findIndex((country, index)=>country.code === this.prefixList[0].code && index !== 0);
        this.prefixList.splice(firsIndex, 1);
    };
}
