import { AbstractControl, ValidationErrors, Validator } from '@angular/forms';

export class IbBookingDniValidator implements Validator {
    validate (control: AbstractControl): ValidationErrors | null {
        const raw = control.value;
        if (raw == null || raw === '') return null;
        const value = String(raw).toUpperCase().replace(/[\s.-]/g, '');
        const m = value.match(/^(\d{8})([A-Z])$/);
        if (!m) return null;
        const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
        const expected = letters[parseInt(m[1], 10) % 23];
        return expected === m[2] ? null : { invalidDocumentError: true };
    }

    static calculateLetter (n: number | string): string {
        const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
        const num = typeof n === 'string' ? parseInt(n, 10) : n;
        return letters[num % 23];
    }

    static isValid (dni: string): boolean {
        if (!dni) return false;
        const v = dni.toUpperCase().replace(/[\s.-]/g, '');
        const m = v.match(/^(\d{8})([A-Z])$/);
        if (!m) return false;
        return IbBookingDniValidator.calculateLetter(m[1]) === m[2];
    }
}