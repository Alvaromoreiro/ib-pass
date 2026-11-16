import { IbBookingRegisterFormDataService } from './services/ib-booking-register-form-data.service';
import { LinkFilterData } from '@core/models/ib-booking-passenger-info/components/ib-booking-register-form-model';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { CommonsSessionStorageService, downgradeToAJSComponent } from 'ib-web-commons/utils';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { IbBookingPassengerFormUtilsService } from '@src/app/shared/services/ib-booking-passenger-form/ib-booking-passenger-form-utils.service';

@Component({
    selector: 'ib-booking-register-form',
    templateUrl: './ib-booking-register-form.component.html',
    styleUrls: ['./ib-booking-register-form.component.scss']
})
export class IbBookingRegisterFormComponent implements OnInit, OnDestroy, OnChanges {
    @Input() submitState:boolean = false;
    @Output() formValidity = new EventEmitter<boolean>();

    public openCollapsable: boolean = false;
    public showPass:boolean = false;
    public showPassRequirements = false;
    public userTermsLink: string = '';
    public privacyLink: string = '';
    public registerForm: FormGroup;
    public listItemTitles: string[];
    private destroy$ = new Subject<void>();
    private updateValidity = true;

    public MAX_LENGTH_NAME = BookingAppConstants.FIELD_LENGTH.MAX_LENGTH_NAME;
    public NAME_SURNAME_CLEANER = BookingAppConstants.bookingPatterns.NAME_SURNAME_CLEANER;
    public MAX_LENGTH_SURNAME = BookingAppConstants.FIELD_LENGTH.MAX_LENGTH_SURNAME;
    public MAX_LENGTH_EMAIL = BookingAppConstants.FIELD_LENGTH.MAX_LENGTH_EMAIL;
    public EMAIL_CLEANER = BookingAppConstants.bookingPatterns.EMAIL_CLEANER;

    constructor (
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private fb: FormBuilder,
        private IbBookingRegisterFormDataService: IbBookingRegisterFormDataService,
        private IbBookingPassengerFormUtilsService: IbBookingPassengerFormUtilsService
    ) {

    }

    ngOnChanges (changes: SimpleChanges): void {
        if(!this.openCollapsable){
            if(changes.submitState.currentValue && this.isCheckPassTouched()){
                this.toogleVisibility(new Event('click'));
            }
        }
    }

    ngOnInit (): void {
        let [userTermsLink, privacyLink] = this.createLinks();
        this.userTermsLink = userTermsLink;
        this.privacyLink = privacyLink;

        this.createForm();

        this.listItemTitles = [
            'REGISTER_FORM_LIST_1',
            'REGISTER_FORM_LIST_2',
            'REGISTER_FORM_LIST_3'
        ];
        this.createInputsObs();
        this.setUpFormValueChanges();

    }

    private createForm = () =>{
        this.registerForm = this.fb.group({
            password: ['', this.conditionalValidator(() => this.registerForm.get('check_register')?.value, [
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(20)
            ])],
            check_register: [false, this.conditionalValidator(() => this.registerForm.get('password')?.value, Validators.requiredTrue)],
            marketing_check: [false],
            name:['', this.conditionalValidator(() => this.registerForm.get('password')?.value || this.registerForm.get('check_register')?.value, [
                Validators.required,
                Validators.pattern(BookingAppConstants.bookingPatterns.NAME_SURNAME_PATTERN)
            ])],
            lastName:['', this.conditionalValidator(() => this.registerForm.get('password')?.value || this.registerForm.get('check_register')?.value, [
                Validators.required,
                Validators.pattern(BookingAppConstants.bookingPatterns.NAME_SURNAME_PATTERN)
            ])],
            email: ['', this.conditionalValidator(() => this.registerForm.get('password')?.value || this.registerForm.get('check_register')?.value, [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(60),
                Validators.pattern(BookingAppConstants.bookingPatterns.EMAIL_PATTERN)
            ])]
        });
    };

    private conditionalValidator = (predicate: () => boolean, validator: any) => {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.parent) {
                return null;
            }
            if (predicate()) {
                if (Array.isArray(validator)) {
                    return Validators.compose(validator)(control);
                }
                return validator(control);
            }
            return null;
        };
    };

    private createLinks = ():string[] => {
        let userTermsId = 'IBERIA_PLUS_CONDITIONS_LINK';
        let privacyId = 'DATA_PROTECTION_POLICY_LINK';
        const generalLinksList = this.CommonsSessionStorageService.get('generalLinksList') || {};
        const userTermsLink:LinkFilterData = generalLinksList[userTermsId];
        const privacyLink:LinkFilterData = generalLinksList[privacyId];
        return [
            `${window.location.origin}/${BookingAppConstants.market.toLowerCase()}${userTermsLink?.uri}`,
            `${window.location.origin}/${BookingAppConstants.market.toLowerCase()}${privacyLink?.uri}`
        ];
    };

    private createInputsObs = () =>{
        this.IbBookingRegisterFormDataService.name$
            .pipe(
                takeUntil(this.destroy$),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(value =>{
                this.registerForm.patchValue({
                    name:value
                });
            });
        this.IbBookingRegisterFormDataService.lastName$
            .pipe(
                takeUntil(this.destroy$),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(value =>{
                this.registerForm.patchValue({
                    lastName:value
                });
            });
        this.IbBookingRegisterFormDataService.email$
            .pipe(
                takeUntil(this.destroy$),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(value =>{
                this.registerForm.patchValue({
                    email:value
                });
            });
    };

    onRegisterNameBlur (controlName: string): void {
        const control = this.registerForm.get(controlName);
        if (!control || typeof control.value !== 'string') return;

        const cleaned = this.IbBookingPassengerFormUtilsService.cleanEdgeChars(control.value);

        if (cleaned !== control.value) {
            // emitEvent: true para que la suscripción de valueChanges propague el valor ya limpio al data service
            control.setValue(cleaned, { emitEvent: true });
        }
    }

    private setUpFormValueChanges = () =>{
        this.registerForm.statusChanges
            .pipe(
                takeUntil(this.destroy$),
                debounceTime(100)
            )
            .subscribe(() => {
                this.formValidity.emit(this.registerForm.valid);
            });

        this.registerForm.get('marketing_check')?.valueChanges
            .pipe(
                takeUntil(this.destroy$),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(value => {
                this.IbBookingRegisterFormDataService.setMarketingCheck(value);
            });

        this.setupValueChangesObs('name', this.IbBookingRegisterFormDataService.setName);
        this.setupValueChangesObs('lastName', this.IbBookingRegisterFormDataService.setLastName);
        this.setupValueChangesObs('email', this.IbBookingRegisterFormDataService.setEmail);
        this.registerForm.get('password')?.valueChanges
            .pipe(
                takeUntil(this.destroy$),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(value => {
                if(this.updateValidity){
                    this.updateValidity = false;
                    this.registerForm.get('check_register')?.updateValueAndValidity();
                    this.updateValidity = true;
                }
                this.updateFieldsValidities();
                this.IbBookingRegisterFormDataService.setPassword(value);
            });
        this.registerForm.get('check_register')?.valueChanges
            .pipe(
                takeUntil(this.destroy$),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(value => {
                if(this.updateValidity){
                    this.updateValidity = false;
                    this.registerForm.get('password')?.updateValueAndValidity();
                    this.updateValidity = true;
                }
                this.updateFieldsValidities();
                this.IbBookingRegisterFormDataService.setCheck(value);
            });
    };

    private updateFieldsValidities = () => {
        this.registerForm.get('name')?.updateValueAndValidity();
        this.registerForm.get('lastName')?.updateValueAndValidity();
        this.registerForm.get('email')?.updateValueAndValidity();
    };

    private setupValueChangesObs = (fieldName: string, setter: (value: string) => void) => {
        this.registerForm.get(fieldName)?.valueChanges
            .pipe(
                takeUntil(this.destroy$),
                distinctUntilChanged()
            )
            .subscribe(value => {
                setter.call(this.IbBookingRegisterFormDataService, value);
            });
    };

    private isCheckPassTouched = (): boolean => {
        return this.registerForm?.get('password')?.touched || this.registerForm?.get('check_register')?.touched;
    };

    toogleVisibility = (event:Event) => {
        event.preventDefault();

        const collapsable = document.querySelector('.collapsable__closed') as HTMLElement;

        if (!this.openCollapsable) {
            collapsable.style.height = collapsable.scrollHeight + 'px';
            setTimeout(() => collapsable.style.height = 'auto', 300);
        } else {
            collapsable.style.height = collapsable.scrollHeight + 'px';
            setTimeout(() => collapsable.style.height = '0px');
        }
        this.openCollapsable = !this.openCollapsable;
    };

    toogleShowPass = (event:Event) => {
        event.preventDefault();
        const input = document.getElementById('register_module_password') as HTMLInputElement;
        if (input.type === 'password') {
            input.type = 'text';
        } else {
            input.type = 'password';
        }
        this.showPass = !this.showPass;
    };

    ngOnDestroy (): void {
        this.IbBookingRegisterFormDataService.resetData();
        this.destroy$.next();
        this.destroy$.complete();
    }
}

downgradeToAJSComponent(
    'ibBookingRegisterForm',
    { component: IbBookingRegisterFormComponent,
        inputs: ['submitState'],
        outputs: ['formValidity'] },
    'ib-booking-passenger-info-module'
);
