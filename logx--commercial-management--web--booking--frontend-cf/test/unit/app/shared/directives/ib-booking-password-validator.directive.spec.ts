import { FormControl } from '@angular/forms';
import { IbBookingPasswordValidatorDirective } from '@src/app/shared/directives/ib-booking-password-validator.directive';


const mockPattern = { pattern: true }
describe('IbBookingPasswordValidatorDirective', () => {
    let directive: IbBookingPasswordValidatorDirective;

    beforeEach(() => {
        directive = new IbBookingPasswordValidatorDirective();
    });

    it('should create an instance', () => {
        expect(directive).toBeTruthy();
    });

    it('should return null if control value is empty', () => {
        const control = new FormControl('');

        const result = directive.validate(control);

        expect(result).toBeNull();
    });

    it('should return null if passed >= 3', () => {
        const control = new FormControl('Password1!');

        const result = directive.validate(control);

        expect(result).toBeNull();
    });

    it('should return an error if passed < 3', () => {
        const control = new FormControl('Ab1');

        const result = directive.validate(control);

        expect(result).toEqual(mockPattern);
    });
});
