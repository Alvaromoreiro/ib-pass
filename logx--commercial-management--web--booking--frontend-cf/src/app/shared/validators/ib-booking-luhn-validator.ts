import { AbstractControl, ValidationErrors, Validator } from '@angular/forms';

export class IbBookingLuhnValidator implements Validator {

    validate (control: AbstractControl): ValidationErrors | null {

        const value = control.value;
        if (!value) return null;

        const str = String(value).replace(/\s+/g, '');
        const valid = this.luhnCheck(str);

        return valid ? null : { luhn: true };
    }

    private luhnCheck (input: string): boolean {
        if (!input || /[^0-9]/.test(input)) {
            return false;
        }

        const arr = [0, 2, 4, 6, 8, 1, 3, 5, 7, 9];
        let len = input.length;
        let bit = 1;
        let sum = 0;

        while (len) {
            const val = parseInt(input.charAt(--len), 10);
            sum += (bit ^= 1) ? arr[val] : val;
        }

        return sum && (sum % 10 === 0);
    }

}