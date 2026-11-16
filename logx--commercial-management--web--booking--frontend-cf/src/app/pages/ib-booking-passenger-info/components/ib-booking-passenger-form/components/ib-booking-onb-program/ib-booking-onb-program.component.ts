import { Component, Input } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { IbBookingPassengerFormValidationService } from '@src/app/shared/services/ib-booking-passenger-form/ib-booking-passenger-form-validation.service';

@Component({
    selector: 'ib-booking-onb-program',
    templateUrl: './ib-booking-onb-program.component.html'
})
export class IbBookingOnbProgramComponent {
    @Input() passengerForm: FormGroup;
    @Input() index: number;
    @Input() submitState: boolean = false;
    
    public digitLength: number;
    public maxLength: number;
    public pattern: string;
    public cleaner: string;
    
    constructor (
        private IbBookingPassengerFormValidationService: IbBookingPassengerFormValidationService
    ) {}

    checkOnBFormValues (): void {
        const checkControl = this.passengerForm.get([`check_obn_${this.index}`]);
        const cardControl = this.passengerForm.get([`ob_number_card_${this.index}`]);

        if (checkControl?.value === true) {
            this.passengerForm.patchValue({
                [`ob_number_card_${this.index}`]: 'OB',
                [`businessCodeType_${this.index}`]: {code:'OB'}
            });
            this.maxLength = 10;
            this.digitLength = 8;
            this.pattern = '^OB' + BookingAppConstants.bookingPatterns.ONBUSINESS_NUMBER_PATTERN + '{8}';
            this.cleaner = 'OB';
            cardControl?.setValidators([
                Validators.required,
                this.IbBookingPassengerFormValidationService.createModSevenValidator()
            ]);
        } else {
            cardControl?.setValidators([]);
        }
        cardControl?.updateValueAndValidity();
    }
}
