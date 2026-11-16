import { Component, Input, Output, Inject, OnChanges, OnDestroy, ViewChild, ElementRef, EventEmitter, AfterViewInit, Renderer2, SimpleChanges, SimpleChange } from '@angular/core';
import { AutoComplete } from 'primeng/autocomplete';
import { Subject, takeUntil } from 'rxjs';
import { downgradeToAJSComponent, AJSRootScope, IbCUserUtilsService, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { AJSBookingModalService, BookingModalServiceType } from '@src/app/shared/components/ib-booking-modal/services/upgraded/ib-booking-modal-service-bridge.service';
import { AJSBookingPassengerInfoService, BookingPassengerInfoServiceType } from '../../services/ib-booking-passenger-info-service-bridge.service';
import { AJSBookingUtilsService } from '@src/app/shared/services/ib-utils/ib-booking-utils-service-bridge.service';
import { IbBookingRegisterFormDataService } from '../ib-booking-register-form/services/ib-booking-register-form-data.service';
import { IbBookingPassengerInfoUtilsService } from '@src/app/shared/services/ib-booking-passenger-info/ib-booking-passenger-info-utils.service';
import { IbBookingPassengerFormUtilsService } from '@src/app/shared/services/ib-booking-passenger-form/ib-booking-passenger-form-utils.service';
import { IbBookingPassengerFormValidationService } from '@src/app/shared/services/ib-booking-passenger-form/ib-booking-passenger-form-validation.service';
import { BookingPassengerInfoConstants } from '../../../../core/constants/ib-booking-passenger-info-constants';
import { TranslateService } from '@ngx-translate/core';
import { OverlayPanel } from 'primeng/overlaypanel';
import { OptionalDocument, MandatoryDocument, PassengersFormData } from '@src/app/core/models/ib-booking-pasenger-form/ib-booking-passenger-form.model';
import { IbBookingLuhnValidator } from '@src/app/shared/validators/ib-booking-luhn-validator';
import { IbBookingDniValidator } from '@src/app/shared/validators/ib-booking-dni-validator';
import { PassengerFormUtilsService } from './services/passenger-form-utils.service';
import { ManageStoredPassengerFormDataService } from './services/manage-stored-passenger-form-data.service';

 
@Component({
    selector: 'ib-booking-passenger-form',
    templateUrl: './ib-booking-passenger-form.component.html',
    styleUrls: ['./ib-booking-passenger-form.component.scss']
})
export class IbBookingPassengerFormComponent implements OnChanges, AfterViewInit, OnDestroy {
    @Input() passengersData: PassengersFormData;
    @Input() index: number;
    @Input() suitableForPartnerDiscount:boolean;
    @Input() farePartner;
    @Input() submitState:boolean = false;
    @Input() localStoragePassengersData:boolean = false;
    @Input() fillResidentChecked = {isChecked:false, index:0};
    @Input() fillLargeFamilyChecked = {isChecked:false, index:0};
    @Output() formValidity = new EventEmitter<{isValid:boolean, passForm:FormGroup, index: number}>();
    @Output() checkItravelStatus = new EventEmitter<boolean>();
    @Output() resetPersonInCharge = new EventEmitter<number>();
    @Output() fillResident = new EventEmitter<{isChecked:boolean, index:number}>();
    @Output() fillLargeFamily = new EventEmitter<{isChecked:boolean, index:number}>();
    @Output() birthDateFormValidChanged = new EventEmitter<{isValid:boolean, index:number}>();
    @ViewChild('overlayPanel') overlayPanel: OverlayPanel;
    
    infoTypesPassenger = {
        infants: [],
        canBeInCharge: []
    };

    @ViewChild('autoComplete') autoComplete!: AutoComplete;
    
    public passengerForm: FormGroup;
    public isSpecialNeedsFormValid: boolean = true;
    private luhnValidator: IbBookingLuhnValidator;
    private dniValidator: IbBookingDniValidator;
    isIbPlus:boolean;
    isSoftUser:boolean;
    isRedemptionFlow:boolean;
    isShuttleFlow:boolean;
    isPointsOBFlow:boolean;
    birthDateSelectorId;
    flowApp: any;
    popoverText: string | null = null;
    dropdownIcon: HTMLElement;
    showUploadedInfoResident:boolean = false;
    showUploadedInfoLargeFam:boolean = false;
    filteredPassengers: any[] = [];
    filteredMandatoryDocs: any[][] = [];
    filteredOptionalDocuments: OptionalDocument[][] = [];
    filteredMunicipalities: { [key: number]: any[] } = {};
    infantInAdultsInCharge: any[] = [];
    filteredLargeFamilyTypes: string[] = [];
    filteredCommunityCodes: string[] = [];
    filteredCompanies: { [key: number]: any[] } = {};
    previousCompanySelection;
    filteredBusinessCodeTypes: { [key: number]: any[] } = {};
    filteredFrequentlyPassengers: { [key: number]: any[] } = {};
    lastSelectedMandatoryDoc: MandatoryDocument;

    public showFrequentlyPassengers: boolean = false;
    public showGender: boolean = true;
    public showMunicipalityCode: boolean = false;
    public showResidentNumber: boolean = false;
    public showPersonInCharge: boolean = false;
    public showLargeFamilyType: boolean = false;
    public showCommunityCode: boolean = false;
    public showLargeFamilyNumber: boolean = false;
    public showSelectedFrequentFlyer: boolean = false;
    public optionalDocsArray: any[] = []; 
    public mandatoryDocCleaner: string = BookingAppConstants.bookingPatterns.DOCS_CLEANER;
    public optionalDocCleaner: { [key: number]: string } = {};

    public LOGIN_ONB = BookingAppConstants.LOGIN_ONB;
    public NAME_SURNAME_CLEANER = BookingAppConstants.bookingPatterns.NAME_SURNAME_CLEANER;
    public REDRESS_NUMBER_CLEANER = BookingAppConstants.bookingPatterns.REDRESS_NUMBER_CLEANER;
    public RESIDENT_NUMBER_CLEANER = BookingAppConstants.bookingPatterns.DOCS_CLEANER;
    public CARD_NUMBER_CLEANER = BookingAppConstants.bookingPatterns.CARD_NUMBER_CLEANER;
    public CARD_NUMBER_CLEANER_AA = BookingAppConstants.bookingPatterns.AA_CARD_CLEANER;
    public MAX_LENGTH_NAME = BookingAppConstants.FIELD_LENGTH.MAX_LENGTH_NAME;
    public MAX_LENGTH_LAST_SURNAME = BookingAppConstants.FIELD_LENGTH.MAX_LENGTH_LAST_SURNAME;
    public MAX_LENGTH_MANDATORY_DOC = BookingAppConstants.FIELD_LENGTH.MAX_LENGTH_MANDATORY_DOC;
    public MAX_LENGTH_LARGE_FAMILY_DOC = BookingAppConstants.FIELD_LENGTH.MAX_LENGTH_LARGE_FAMILY_DOC;
    public MAX_LENGTH_IBERIA_CARD = BookingAppConstants.FIELD_LENGTH.MAX_LENGTH_IBERIA_CARD;
    public MAX_LENGTH_OTHER_FREQUENTFLYER_CARD = BookingAppConstants.FIELD_LENGTH.MAX_LENGTH_OTHER_FREQUENTFLYER_CARD;

    private destroy$ = new Subject<void>();
    private alreadyInitialized = false;

    constructor (
        @Inject(AJSRootScope) private $rootScope: CommonsRootScope,
        @Inject(AJSBookingModalService) private BookingModalService: BookingModalServiceType,
        @Inject(AJSBookingPassengerInfoService) private BookingPassengerInfoService: BookingPassengerInfoServiceType,
        @Inject(AJSBookingUtilsService) private BookingUtilService,
        private fb: FormBuilder,
        private el: ElementRef,
        private renderer: Renderer2,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private CommonsUserUtilsService: IbCUserUtilsService,
        private IbBookingRegisterFormDataService: IbBookingRegisterFormDataService,
        private IbBookingPassengerInfoUtilsService: IbBookingPassengerInfoUtilsService,
        private IbBookingPassengerFormUtilsService: IbBookingPassengerFormUtilsService,
        private IbBookingPassengerFormValidationService: IbBookingPassengerFormValidationService,
        private TranslateService: TranslateService,
        private PassengerFormUtilsService: PassengerFormUtilsService,
        private ManageStoredPassengerFormDataService: ManageStoredPassengerFormDataService
    ) {}

    private activate = ():void => {
        if (this.alreadyInitialized) return;
        this.alreadyInitialized = true;
        this.createForm();
        this.setUpFormValueChanges();
        this.isIbPlus = this.CommonsUserUtilsService.isIbPlus();
        this.isSoftUser = this.CommonsUserUtilsService.isSoftUser();
        this.isRedemptionFlow = this.$rootScope.isRedemptionFlow;
        this.isShuttleFlow = this.$rootScope.isShuttleFlow;
        this.isPointsOBFlow = this.$rootScope.isPointsOBFlow;
        const infantIndex = this.passengersData.securityInfo.passengerInfo.findIndex((passInfo) => {
            return passInfo.type === BookingAppConstants.passengerTypes.infant;
        });
        this.flowApp = this.CommonsSessionStorageService.get('flowApp');
        this.preselectFormValues();
        this.checkPassengers(this.passengersData.frequentlyPassengers);
        if (this.index === 0) this.selectMainPassenger();
        if(this.passengersData.securityInfo.passengerInfo && this.passengersData.securityInfo.passengerInfo[this.index] === this.passengersData.securityInfo.passengerInfo[infantIndex]) this.checkInfantCaregiver(this.passengersData.securityInfo.passengerInfo, infantIndex);
        this.checkTypesPassengers();
        this.setupOptionalDocsCheckboxListener();
        this.birthDateSelectorId = this.buildBirthDateId(this.index, this.passengersData?.securityInfo?.passengerInfo[this.index]?.type);
        this.showGender = this.BookingPassengerInfoService.showGender(this.passengersData.securityInfo.passengerInfo[this.index].requiredFields);
        this.checkBirthDateValidity();
        this.setValuesValidators();
        this.resetBirthDateValue();
    };

    private preselectFormValues = () => {
        if (this.showInput(this.passengersData.securityInfo.passengerInfo[this.index]?.requiredFields, 'GENDER') && !this.passengersData.securityInfo.passengerInfo[this.index].data?.gender) {
            this.passengerForm.get([`gender_${this.index}`])?.setValue('MALE');
        }
        this.passengersData.securityInfo.passengerInfo[this.index].mandatoryDocs.length === 1 && 
            this.passengerForm.get([`mandatoryDoc_${this.index}`]).setValue(this.passengersData.securityInfo.passengerInfo[this.index].mandatoryDocs[0]);
    };

    private resetBirthDateValue = () => {
        if (!this.passengersData.securityInfo.passengerInfo[this.index].data?.birthDate) {
            this.passengersData.securityInfo.passengerInfo[this.index].data.birthDate = ['', '', ''];
        }
    };

    ngOnDestroy (): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
    ngAfterViewInit (): void {
        this.dropdownIcon = this.el.nativeElement.querySelector('svg');
        this.filterFrequentlyPassengers({query:''}, this.index);
        this.filterMandatoryDocs({query:''}, this.index);
        this.filterOptionalDocuments({query:''}, this.index);
        this.filterMunicipalities({query:''}, this.index);
        this.filterInfantInAdultsInCharge({query:''});
        this.filterLargeFamilyTypes({query:''}, this.index);
        this.filterCommunityCodes({query:''}, this.index); 
        this.filterCompanies({query:''}, this.index);
        this.filterBusinessCodeTypes({query:''}, this.index);
    }
    private createForm (): void {

        const maxLengthSurname = this.getMaxLengthSurname();

        this.passengerForm = this.fb.group({
            iTravelCheck: [this.passengersData.securityInfo.iTravel],
            selectedFrequentlyPassenger: [''],
            [`name_${this.index}`]: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(this.MAX_LENGTH_NAME), Validators.pattern(BookingAppConstants.bookingPatterns.NAME_SURNAME_PATTERN)]],
            [`first_surname_${this.index}`]: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(maxLengthSurname), Validators.pattern(BookingAppConstants.bookingPatterns.NAME_SURNAME_PATTERN)]],
            [`last_surname_${this.index}`]: ['', [Validators.minLength(2), Validators.maxLength(this.MAX_LENGTH_LAST_SURNAME), Validators.pattern(BookingAppConstants.bookingPatterns.NAME_SURNAME_PATTERN)]],
            [`gender_${this.index}`]: ['MALE'],
            [`mandatoryDoc_${this.index}`]: this.fb.group({
                code: [''],
                description: [''],
                number: [''],
                showFields: [{}]
            }),
            [`check_optional_docs_${this.index}`]: [false],
            [`optionalDocuments_${this.index}`]: this.fb.group({
                selectedDoc: [null], 
                number: [''] 
            }),
            [`municipalityCode_${this.index}`]: [''],
            [`residentNumber_${this.index}`]: [''],
            [`personInCharge_${this.index}`]: [''],
            [`largeFamilyType_${this.index}`]: [''],
            [`communityCode_${this.index}`]: [''],
            [`largeFamilyNumber_${this.index}`]: this.fb.group({
                code: [''],
                communityCodePattern: [''],
                firstPattern: [''],
                secondPattern: [''],
                thirdPattern: [''],
                fourthPattern: ['']
            }),
            [`check_ff_${this.index}`]: [false],
            [`company_${this.index}`]: [''],
            [`number_card_${this.index}`]: [''],
            [`check_obn_${this.index}`]: [false],
            [`ob_number_card_${this.index}`]: [''],
            [`businessCodeType_${this.index}`]: [''],
            check_fill_large_family:[false],
            check_fill_resident_number:[false]
        });
        if(this.passengersData.securityInfo.passengerInfo[this.index].data?.largeFamilyType){
            this.passengerForm.get([`largeFamilyType_${this.index}`]).setValue(
                this.TranslateService.instant( this.passengersData.securityInfo.passengerInfo[this.index].data?.largeFamilyType)
            );
            this.passengerForm.get([`largeFamilyType_${this.index}`]).disable();
        }
    }

    private cleanEdgeChars (value: string): string {
        if (!value) return value;

        return value.replace(/^[\s'-]+|[\s'-]+$/g, '');
    }

    onNameBlur (controlName: string): void {
        const control = this.passengerForm.get(controlName);
        if (!control || typeof control.value !== 'string') return;

        const cleanedValue = this.IbBookingPassengerFormUtilsService.cleanEdgeChars(control.value);

        if (cleanedValue !== control.value) {
            control.setValue(cleanedValue, { emitEvent: false });
        }
    }

    setRegisterName () {
        if(document.getElementById('register_module_name')){
            const raw = (document.getElementById('name_0') as HTMLInputElement).value;
            this.IbBookingRegisterFormDataService.setName(this.IbBookingPassengerFormUtilsService.cleanEdgeChars(raw));
        }
    }

    setRegisterSurame () {
        if(document.getElementById('register_module_surname')){
            const raw = (document.getElementById('first_surname_0') as HTMLInputElement).value;
            this.IbBookingRegisterFormDataService.setLastName(this.IbBookingPassengerFormUtilsService.cleanEdgeChars(raw));
        }
    }

    filterFrequentlyPassengers (event: any, index: number): void {
        const query = event.query.toLowerCase();
        const allPassengers = this.passengersData.securityInfo.passengerInfo[index].frequentlyPassengers || [];
        this.filteredFrequentlyPassengers[index] = allPassengers.filter((passenger: any) => {
            if (passenger.needsTranslate) {
                return passenger.name.toLowerCase().includes(query);
            } else {
                return (
                    passenger.name.toLowerCase().includes(query) ||
                    passenger.surname1.toLowerCase().includes(query) ||
                    (passenger.surname2 && passenger.surname2.toLowerCase().includes(query))
                );
            }
        }).map((passenger)=>{
            return {
                ...passenger,
                displayName: passenger.needsTranslate ? this.TranslateService.instant(passenger.name) : (passenger.name + ' ' + passenger.surname1 + ' ' + passenger.surname2).trim()
            };
        });
    }
   
    updateSpecialNeeds (specialNeeds: { values: any, isValid: boolean }, passengerIndex: number) {
        this.isSpecialNeedsFormValid = specialNeeds.isValid;

        const passenger = this.passengersData.securityInfo.passengerInfo[passengerIndex];
        if (passenger) {
            const needs = passenger.specialNeeds;
            const formValues = specialNeeds.values;

            needs.isEnable = formValues[`check_enable_${passengerIndex}`];
            needs.specialVision = formValues[`check_vision_${passengerIndex}`];
            needs.specialHearing = formValues[`check_hearing_${passengerIndex}`];
            needs.specialIntellDisability = formValues[`check_intellDisability_${passengerIndex}`];
            needs.specialGuideDog = formValues[`check_guide_dog_${passengerIndex}`];
            needs.specialWheelchair = formValues[`check_chair_${passengerIndex}`];
            needs.specialWheelchairValue = formValues.specialWheelchairValue;
        }
    }

    selectPassenger (passenger, index) {
        this.passengersData.securityInfo.passengerInfo[index].selectedFrequentlyPassenger = passenger;
        if (passenger.type === BookingAppConstants.passengerTypes.Default) {
            this.resetFormValues(passenger, index);
        } else {
            this.setPersonalInfoFormValues(passenger, index);                
                
            if (this.isSamePassenger(passenger)) {
                this.setSecondaryInfoFormValues(passenger, index);
                   
            } else {
                this.passengersData.securityInfo.passengerInfo[index].options.haveIbPlus = false;
                this.passengerForm.patchValue({
                    [`check_ff_${this.index}`]: false
                });
                this.setOBValues(passenger);

            }
            this.setPassengerBirthDateValue(passenger, index);
            this.setGenderValue(passenger);
            this.changeState(passenger, this.passengersData.frequentlyPassengers);
        }


    }

    private resetFormValues = (passenger, index:number) => {
        this.passengerForm.patchValue({
            [`name_${this.index}`]: '',
            [`first_surname_${this.index}`]: '',
            [`last_surname_${this.index}`]: '',
            selectedFrequentlyPassenger: '',
            [`check_ff_${this.index}`]: false,
            [`company_${this.index}`]:'',
            [`number_card_${this.index}`]:'',
            [`mandatoryDoc_${this.index}`]:{
                code: '',
                description: '',
                number: '',
                showFields: {}
            },
            [`optionalDocuments_${this.index}`]:{
                selectedDoc: null,
                number: ''
            },
            [`largeFamilyNumber_${this.index}`]:{
                code: '',
                communityCodePattern: '',
                firstPattern: '',
                secondPattern: '',
                thirdPattern: '',
                fourthPattern: ''

            },
            [`residentNumber_${this.index}`]:'',
            [`municipalityCode_${this.index}`]: '',
            [`communityCode_${this.index}`]: ''

        });
        this.passengerForm.get([`name_${this.index}`]).enable();
        this.passengerForm.get([`first_surname_${this.index}`]).enable();
        this.passengerForm.get([`last_surname_${this.index}`]).enable();
        this.passengerForm.get([`company_${this.index}`]).enable();
        this.passengerForm.get([`number_card_${this.index}`]).enable();
        if (this.passengersData.securityInfo.passengerInfo[index].data.birthDate) {
            this.passengersData.securityInfo.passengerInfo[index].data.birthDate['0'] = '';
            this.passengersData.securityInfo.passengerInfo[index].data.birthDate['1'] = '';
            this.passengersData.securityInfo.passengerInfo[index].data.birthDate['2'] = '';
        }
        this.passengersData.securityInfo.passengerInfo[index].specialNeeds.isEnable = false;
        this.passengersData.securityInfo.passengerInfo[index].options = { haveBirthdate: false, haveName: false, haveSurname: false, haveLastName: false, haveIbPlus: false, haveGender: false };
        this.IbBookingPassengerInfoUtilsService.resetStoragedMandatoryDocs(this.passengersData.securityInfo.passengerInfo[index].mandatoryDocs);
        this.changeState(passenger, this.passengersData.frequentlyPassengers);
    };

    private setPersonalInfoFormValues = (passenger, index:number) => {
        if (passenger.name || passenger.userInfo?.firstName) {
            this.setName(passenger, index);
            
        }

        if (passenger.surname1 || passenger.userInfo?.lastName) {
            this.setSurnames(this.passengersData.securityInfo.isResident, passenger, index);
        }
        this.passengersData.securityInfo.passengerInfo[index].specialNeeds.isEnable = passenger.specialNeeds;
    };

    private setSecondaryInfoFormValues = (passenger, index:number) => {
        if (this.passengersData.securityInfo.passengerInfoLogged.ibPlusNumber) {
            this.passengerForm.patchValue({
                [`check_ff_${this.index}`]: true,
                [`company_${this.index}`]: {
                    airlineName: BookingPassengerInfoConstants.frequentFlyerCompanies.airlineName.IBERIA, 
                    iataCompanyCode: BookingPassengerInfoConstants.frequentFlyerCompanies.iataCompanyCode.IBERIA 
                },
                [`number_card_${this.index}`]: +this.passengersData.securityInfo.passengerInfoLogged.ibPlusNumber
            });
            this.passengerForm.get([`company_${this.index}`]).disable();
            this.passengerForm.get([`number_card_${this.index}`]).disable();
            this.passengersData.securityInfo.passengerInfo[index].options.haveIbPlus = true;
        }
        if (passenger.selectedDoc && this.passengersData.securityInfo.passengerInfo[index].mandatoryDocs) {
            const areEmptyTravelDocs = !this.passengersData.securityInfo.passengerInfo[index].mandatoryDocs.find((data)=>data.number!=='');
            areEmptyTravelDocs && this.IbBookingPassengerInfoUtilsService.addTravelDocs(this.passengersData.securityInfo.passengerInfo[index].mandatoryDocs, this.CommonsSessionStorageService.get('travelDocuments'));
            this.passengerForm.patchValue({
                [`mandatoryDoc_${this.index}`]: { ...passenger.selectedDoc }
            });
        } else {
            this.passengerForm.patchValue({
                [`mandatoryDoc_${this.index}`]: passenger.selectedDoc = null
            });
        }
        if ( this.passengersData.securityInfo.passengerInfo[index].largeFamilyDiscountInfo ) {
            const {largeFamilyDiscountInfo} = this.passengersData.securityInfo.passengerInfo[index];
            const selectedCommunity = this.getPreselectedFieldValue('COMMUNITY_CODE', largeFamilyDiscountInfo.communityCode.code);
            this.passengerForm.get([`communityCode_${this.index}`]).setValue(selectedCommunity);
            this.passengerForm.get(`largeFamilyNumber_${this.index}`).get('code').setValue(largeFamilyDiscountInfo.largeFamilyCertificateNumber);
            this.passengerForm.get(`largeFamilyNumber_${this.index}`).get('communityCodePattern').setValue(largeFamilyDiscountInfo.communityCodePattern);
        }
        if ( this.passengersData.securityInfo.passengerInfo[index].residentDiscountInfo ) {
            const selectedMunicipality = this.getPreselectedFieldValue('MUNICIPALITY_CODE', this.passengersData.securityInfo.passengerInfo[index].residentDiscountInfo?.municipalityCode);
            this.passengerForm.get([`municipalityCode_${this.index}`]).setValue(selectedMunicipality);
        }
    };

    private setPassengerBirthDateValue = (passenger, index:number) => {
        let date;
        if (this.passengersData.securityInfo.passengerInfo[index].requiredFields.BIRTH_DATE) {
            this.passengersData.securityInfo.passengerInfo[index].options.haveBirthdate = false;
            if (!this.passengersData.securityInfo.passengerInfo[index].data.birthDate) {
                this.passengersData.securityInfo.passengerInfo[index].data.birthDate = {};
            }
            if (passenger.birthDate) {
                date = passenger.birthDate.split('-');
                this.passengersData.securityInfo.passengerInfo[index].data.birthDate['2'] = date[0];
                this.passengersData.securityInfo.passengerInfo[index].data.birthDate['1'] = date[1];
                this.passengersData.securityInfo.passengerInfo[index].data.birthDate['0'] = date[2];
                this.passengersData.securityInfo.passengerInfo[index].options.haveBirthdate = true;
            }
        }
    };

    private setGenderValue = (passenger) => {
        if(!!passenger.index && !!passenger.title) {
            passenger.gender = passenger.title==='Mrs' ? '2' : passenger.gender;
        }
        if (this.isGenderInvalid(passenger)) {
            passenger.gender === '2' ? this.passengerForm.patchValue({
                [`gender_${this.index}`]: BookingPassengerInfoConstants.passengerGender.FEMALE
            }) : 
                this.passengerForm.patchValue({
                    [`gender_${this.index}`]: BookingPassengerInfoConstants.passengerGender.MALE
                });
        } else {
            this.passengerForm.patchValue({
                [`gender_${this.index}`]: passenger.gender.toUpperCase()
            });
        }
    };

    private setOBValues = (passenger) => {
        if (passenger.program) {
            this.passengerForm.patchValue({
                [`check_ff_${this.index}`]: true,
                [`company_${this.index}`]: this.passengersData.companiesList.find(company => company.iataCompanyCode === passenger.program),
                [`number_card_${this.index}`]: passenger.frequentFlyer
            });
        }
    };

    private setName = (passenger, index:number) => {
        const name = passenger.name || passenger.userInfo.firstName;
        this.passengerForm.patchValue({
            [`name_${this.index}`]: name
        });
        this.passengersData.securityInfo.passengerInfo[index].data.name = name;
        this.passengerForm.get([`name_${this.index}`]).disable();
    };

    private setSurnames = (isResident:boolean, passenger, index:number) => {
        const lastName = passenger.userInfo ? passenger.userInfo.lastName : passenger.surname1;
        const secondLastName = passenger.userInfo ? passenger.userInfo.secondLastName : passenger.surname2;
        if (isResident) {
            this.passengerForm.patchValue({
                [`first_surname_${this.index}`]: lastName,
                [`last_surname_${this.index}`]: secondLastName
            });
            this.passengersData.securityInfo.passengerInfo[index].data.surname = lastName;
            this.passengersData.securityInfo.passengerInfo[index].data.lastSurname = secondLastName;
        } else {
            if (passenger.surname2 || passenger.userInfo?.secondLastName) {
                this.concatSurnames(passenger, index);
            } else {
                this.noConcatSurnames(passenger, index);
            }
        }
        this.truncateSurnames();
        this.passengerForm.get([`first_surname_${this.index}`]).disable();
        this.passengerForm.get([`last_surname_${this.index}`]).value  !== '' && this.passengerForm.get([`last_surname_${this.index}`]).disable();
    };


    private concatSurnames = (passenger, index) => {
        const surname = passenger.userInfo && passenger.userInfo.lastName ? passenger.userInfo.lastName + ' ' + passenger.userInfo.secondLastName : passenger.surname1 + ' ' + passenger.surname2;
        this.passengerForm.patchValue({
            [`first_surname_${this.index}`]: surname
        });
        this.passengersData.securityInfo.passengerInfo[index].data.surname = surname;
    };
    
    private noConcatSurnames = (passenger, index) => {
        const surname = passenger.userInfo && passenger.userInfo.lastName ? passenger.userInfo.lastName : passenger.surname1;
        this.passengerForm.patchValue({
            [`first_surname_${this.index}`]: surname
        });
        this.passengersData.securityInfo.passengerInfo[index].data.surname = surname;
    };

    private truncateSurnames = () => {
        let truncatedSurnames;
        let truncatedObject = {
            surname: this.passengerForm.get([`first_surname_${this.index}`]).value,
            lastSurname: this.passengerForm.get([`last_surname_${this.index}`])?.value ?? null
        };
        truncatedSurnames = this.BookingUtilService.trunkateMaxLength(this.passengersData.securityInfo.isResident, truncatedObject);
        this.passengerForm.patchValue({
            [`first_surname_${this.index}`]: truncatedSurnames.surname,
            [`last_surname_${this.index}`]: truncatedSurnames.lastSurname ?? ''
        });
    };

    private isSamePassenger = (passenger) => {
        return this.passengersData.securityInfo.passengerInfoLogged.name === passenger.name && this.passengersData.securityInfo.passengerInfoLogged.surname1 === passenger.surname1 && this.passengersData.securityInfo.passengerInfoLogged.surname2 === passenger.surname2;
    };

    private isGenderInvalid = (passenger) => {
        return !passenger.gender || (passenger.gender.toUpperCase() !== BookingPassengerInfoConstants.passengerGender.MALE && passenger.gender.toUpperCase() !== BookingPassengerInfoConstants.passengerGender.FEMALE);
    };

    changeState (passenger, frequentlyPassengers) {
        if(Array.isArray(frequentlyPassengers?.beneficiaries)) {
            frequentlyPassengers.beneficiaries.forEach(beneficiarie => {
                if (this.passengersData.securityInfo.passengerInfo[this.index].previousSelected) {
                    if (beneficiarie.index === this.passengersData.securityInfo.passengerInfo[this.index].previousSelected.index) {
                        beneficiarie.isSelected = false;
                    }
                }
                if (beneficiarie.index === passenger.index && beneficiarie.type !== 'DEFAULT') {
                    beneficiarie.isSelected = true;
                }
            });   
        }

        this.passengersData.securityInfo.passengerInfo[this.index].previousSelected = passenger;
        this.checkPassengers(frequentlyPassengers);
    }

    buildBirthDateId (index, type) {
        return 'bbki-passenger-form-'+index+'-birth-date-'+type.toLowerCase();
    }

    setBirthDateFormValid (isValid) {
        this.birthDateFormValidChanged.emit({
            isValid: isValid,
            index: this.index
        });
    }

    showInput (object: any, input: string): boolean {
        return ((object?.[input] || null) !== null);
    }


    checkDocumentUnicityList (idPassenger?): void {

        this.passengersData.securityInfo.passengerInfo.forEach((passenger, index) => {
            const control = this.passengerForm.get(`mandatoryDoc_${index}`)?.get('number');
            if(idPassenger === index){
                passenger.mandatoryDocs.map((doc)=>{
                    if(doc.code === this.passengerForm.get(`mandatoryDoc_${index}`)?.get('code').value){
                        doc.number = this.passengerForm.get(`mandatoryDoc_${index}`)?.get('number').value;
                    }
                });
            }
            if (control) {
                if (control?.errors) {
                    delete control.errors['docDuplicity'];
                }

                this.checkDocumentUnicity(index, control);
            }
        });

        this.checkAndCleanServiceError('mandatoryDoc_', idPassenger, 'idInfoError', 'number');
    }
    /**
         * Checks if the passenger given has a duplicated document
         * whe it found one, it shows a modal error
         * @param {*} passenger Passenger to check
         * @param {*} passengerIndex Index of the passenger given, to avoid false positive checking himself
         * @param {*} element The element binded to this passenger.
         */
    checkDocumentUnicity (passengerIndex: number, control: AbstractControl): void {
        this.passengersData.securityInfo.passengerInfo.forEach((otherPassenger, i) => {
            if(this.passengerForm.get(`mandatoryDoc_${passengerIndex}`).get('code').value === 'RUC')  return;
            if (this.checkSameDoc(otherPassenger, passengerIndex) && passengerIndex !== i) {
                control.setErrors({ docDuplicity: true });
            }
        });
    }

    checkSameDoc = (passenger, passengerIndex:number) => {
        return passenger.data.mandatoryDoc?.number?.toUpperCase() === this.passengerForm.get(`mandatoryDoc_${passengerIndex}`).get('number').value?.toUpperCase() &&
            passenger.data.mandatoryDoc.description  === this.passengerForm.get(`mandatoryDoc_${passengerIndex}`).get('description').value;
    };

    checkAndCleanServiceError (baseItem:string, idPassenger: number, typeError: string, controlId:string): void {
        const control = this.passengerForm.get(`${baseItem}${idPassenger}`);
        if (control) {
            const controlForm = control?.get(`${controlId}`);
            const errors = controlForm?.errors ?? {};
            delete errors['largeFamilyCommunityError'];
            delete errors['invalidDocumentError'];
            delete errors['serviceInvalidDocumentError'];
            controlForm.setErrors(Object.keys(errors).length ? errors : null);
        }

        const passenger = this.passengersData.securityInfo.passengerInfo[idPassenger];
        if (passenger?.serviceErrors[0]?.typeError === typeError) {
            passenger.serviceErrors.pop();
        }
    }

    filterMandatoryDocs (event: any, index: number) {
        const query = event.query?.toLowerCase() || '';
        const docs = this.passengersData.securityInfo.passengerInfo[index].mandatoryDocs;
        this.filteredMandatoryDocs[index] = this.IbBookingPassengerFormUtilsService.filterByProperty(query, docs, 'description');
    }
    
    filterOptionalDocuments (event: any, index: number): void {
        const query = event.query || '';
        this.filteredOptionalDocuments[index] = this.IbBookingPassengerFormUtilsService.filterByProperty(query, this.optionalDocsArray, 'description');
    }

    filterMunicipalities (event: any, index: number): void {
        const query = event.query.toLowerCase();
        const allMunicipalities = this.passengersData.securityInfo.passengerInfo[index]?.requiredFields['MUNICIPALITY_CODE']?.values || [];
        this.filteredMunicipalities[index] =  this.IbBookingPassengerFormUtilsService.filterByProperty(query, allMunicipalities, 'description');
    }




    filterInfantInAdultsInCharge (event: any): void {
        const query = event.query.toLowerCase();
        this.infantInAdultsInCharge = this.passengersData.securityInfo.passengerInfo
            .filter(passenger => this.isAdultMatch(passenger, query) && passenger.canBeInCharge === true
            )
            .map((passenger)=>{
                return {
                    ...passenger,
                    displayName: this.getAdultDisplayName(passenger)
                };
            });
    }

    private isAdultMatch = (passenger, query:string) => {
        const nameValue = this.passengerForm.get([`name_${this.index}`]).value?.toLowerCase() ?? '';
        const firstSurnameValue = this.passengerForm.get([`first_surname_${this.index}`]).value?.toLowerCase() ?? '';
        const queryLower = query.toLowerCase();

        let matches = false;

        if (passenger.data.name) {
            const pasNumber = passenger.name?.pasNumber ?? '';
            matches = nameValue.includes(queryLower) || pasNumber.includes(queryLower);
        } else {
            matches = nameValue.includes(queryLower) || firstSurnameValue.includes(queryLower);
        }

        return matches;
    };

    private getAdultDisplayName = (passenger) => {
        return passenger.data && passenger.data.name && passenger.data.surname
            ? `${passenger.data.name} ${passenger.data.surname}`
            : `${this.TranslateService.instant(passenger.name.name)} ${passenger.name.pasNumber}`;
    };

    filterLargeFamilyTypes (event: any, index: number): void {
        const query = event.query.toLowerCase();
        const allTypes = this.passengersData.securityInfo.passengerInfo[index]?.largeFamilyTypes?.values || [];
        this.filteredLargeFamilyTypes =this.IbBookingPassengerFormUtilsService.filterStringArray(query, allTypes);
    }

    filterCommunityCodes (event: any, index: number): void {
        const query = event.query.toLowerCase();
        const allCommunityCodes = this.passengersData.securityInfo.passengerInfo[index]?.requiredFields['COMMUNITY_CODE']?.values || [];
        this.filteredCommunityCodes = this.IbBookingPassengerFormUtilsService.filterByProperty(query, allCommunityCodes, 'description');
    }

    filterCompanies (event: any, index: number): void {
        const query = event.query.toLowerCase();
        const allCompanies = this.passengersData.companiesList || [];
        this.filteredCompanies[index] = this.IbBookingPassengerFormUtilsService.filterByProperty(query, allCompanies, 'airlineName');
    }

    filterBusinessCodeTypes (event: any, index: number): void {
        const query = event.query.toLowerCase();
        const allBusinessCodeTypes = this.passengersData.businessCodeType || [];
        this.filteredBusinessCodeTypes[index] = this.IbBookingPassengerFormUtilsService.filterByProperty(query, allBusinessCodeTypes, 'name');
    }

    clearCodeNumber () {
        if (this.previousCompanySelection !== this.passengerForm.get([`company_${this.index}`]).value?.iataCompanyCode) {
            this.previousCompanySelection = this.passengerForm.get([`company_${this.index}`]).value?.iataCompanyCode;
            this.passengerForm.patchValue({
                [`number_card_${this.index}`]: ''
            });
        }
    }
    
 
    updateCardValidators (index: number): void {
        const companyCode = this.getCompanyCode(index);
        const control = this.passengerForm.get(`number_card_${index}`);

        this.setValidatorsForControl(control, companyCode);
        this.clearCodeNumber();
        control?.updateValueAndValidity();
    }

    private getCompanyCode (index: number): string | undefined {
        return this.passengerForm.get([`company_${index}`]).value?.iataCompanyCode;
    }

    private setValidatorsForControl (control: any, companyCode: string | undefined): void {
        if (companyCode === 'IB') {
            this.luhnValidator = new IbBookingLuhnValidator();
            const validators = [Validators.required, Validators.maxLength(this.MAX_LENGTH_IBERIA_CARD),
                Validators.pattern(BookingAppConstants.bookingPatterns.CARD_NUMBER_PATTERN), this.luhnValidator];
            control?.setValidators(validators);
        } else if (companyCode === 'AA') {
            control?.setValidators([
                Validators.required,
                Validators.maxLength(this.MAX_LENGTH_IBERIA_CARD),
                Validators.pattern(BookingAppConstants.bookingPatterns.AA_CARD_PATTERN)
            ]);
        } else {
            control?.setValidators([
                Validators.required,
                Validators.maxLength(BookingAppConstants.FIELD_LENGTH.MAX_LENGTH_OTHER_FREQUENTFLYER_CARD)
            ]);
        }
    }

    updateLargeFamilyCodePattern (index: number): void {
        this.checkAndCleanServiceError('largeFamilyNumber_', index, 'largeFamilyError', 'code');
        
        this.passengersData.securityInfo.passengerInfo[index].requiredFields.COMMUNITY_CODE.values.forEach((community)=>{
            if(community.code === this.passengerForm.get([`communityCode_${this.index}`]).value.code && community.code !== '070407'){
                this.passengerForm.get([`largeFamilyNumber_${this.index}`, 'communityCodePattern']).setValue(BookingAppConstants.PASSENGER_FORM_RESIDENCE[community.code].pattern);
            } else if(community.code === this.passengerForm.get([`communityCode_${this.index}`]).value.code && community.code === '070407') {
                const patterns = BookingAppConstants.PASSENGER_FORM_RESIDENCE[community.code];
                const group = this.passengerForm.get(`largeFamilyNumber_${this.index}`);

                ['firstPattern', 'secondPattern', 'thirdPattern', 'fourthPattern'].forEach(key => {
                    group.get(key).setValue(patterns[key]);
                });

            }
        });
        
        this.passengerForm.get(`largeFamilyNumber_${this.index}`)?.get('code')?.updateValueAndValidity();
    }

    private applySpecialCommunityCodePatterns (): void {
        const community = this.passengerForm.get(`communityCode_${this.index}`)?.value;
        if (community?.code === '070407') this.updateLargeFamilyCodePattern(this.index);
    }

    isLargeFamilyCodeAvailable (idPassenger) {
        this.checkAndCleanServiceError('largeFamilyNumber_', idPassenger, 'largeFamilyError', 'code');
        this.checkLargeFamilyChanges();
    }

    onLargeFamilyTypeSelect (event: any, index: number): void {
        this.passengerForm.get([`largeFamilyType_${index}`]).setValue(event);
    }

    updatePersonInCharge (index:number, selected?) {
        let passengerIndex = 0;

        for (passengerIndex = 0; passengerIndex < this.passengersData.securityInfo.passengerInfo.length; passengerIndex++) {
            if (this.passengerForm.get([`personInCharge_${this.index}`])?.value?.id === this.passengersData.securityInfo.passengerInfo[passengerIndex].id) {
                this.passengersData.securityInfo.passengerInfo[passengerIndex].isSelected = true;
            } else {
                if (this.passengersData.securityInfo.passengerInfo[index].data.personInCharge && (this.passengersData.securityInfo.passengerInfo[passengerIndex].id === this.passengersData.securityInfo.passengerInfo[index].data.personInCharge.id)) {
                    this.passengersData.securityInfo.passengerInfo[passengerIndex].isSelected = false;
                }
            }
        }
        this.passengersData.securityInfo.passengerInfo[index].data.personInCharge = this.passengerForm.get([`personInCharge_${this.index}`]).value;
        this.checkCanBeInCharge(this.passengersData.securityInfo.passengerInfo[index].id, selected);
    }

    onHide = () => {
        this.renderer.removeClass(this.dropdownIcon, 'rotate');
    };

    styleSelectLabelOrError (form: any, index: number, isError: boolean): boolean {
        if (!(form instanceof FormGroup)) {
            return false;
        }

        const controlName = `personInCharge_${index}`;
        const control = form.get(controlName);

        if (!control) {
            return false; 
        }

        if (isError) {
            return control.invalid && (control.touched || control.dirty);
        } else {
            const value = control.value;
            return value !== null && value !== '';
        }
    }

    checkPassengers (freqPassengers) {
        const beneficiaries = freqPassengers?.beneficiaries;
        if (Array.isArray(beneficiaries) && beneficiaries.length > 0) {
            const passengersMap = freqPassengers?.beneficiaries.reduce((acc, current) => {
                const typeArray = acc.get(current.type) ?? [];
                if (current.type === 'DEFAULT' || (!current.isSelected)) {
                    typeArray.push(current);
                }
                acc.set(current.type, typeArray);
                return acc;

            }, new Map());
            for (const passInfo of this.passengersData.securityInfo.passengerInfo) {
                const arrayAux = [...passengersMap.get('DEFAULT'), ...passengersMap.get(passInfo.type) ?? []];
                passInfo.frequentlyPassengers = JSON.parse(JSON.stringify(arrayAux));
            }
            this.showFrequentlyPassengers = Array.isArray(passengersMap.get(this.passengersData.securityInfo.passengerInfo[this.index].type));
        } else {
            this.showFrequentlyPassengers = false;
        }
    }

    selectMainPassenger () {
        let passenger, isFlightOfTheHouse, showWarningModal;
        const userMustFlyFromFare = this.BookingUtilService.checkUserMustFlyFromFare(this.farePartner);
        if (this.passengerForm.get('iTravelCheck').value) {
            passenger = this.passengersData.securityInfo.passengerInfoLogged;
            passenger.type = this.BookingUtilService.getTypeOfPassenger(this.passengersData.securityInfo.passengerInfoLogged.birthDate);
            this.selectPassenger(passenger, 0);
            this.checkItravelStatus.emit(this.passengerForm.get('iTravelCheck').value);
        } else {
            passenger = {
                name: this.passengersData.securityInfo.isLogged === this.LOGIN_ONB ? 'IBAIRP_PASSENGER_FORM_ON_BUSINESS_EMPLOYESS_BLANK' : 'CKI_COMBO_FREQUENTLY_PASSENGERS_BLANK',
                type: BookingAppConstants.passengerTypes.Default
            };
            isFlightOfTheHouse = this.CommonsSessionStorageService.get('flightOfTheHouse');
            showWarningModal = this.suitableForPartnerDiscount && userMustFlyFromFare === true;
            if (isFlightOfTheHouse && showWarningModal) {
                this.$rootScope.$broadcast('closeCollapseHeader');
                this.selectPassenger(passenger, 0);
                this.BookingModalService.showITravelWarningModal({}).result.then(this.unCheckITravel, this.checkITravel);
            } else {
                this.selectPassenger(passenger, 0);
                this.checkItravelStatus.emit(this.passengerForm.get('iTravelCheck').value);
            }
        }
    }

    checkTypesPassengers () {
        this.passengersData.securityInfo.passengerInfo.find((passenger) => {
            if (passenger.type === BookingAppConstants.passengerTypes.infant) {
                this.infoTypesPassenger.infants.push(passenger);
            } else if (passenger.type !== BookingAppConstants.passengerTypes.infant && passenger.canBeInCharge) {
                this.infoTypesPassenger.canBeInCharge.push(passenger);
            }
        });
    }

    checkInfantCaregiver (passengerInfo, infantIndex) {
        let infant, adults;
        if (passengerInfo) {
            infant = passengerInfo.filter((passInfo) => passInfo.type === BookingAppConstants.passengerTypes.infant);
            adults = passengerInfo.filter((passInfo) => passInfo.canBeInCharge === true);


            if (infant.length === 1 && adults.length === 1) {
                if (adults && adults[0].canBeInCharge) {
                    this.passengerForm.get([`personInCharge_${this.index}`]).setValue({
                        ...adults[0],
                        displayName: this.getAdultDisplayName(adults[0])
                
                    });
                    this.updatePersonInCharge(infantIndex);
                }
            }
        }
    }

    checkCanBeInCharge (idInfant:string, selected) {
        let dataPersonInCharge = null;
        const idPersonInCharge = selected?.id ?? null;

        if (this.infoTypesPassenger.infants.length >= 2 && this.infoTypesPassenger.canBeInCharge.length >= 2) {
            dataPersonInCharge = this.getPersonInCharge(idPersonInCharge);
            this.setPersonInCharge(idInfant, dataPersonInCharge, idPersonInCharge);
        }
    }

    private getPersonInCharge = (index: string) => {
        return this.passengersData.securityInfo.passengerInfo.find((passenger) => {
            return passenger.id === index;
        });
    };

    private setPersonInCharge = (idInfant: string, dataPersonInCharge, idPersonInCharge:string) => {
        this.passengersData.securityInfo.passengerInfo.find((passenger, index) => {
            if(passenger.type === BookingAppConstants.passengerTypes.infant) {
                if(passenger.id === idInfant) {
                    dataPersonInCharge.isSelected = true;
                    passenger.data.personInCharge = dataPersonInCharge;
                } else {
                    this.resetPersonInChargeValue(passenger, idPersonInCharge, index);
                }
            } else {
                this.checkIfSelectPersonInCharge(passenger, idPersonInCharge, dataPersonInCharge);
                
            }
        });
    };

    private resetPersonInChargeValue = (passenger, idPersonInCharge, index) => {
        passenger.data?.personInCharge?.id === idPersonInCharge && this.resetPersonInCharge.emit(index);
    };

    private checkIfSelectPersonInCharge = (passenger, idPersonInCharge:string, dataPersonInCharge) => {
        if(passenger.id === idPersonInCharge) {
            dataPersonInCharge.isSelected = true;
        }
    };

    checkITravel = () => {
        this.passengerForm.get('iTravelCheck').setValue(true);
        this.selectMainPassenger();
    };

    unCheckITravel = () => {
        this.passengerForm.get('iTravelCheck').setValue(false);
        this.checkItravelStatus.emit(this.passengerForm.get('iTravelCheck').value);
    };

    checkBirthDateValidity () {
        let isBirthDateValid = !this.showInput(this.passengersData.securityInfo.passengerInfo[this.index].requiredFields, 'BIRTH_DATE');
        this.setBirthDateFormValid(isBirthDateValid);
    }

    onMandatoryDocSelect (event: any, index: number): void {
        const selectedDoc = event;
        this.passengerForm.get(`mandatoryDoc_${index}`)?.setValue(selectedDoc);
        this.lastSelectedMandatoryDoc = selectedDoc;
        this.mandatoryDocCleaner = this.IbBookingPassengerFormUtilsService.getMandatoryDocCleaner(selectedDoc?.code);
        this.checkMandatoryDoc();
    }

    onOptionalDocSelect (event: any, index: number): void {
        this.optionalDocCleaner[index] = this.IbBookingPassengerFormUtilsService.getMandatoryDocCleaner(event?.code);
    }

    getMaxLengthSurname (): number {
        return this.passengersData.securityInfo.isResident 
            ? BookingAppConstants.FIELD_LENGTH.MAX_LENGTH_FIRST_SURNAME 
            : BookingAppConstants.FIELD_LENGTH.MAX_LENGTH_SURNAME;
    }
    
    getMaxLengthMandatoryDocNumber (mandatoryDocCode: string): number {
        return this.IbBookingPassengerFormUtilsService.getMaxLengthMandatoryDocNumber(mandatoryDocCode);
    }
    
    ngOnChanges (changes: SimpleChanges): void {
        this.activate();
        if (changes.passengersData) {
            this.initializeOptionalDocsArray();
            const personInCharge = this.passengersData.securityInfo.passengerInfo[this.index].data.personInCharge;
            if (!personInCharge) {
                this.passengerForm.get(`personInCharge_${this.index}`).setValue('');
            }
        }
        if(changes.localStoragePassengersData?.currentValue){
            this.setFormValuesFromStorage();
            this.applySpecialCommunityCodePatterns();
        }
        if(changes.fillResidentChecked){
            this.setCheckedResidentInfo(changes.fillResidentChecked);
            this.applySpecialCommunityCodePatterns();

        }
        if(changes.fillLargeFamilyChecked){
            this.setCheckedLargeFamilyInfo(changes.fillLargeFamilyChecked);
            this.applySpecialCommunityCodePatterns();
        }
    }
    private initializeOptionalDocsArray (): void {
        const passenger = this.passengersData.securityInfo.passengerInfo[this.index];
        this.optionalDocsArray = this.IbBookingPassengerFormUtilsService.getOptionalDocsArray(passenger);
    }
    
    private setCheckedResidentInfo = (residentInfo: SimpleChange) => {
        const {index, isChecked} = residentInfo.currentValue;
        const residentDiscountInfo = this.passengersData.securityInfo.passengerInfo[index]?.data?.residentDiscountInfo;
        const selectedMunicipality = this.getPreselectedFieldValue('MUNICIPALITY_CODE', residentDiscountInfo?.municipalityCode);
        
        this.passengerForm.get('check_fill_resident_number').setValue(isChecked, { emitEvent: false });
        
        if (!isChecked) return;
        
        this.passengerForm.get([`municipalityCode_${this.index}`]).setValue(selectedMunicipality, { emitEvent: false });
        
        if (this.index === index) {
            this.showUploadedInfoResident = !!selectedMunicipality?.description;
        }
    };
    
    private setCheckedLargeFamilyInfo = (largeFamilyInfo:SimpleChange) =>{
        const {index, isChecked} = largeFamilyInfo.currentValue;
        const largeFamilyDiscountInfo = this.passengersData.securityInfo.passengerInfo[index]?.data?.largeFamilyDiscountInfo;
        this.passengerForm.get('check_fill_large_family').setValue(isChecked);
        this.checkAndCleanServiceError('largeFamilyNumber_', this.index, 'largeFamilyError', 'code');
        if(largeFamilyDiscountInfo && isChecked){
            this.passengerForm.get([`communityCode_${this.index}`]).setValue(largeFamilyDiscountInfo.communityCode, { emitEvent: false });
            this.passengerForm.get(`largeFamilyNumber_${this.index}`).get('code').setValue(largeFamilyDiscountInfo.largeFamilyCertificateNumber, { emitEvent: false });
            this.passengerForm.get(`largeFamilyNumber_${this.index}`).get('communityCodePattern').setValue(largeFamilyDiscountInfo.communityCodePattern ?? '', { emitEvent: false });
            this.updateLargeFamilyCodePattern(this.index);
        }
    };

    private getPreselectedFieldValue = (fieldKey: string, code: string) => {
        return this.PassengerFormUtilsService.getPreselectedFieldValue(this.passengersData.securityInfo.passengerInfo[this.index], fieldKey, code);
    };

    private setUpFormValueChanges (): void {
        this.passengerForm.valueChanges
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe(()=> {
                const areFormsValid = this.passengerForm.valid && this.isSpecialNeedsFormValid;
                this.formValidity.emit({isValid: areFormsValid, passForm: this.passengerForm, index: this.index});
            });
    }

    
    private setFormValuesFromStorage = () =>{
        this.ManageStoredPassengerFormDataService.setFormValuesFromStorage(
            {
                passengerInfo: this.passengersData.securityInfo.passengerInfo[this.index],
                passengerIndex: this.index,
                formControl: this.passengerForm,
                selectPassenger: this.selectPassenger.bind(this)
            });
    };

    private setValuesValidators = () =>{
        this.showMunicipalityCode = this.IbBookingPassengerFormValidationService.setConditionalValidators(Boolean(this.passengersData.securityInfo.passengerInfo[this.index].requiredFields['MUNICIPALITY_CODE']), this.passengerForm.get(['municipalityCode_' + this.index]), [Validators.required]);
        this.showResidentNumber = this.IbBookingPassengerFormValidationService.setConditionalValidators(this.passengersData.securityInfo.passengerInfo[this.index]?.mandatoryDocs.length > 0 && this.showInput(this.passengerForm.get('mandatoryDoc_' + this.index).value?.showFields, 'RESIDENT_NUMBER'), 
            this.passengerForm.get(`residentNumber_${this.index}`), [
                Validators.required,
                Validators.maxLength(this.MAX_LENGTH_MANDATORY_DOC),
                Validators.pattern(BookingAppConstants.bookingPatterns.DOCS_PATTERN)
            ]);
        this.showLargeFamilyType = this.IbBookingPassengerFormValidationService.setConditionalValidators(Boolean(this.passengersData.securityInfo.passengerInfo[this.index]?.data?.largeFamilyType), this.passengerForm.get(`largeFamilyType_${this.index}`), [Validators.required]);
        this.showCommunityCode = this.IbBookingPassengerFormValidationService.setConditionalValidators(Boolean(this.passengersData.securityInfo.passengerInfo[this.index]?.requiredFields['COMMUNITY_CODE']), this.passengerForm.get(`communityCode_${this.index}`), [Validators.required]);
        this.showPassengersValidators();
    };
        
    private showPassengersValidators = () =>{ 
        this.showPersonInCharge = this.IbBookingPassengerFormValidationService.setConditionalValidators(this.passengersData.securityInfo.passengerInfo[this.index].type==='INFANT', this.passengerForm.get(`personInCharge_${this.index}`), [Validators.required]);
    };

    checkFfFormValues = () =>{
        let showFfValues:boolean;
        if (this.passengerForm.get([`check_ff_${this.index}`]).value === true){
            this.passengerForm.get([`company_${this.index}`]).setValidators([
                Validators.required
            ]);

            const companyCode = this.getCompanyCode(this.index);
            this.setValidatorsForControl(this.passengerForm.get([`number_card_${this.index}`]), companyCode);
            showFfValues = true;
        } else {
            this.passengerForm.get([`company_${this.index}`]).setValidators([]);
            this.passengerForm.get([`number_card_${this.index}`]).setValidators([]); 
            showFfValues = false;
        }
        this.passengerForm.get([`company_${this.index}`]).updateValueAndValidity();
        this.passengerForm.get([`number_card_${this.index}`]).updateValueAndValidity(); 
        return showFfValues;
    };

    getDniNumberValidators (code?: string): ValidatorFn[] {
        if (!this.IbBookingPassengerFormUtilsService.isDniCode(code)) return [];
        this.dniValidator  = new IbBookingDniValidator();
        return [this.dniValidator.validate.bind(this.dniValidator) as ValidatorFn];
    }

    checkMandatoryDoc = () => {
        const mandatoryDocCode = this.passengersData.securityInfo.passengerInfo[this.index]?.data?.mandatoryDoc?.code;
        const maxLengthMandatoryDocNumber = this.getMaxLengthMandatoryDocNumber(mandatoryDocCode);
        const mandatoryDocPattern = this.IbBookingPassengerFormValidationService.getMandatoryDocPattern(mandatoryDocCode); 
        let showMandatoryDoc:boolean;
        if(this.passengersData.securityInfo.passengerInfo[this.index]?.mandatoryDocs.length > 0){
            this.passengerForm.get(`mandatoryDoc_${this.index}`).get('number').setValidators(this.passengerForm.get(`mandatoryDoc_${this.index}`).get('code').value !== 'MR' ? [
                Validators.required,
                Validators.maxLength(maxLengthMandatoryDocNumber),
                Validators.pattern(mandatoryDocPattern),
                this.customValidator(this.passengersData.securityInfo.passengerInfo[this.index].serviceErrors.some(error => error.typeError === 'idInfoError'), 'invalidDocumentError'),
                this.customValidator(this.passengerForm.get(`mandatoryDoc_${this.index}`).get('number').errors?.docDuplicity, 'docDuplicity'),
                ...this.getDniNumberValidators(mandatoryDocCode)
            ]:[]);
            this.passengerForm.get(`mandatoryDoc_${this.index}`).get('code').setValidators([
                Validators.required,
                Validators.minLength(2)
            ]);
            showMandatoryDoc = true;
        } else {
            this.passengerForm.get(`mandatoryDoc_${this.index}`).get('number').setValidators([]);
            this.passengerForm.get(`mandatoryDoc_${this.index}`).get('code').setValidators([]);
            showMandatoryDoc = false;
        }
        this.passengerForm.get(`mandatoryDoc_${this.index}`).get('number').updateValueAndValidity();
        this.passengerForm.get(`mandatoryDoc_${this.index}`).get('code').updateValueAndValidity();
        return showMandatoryDoc;
    };

    onMandatoryDocNumberBlur (index: number): void {
        const numberCtrl = this.passengerForm.get(`mandatoryDoc_${index}.number`);
        numberCtrl?.markAsTouched({ onlySelf: true });
        numberCtrl?.updateValueAndValidity({ onlySelf: true });
    }

    onMandatoryDocBlur (index: number, autocomplete: AutoComplete): void {
        const mandatoryDocGroup = this.passengerForm.get(`mandatoryDoc_${index}`);
        if (!mandatoryDocGroup) return;

        const currentInputValue = autocomplete.inputEL.nativeElement.value.trim();
        const sourceArray = this.passengersData.securityInfo.passengerInfo[index].mandatoryDocs;
        const validMatch = sourceArray.find(
            doc => doc.description.toLowerCase() === currentInputValue.toLowerCase()
        );

        if (validMatch) {
            mandatoryDocGroup.patchValue(validMatch);
            this.lastSelectedMandatoryDoc = validMatch;
        } else {
            if (this.lastSelectedMandatoryDoc) {
                mandatoryDocGroup.patchValue(this.lastSelectedMandatoryDoc);
            } else {
                mandatoryDocGroup.reset({ code: '', description: '', number: '', showFields: {} });
            }
        }
        this.checkMandatoryDoc();
    }

    public hasOptionalDocs = (): boolean => {
        return this.optionalDocsArray && this.optionalDocsArray.length > 0;
    };

    public showOptionalDocsSection = (): boolean => {
        const isCheckboxChecked = !!this.passengerForm.get(`check_optional_docs_${this.index}`)?.value;
        const hasDocsToShow = this.optionalDocsArray.length > 0;

        return isCheckboxChecked && hasDocsToShow;
    };

    public showOptionalNumberInput = (): boolean => {
        const selectedDocObject = this.passengerForm.get(`optionalDocuments_${this.index}.selectedDoc`)?.value;
        return this.showInput(selectedDocObject?.showFields, 'NUM_DOC');
    };

    private setupOptionalDocsCheckboxListener = (): void => {
        const optionalCheckControl = this.passengerForm.get(`check_optional_docs_${this.index}`);

        if (optionalCheckControl) {
            optionalCheckControl.valueChanges.pipe(
                takeUntil(this.destroy$)
            ).subscribe(isChecked => {
                if (!isChecked) {
                    this.passengerForm.get(`optionalDocuments_${this.index}`)?.reset({
                        selectedDoc: null,
                        number: ''
                    });
                }
            });
        }
    };

    onDropdownShow (autocomplete: AutoComplete) {
        const dropdownButton = autocomplete.el.nativeElement.querySelector('.p-autocomplete-dropdown');
        if (dropdownButton) {
            this.renderer.addClass(dropdownButton, 'rotate');
        }
        if (autocomplete.suggestions && autocomplete.suggestions.length > 0) {
            autocomplete.highlightOption = autocomplete.suggestions[0];
        }
    }

    onDropdownHide (autocomplete: AutoComplete) {
        const dropdownButton = autocomplete.el.nativeElement.querySelector('.p-autocomplete-dropdown');
        if (dropdownButton) {
            this.renderer.removeClass(dropdownButton, 'rotate');
        }
    }
    checkShowLargeFamilyNumber = () =>{
        const showLargeFamilyNumber = this.IbBookingPassengerFormValidationService.setConditionalValidators(this.passengersData.securityInfo.passengerInfo[this.index]?.requiredFields['LARGE_FAMILY_NUMBER'] && this.passengerForm.get(`communityCode_${this.index}`).value, this.passengerForm.get(`largeFamilyNumber_${this.index}`).get('code'), [
            Validators.required,
            Validators.pattern(BookingAppConstants.bookingPatterns.REDRESS_NUMBER_PATTERN),
            this.customValidator(this.passengersData.securityInfo.passengerInfo[this.index].serviceErrors.some(error => error.typeError === 'largeFamilyError'), 'largeFamilyCommunityError')
        ]);
        return showLargeFamilyNumber;
    };

    customValidator (isError: boolean, errorKey:string): ValidatorFn {
        return this.IbBookingPassengerFormValidationService.createCustomValidator(isError, errorKey);
    }

    toogleResidentCheck = () =>{
        this.fillResident.emit({isChecked:!!this.passengerForm.get('check_fill_resident_number').value, index:this.index});
    };

    toogleLargeFamilyCheck = () =>{
        this.fillLargeFamily.emit({isChecked:!!this.passengerForm.get('check_fill_large_family').value, index:this.index});
    };

    checkLargeFamilyChanges = () => {
        if (!this.passengerForm.get('check_fill_large_family').value) return;
        
        const communityValue = this.passengerForm.get(`communityCode_${this.index}`).value;
        const largeFamilyNumber = this.passengerForm.get(`largeFamilyNumber_${this.index}`)?.get('code')?.value;
        
        this.showUploadedInfoLargeFam = !!(communityValue?.description && largeFamilyNumber?.trim());
        this.toogleLargeFamilyCheck();
    };

    checkResidentChanges = (): void => {
        if (!this.passengerForm.get('check_fill_resident_number').value) return;

        const municipalityValue = this.passengerForm.get(`municipalityCode_${this.index}`).value;
        const hasValidMunicipality = !!municipalityValue?.description;

        this.passengersData.securityInfo.passengerInfo.forEach(passenger => {
            passenger.data.residentDiscountInfo = hasValidMunicipality 
                ? { municipalityCode: municipalityValue.code } 
                : null;
        });

        this.showUploadedInfoResident = hasValidMunicipality;
        this.toogleResidentCheck();
    };
    
    closeUploadLargeFamInfoBanner = () => this.showUploadedInfoLargeFam = false;
    closeUploadResidentInfoBanner = () => this.showUploadedInfoResident = false;
}    

downgradeToAJSComponent('ibBookingPassengerForm', {
    component: IbBookingPassengerFormComponent,
    inputs: ['passengersData', 'index', 'submitState', 'suitableForPartnerDiscount', 'farePartner', 'localStoragePassengersData'],
    outputs:['formValidity', 'checkItravelStatus', 'resetPersonInCharge', 'birthDateFormValidChanged', 'fillResident', 'fillLargeFamily']
   
}, 'ib-booking-passenger-info-module');
