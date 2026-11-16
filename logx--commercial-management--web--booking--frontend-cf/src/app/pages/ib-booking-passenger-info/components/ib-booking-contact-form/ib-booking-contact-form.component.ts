import { Component, EventEmitter, Inject, Input, OnDestroy, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { downgradeToAJSComponent, CommonsSessionStorageService, IbCUserUtilsService, AJSRootScope } from 'ib-web-commons/utils';
import { PrefixData } from '@core/models/ib-booking-passenger-info/components/ib-booking-contact-form-model';
import { BookingAppConstants } from '@core/constants/ib-booking-constants';
import { IbBookingContactFormDataService } from './services/ib-booking-contact-form-data.service';
import { IbBookingRegisterFormDataService } from '../ib-booking-register-form/services/ib-booking-register-form-data.service';
import { ibSubscriptionPermissionService } from '@shared/services/ib-utils/ib-subscriptions-permission.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IbBookingPetsFlowService } from '@shared/services/ib-utils/ib-bookig-pets-flow.service';


@Component({
    selector: 'ib-booking-contact-form',
    templateUrl: './ib-booking-contact-form.component.html',
    styleUrls: ['./ib-booking-contact-form.component.scss']
})
export class IbBookingContactFormComponent implements OnInit, OnDestroy, OnChanges{
    @Input() submitState:boolean = false;
    @Input() prefixList: PrefixData[];
    @Input() selectedPrefix;
    @Input() phonePrefixFallback: boolean = false;
    @Input() gdprInfo;
    @Output() formValidity = new EventEmitter<boolean>();
    @Output() checkEmailConsent = new EventEmitter<string>();
    @Output() emailsInvalid = new EventEmitter<void>();

    public contactForm: FormGroup;
    public mailEmitted:string;
    public marketingPermResponse;
    public showMarketingPerm:boolean;
    public showMagazinePerm:boolean;
    private destroy$ = new Subject<void>();    
    public isCollapsableOpen: boolean = false;
    public isLogged: string;
    public safeGDPR: SafeHtml;
    public isPhoneFormValid: boolean = false;
    
    
    public EMAIL_CLEANER = BookingAppConstants.bookingPatterns.EMAIL_CLEANER;
    public MAX_LENGTH_EMAIL = BookingAppConstants.FIELD_LENGTH.MAX_LENGTH_EMAIL;
    
    
    constructor (
        @Inject(AJSRootScope) private rootScope: CommonsRootScope,
        private fb: FormBuilder,
        private IbBookingContactFormDataService: IbBookingContactFormDataService,
        private CommonsSessionStorageService:CommonsSessionStorageService,
        private IbBookingRegisterFormDataService: IbBookingRegisterFormDataService,
        private IbSubscriptionPermissionService: ibSubscriptionPermissionService,
        private CommonsUserUtilsService: IbCUserUtilsService,
        private sanitizer: DomSanitizer,
        private IbBookingPetsFlowService: IbBookingPetsFlowService
    ) {
        this.rootScope.$on('loginAccessPassengerInfo', this.areCommunicationPermsNeeded);
    }

    ngOnInit (): void {
        this.createForm();
        this.createInputsObs();
        this.setUpFormValueChanges();
        this.areCommunicationPermsNeeded();
    }

    ngOnChanges (changes: SimpleChanges): void {
        const prefixCtrl = this.contactForm?.get('contactPrefix');

        if (prefixCtrl && changes['selectedPrefix']) {
            prefixCtrl.setValue(this.selectedPrefix, { emitEvent: false });
            this.phonePrefixFallback ? prefixCtrl.disable({ emitEvent: false }) : prefixCtrl.enable({ emitEvent: false });
        }


        this.isLogged = this.rootScope.isLogged;

        if (changes['gdprInfo'] && this.gdprInfo?.text) {
            this.safeGDPR = this.sanitizer.bypassSecurityTrustHtml(this.gdprInfo.text);
        }
    }

    private createForm = () => {
        this.contactForm = this.fb.group({
            email: ['',  [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(60),
                Validators.pattern(BookingAppConstants.bookingPatterns.EMAIL_PATTERN)
            ]],
            denyNewsLetters: [false],
            isMarketingAccepted:[false],

            contactPrefix: [{
                value: this.selectedPrefix ?? null,
                disabled: this.phonePrefixFallback
            }, Validators.required]

        });
    };

    private createInputsObs = () =>{
        this.IbBookingContactFormDataService.email$
            .pipe(
                takeUntil(this.destroy$),
                debounceTime(100),
                distinctUntilChanged()
            )
            .subscribe(value =>{
                this.contactForm.patchValue({
                    email:value
                });
            });
        
        this.IbBookingContactFormDataService.denyNews$
            .pipe(
                takeUntil(this.destroy$),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(value =>{
                this.contactForm.patchValue({
                    denyNewsLetters:value
                });
            });

        this.contactForm.get('contactPrefix')!.valueChanges
            .pipe(
                takeUntil(this.destroy$),
                distinctUntilChanged()
            )
            .subscribe(prefix => {
                this.IbBookingContactFormDataService.setPrefix(prefix);
            });

    };

    private setUpFormValueChanges = () =>{
        this.contactForm.statusChanges
            .pipe(
                takeUntil(this.destroy$),
                debounceTime(100)
            )
            .subscribe(() => {
                this.formValidity.emit(this.contactForm.valid && this.isPhoneFormValid);
            });

        this.setupValueChangesObs<string>('email', this.IbBookingContactFormDataService.setEmail);
        this.setupValueChangesObs<boolean>('denyNewsLetters', this.IbBookingContactFormDataService.setDenyNews);
    };

    private setupValueChangesObs = <T>(fieldName: string, setter: (value: T) => void) => {
        this.contactForm.get(fieldName)?.valueChanges
            .pipe(
                takeUntil(this.destroy$),
                distinctUntilChanged()
            )
            .subscribe(value => {
                setter.call(this.IbBookingContactFormDataService, value);
            });
    };

    ngOnDestroy (): void {
        this.IbBookingContactFormDataService.resetData();
        this.destroy$.next();
        this.destroy$.complete();
    }


    setRegisterEmail = () => {
        if(!this.CommonsSessionStorageService.get('userLogged')) {
            if(document.getElementById('register_module_email')){
                this.IbBookingRegisterFormDataService.setEmail(this.contactForm.get('email')?.value);
            }
        }
    };

    checkInput = (isMarketingAccepted: boolean) => {
        this.rootScope.$emit('showMarketingPerm', isMarketingAccepted, this.marketingPermResponse);
    };

    callEmailConsent = () =>{
        if(this.IbBookingPetsFlowService.isPetsFlow) return;
        const emailIsOk = this.isEmailValid();
        if(emailIsOk && (this.contactForm.get('email')?.value !== this.mailEmitted)) {
            this.emailValidToCheck();
        }else if(this.contactForm.get('email')?.invalid) {
            this.emailInvalid();
        }
    };

    updatePhoneFormValidity = (valid:boolean) =>{
        this.isPhoneFormValid = valid;
        this.formValidity.emit(this.contactForm.valid && this.isPhoneFormValid);
    };

    private isEmailValid = (): boolean => {
        return this.contactForm.get('email')?.value && this.contactForm.get('email')?.valid;
    };

    private emailValidToCheck = () => {
        this.mailEmitted = this.contactForm.get('email')?.value;
        this.checkEmailConsent.emit(this.contactForm.get('email')?.value);
    };

    private emailInvalid = () => {
        this.mailEmitted = '';
        this.emailsInvalid.emit();
    };


    private areCommunicationPermsNeeded = async () => {
        const plus = this.CommonsUserUtilsService.isIbPlus();
        const zero = this.CommonsUserUtilsService.isIbZero();

        const permission = plus ? 'COMMERCIAL_CAMPAIGN' : zero ? 'MAGAZINE' : false;

        permission && await this.IbSubscriptionPermissionService.getMarketingPermissions()
            .then((response) => {
                let communicationObject = response.data.find((element) => element.permissionType === permission )?.permissionGranted;
                this.marketingPermResponse = response.data;
                this.showMarketingPerm = !communicationObject;
            })
            .catch(() => {
                this.showMarketingPerm = false;
            });
    };



    public toggleVisibility = (event:Event) => {
        const collapsable = document.querySelector('.contact-collapsable__closed') as HTMLElement;
        const content = collapsable.querySelector('.contact-collapsable__content') as HTMLElement;
        const contentHeight = content.offsetHeight;

        if (!this.isCollapsableOpen) {
            collapsable.style.height = `${contentHeight}px`;
            setTimeout(() => {
                collapsable.style.height = 'auto';
                this.isCollapsableOpen = true;
            }, 300);
        } else {
            collapsable.style.height = `${contentHeight}px`;
            setTimeout(() => {
                collapsable.style.height = '0';
                this.isCollapsableOpen = false;
            }, 200);
        }
    };
}

downgradeToAJSComponent(
    'ibBookingContactForm',
    { component: IbBookingContactFormComponent,
        inputs: ['submitState', 'prefixList', 'selectedPrefix', 'phonePrefixFallback', 'gdprInfo'],
        outputs: ['formValidity', 'checkEmailConsent', 'emailsInvalid'] },
    'ib-booking-passenger-info-module'
);
