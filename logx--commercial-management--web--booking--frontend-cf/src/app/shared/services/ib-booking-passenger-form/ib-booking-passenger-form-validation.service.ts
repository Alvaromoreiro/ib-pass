import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
@Injectable({
    providedIn: 'root'
})
export class IbBookingPassengerFormValidationService {

    getMandatoryDocPattern (mandatoryDocCode) {
        switch (mandatoryDocCode) {
                case 'RUC':
                    return BookingAppConstants.bookingPatterns.RUC_DOCUMENT;
                case 'DN':
                    return BookingAppConstants.bookingPatterns.DNI_DOCUMENT;
                case 'NI':
                    return BookingAppConstants.bookingPatterns.NI_PATTERN;
                default:
                    return BookingAppConstants.bookingPatterns.DOCS_PATTERN;
        }
    }

    createCustomValidator (isError: boolean, errorKey: string): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            return isError ? { [errorKey]: true } : null;
        };
    }

    setConditionalValidators (condition: boolean, control: AbstractControl, validators: ValidatorFn[]): boolean {
        if (condition) {
            control.setValidators(validators);
        } else {
            control.setValidators([]);
        }
        control.updateValueAndValidity();
        return condition;
    }

    createModSevenValidator (): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            if (value == null || value === '') {
                return null;
            }
            if (this.isValidModSeven(value)) {
                return null;
            }
            return { modseven: true };
        };
    }

    isValidModSeven (number: string): boolean {
        if (number.length === 7 && number.charAt(0) === 'C') {
            return true;
        } else if (number.length === 10) {
            let sum = 0;
            for (let i = 2; i < number.length - 1; i++) {
                const digit = parseInt(number.charAt(i), 10);
                if (isNaN(digit)) { return false; }
                sum += digit;
            }
            const lastDigit = parseInt(number.charAt(number.length - 1), 10);
            if (isNaN(lastDigit)) { return false; }
            return sum % 7 === lastDigit;
        }
        return false;
    }
}