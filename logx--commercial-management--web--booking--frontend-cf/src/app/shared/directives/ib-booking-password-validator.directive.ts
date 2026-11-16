import { Directive, forwardRef } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';

@Directive({
    selector: '[ibBookingPasswordValidator]',
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: forwardRef(() => IbBookingPasswordValidatorDirective),
        multi: true
    }]
})
export class IbBookingPasswordValidatorDirective implements Validator {

    validate (control: AbstractControl): ValidationErrors | null {
        const value = control.value;
        if (!value) {
            return null;
        }

        let passed = this.validatePattern(value);

        const valid = passed >= 3 || value === '';

        return valid ? null : { pattern: true };
    }

    private validatePattern (value: string): number {
        let passed = 0;

        if (BookingAppConstants.bookingPatterns.PASSWORD_PATTERN.test(value)) {
            if (BookingAppConstants.bookingPatterns.PASSWORD_PATTERN_MAYUS.test(value)) {
                ++passed;
            }
            if (BookingAppConstants.bookingPatterns.PASSWORD_PATTERN_MINS.test(value)) {
                ++passed;
            }
            if (BookingAppConstants.bookingPatterns.PASSWORD_PATTERN_NUM.test(value)) {
                ++passed;
            }
            if (BookingAppConstants.bookingPatterns.PASSWORD_PATTERN_SPECIAL.test(value)) {
                ++passed;
            }
        }

        return passed;
    }

}
