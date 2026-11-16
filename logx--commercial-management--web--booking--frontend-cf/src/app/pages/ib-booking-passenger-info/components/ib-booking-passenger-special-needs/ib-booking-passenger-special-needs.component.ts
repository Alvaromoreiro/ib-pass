import { Component, Input, OnDestroy, ViewChild,  OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { FormBuilder, FormGroup, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Subject, takeUntil, debounceTime  } from 'rxjs';
import {OverlayPanel} from 'primeng/overlaypanel';

@Component({
    selector: 'ib-booking-passenger-special-needs',
    templateUrl: './ib-booking-passenger-special-needs.component.html',
    styleUrls: ['./ib-booking-passenger-special-needs.component.scss']
})
export class IbBookingPassengerSpecialNeedsComponent implements OnChanges, OnDestroy {
    @Input() passengersFormData;
    @Input() index: number;
    @Input() submitState = false;
    @Input() relatedContent;
    @ViewChild('overlayPanel') overlayPanel: OverlayPanel;
    @Output() specialNeedsChange = new EventEmitter<{ values: any, isValid: boolean }>();

    public specialNeedsForm: FormGroup;
    public wheelchairOptions: any[] = [];
    public popoverText: string = '';

    public phonesList: any;
    public phone: string;
    public previousWheelchairValue: any;
    private destroy$ = new Subject<void>();

    constructor (
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private fb: FormBuilder

    ){
        this.phonesList = this.CommonsSessionStorageService.get('phonesList') || null;
    }

    private activate = (): void => {
        this.createForm();
        this.setupValueChanges();
        this.getPhone();
    };

    ngOnChanges (changes: SimpleChanges): void {
        this.activate();
        if (changes['passengersFormData'] && this.specialNeedsForm) {
            this.updateFormValues();
        }
    }

    ngOnDestroy (): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private createForm (): void {
        this.specialNeedsForm = this.fb.group(
            this.getSpecialNeedsFormControls(this.index, this.passengersFormData), { 
                validators: [this.createWheelchairValidator(this.index),  this.createSpecialNeedsValidator(this.index) ]
            });
    }

    private getSpecialNeedsFormControls (index: number, data: any): { [key: string]: any } {
        const specialNeeds = data?.specialNeeds || {};
        return {
            [`check_enable_${index}`]: [specialNeeds.isEnable ?? false],
            [`check_vision_${index}`]: [specialNeeds.specialVision ?? false],
            [`check_hearing_${index}`]: [specialNeeds.specialHearing ?? false],
            [`check_intellDisability_${index}`]: [specialNeeds.specialIntellDisability ?? false],
            [`check_guide_dog_${index}`]: [specialNeeds.specialGuideDog ?? false],
            [`check_chair_${index}`]: [specialNeeds.specialWheelchair ?? false],
            specialWheelchair: [specialNeeds.specialWheelchair ?? false],
            specialWheelchairValue: [specialNeeds.specialWheelchairValue || null]
        };
    }

    private updateFormValues (): void {
        const initialValues = {
            isEnable: false,
            specialVision: false,
            specialHearing: false,
            specialIntellDisability: false,
            specialGuideDog: false,
            specialWheelchair: false,
            specialWheelchairValue: null
        };

        const actualNeeds = this.passengersFormData?.specialNeeds;

        const formValues = { ...initialValues, ...actualNeeds };

        this.specialNeedsForm.patchValue(formValues, { emitEvent: false });
    }
 
    private setupValueChanges (): void {
        this.specialNeedsForm.valueChanges
            .pipe(
                takeUntil(this.destroy$),
                debounceTime(50) 
            )
            .subscribe(formValues => {
                const specialNeedsUpdate = {
                    values: formValues,
                    isValid: this.specialNeedsForm.valid
                };
                this.specialNeedsChange.emit(specialNeedsUpdate);
            });
    }
   
    public isEnabledSpecialNeed (specialCode) {
        const availableTypes = this.passengersFormData?.specialNeeds.availableTypes ?? [];
        return availableTypes.indexOf(specialCode) >= 0;
    }
    public isSomeSpecialNeedAvailable (){
        const availableTypes = this.passengersFormData?.specialNeeds?.availableTypes ?? [];
        return availableTypes.length > 0;
    }
    private getPhone (){
        if (this.phonesList && this.phonesList.RESERVAS) {
            this.phone = this.phonesList.RESERVAS.telephone;
        }  else {
            this.phone = '901 111 500';
        }
    }

    private createWheelchairValidator (index: number): ValidatorFn {
        return (group: AbstractControl): ValidationErrors | null => {
        
            const chairIsChecked = group.get(`check_chair_${index}`)?.value;
            const chairTypeIsSelected = group.get('specialWheelchairValue')?.value;

            if (chairIsChecked && !chairTypeIsSelected) {
                return { wheelChairValidation: true };
            }
        
            return null;
        };
    }

    private createSpecialNeedsValidator (index: number): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const group = control as FormGroup;
        
            const isEnableChecked = group.get(`check_enable_${index}`)?.value;
            const hasSpecificNeed = this.hasSpecificNeed(group, index);

            if (isEnableChecked && !hasSpecificNeed) {
                return { specialNeedRequired: true };
            }
        
            return null;
        };
    }

    hasSpecificNeed = (group: FormGroup, index:number) =>{
        const controls = [
            `check_vision_${index}`,
            `check_hearing_${index}`,
            `check_intellDisability_${index}`,
            `check_guide_dog_${index}`,
            `check_chair_${index}`
        ];
        return controls.some(control => group.get(control)?.value);
    };

    openPopover (event: Event, overlayPanel: OverlayPanel) {
        this.popoverText = this.relatedContent?.popoverText || 'IB_PASSENGER_SPE_NEEDS_POPOVER_CONTENT';
        overlayPanel.toggle(event);
        event.preventDefault();
    }

    closePopover (overlayPanel: OverlayPanel) {
        overlayPanel.hide();
    }

}
