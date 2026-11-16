import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';
import { IbBookingPassengerFormValidationService } from '@src/app/shared/services/ib-booking-passenger-form/ib-booking-passenger-form-validation.service';

describe('IbBookingPassengerFormValidationService', () => {
    let service: IbBookingPassengerFormValidationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [IbBookingPassengerFormValidationService]
        });
        service = TestBed.inject(IbBookingPassengerFormValidationService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getMandatoryDocPattern', () => {
        it('should return RUC pattern when mandatoryDocCode is RUC', () => {
            expect(service.getMandatoryDocPattern('RUC')).toBe(BookingAppConstants.bookingPatterns.RUC_DOCUMENT);
        });

        it('should return DNI pattern when mandatoryDocCode is DN', () => {
            expect(service.getMandatoryDocPattern('DN')).toBe(BookingAppConstants.bookingPatterns.DNI_DOCUMENT);
        });

        it('should return NI pattern when mandatoryDocCode is NI', () => {
            expect(service.getMandatoryDocPattern('NI')).toBe(BookingAppConstants.bookingPatterns.NI_PATTERN);
        });

        it('should return DOCS pattern for any other mandatoryDocCode', () => {
            expect(service.getMandatoryDocPattern('OTHER')).toBe(BookingAppConstants.bookingPatterns.DOCS_PATTERN);
        });
    });

    describe('createCustomValidator', () => {
        it('should return validator function that returns error when isError is true', () => {
            const validator = service.createCustomValidator(true, 'testError');
            const control = new FormControl('test');
            expect(validator(control)).toEqual({ testError: true });
        });

        it('should return validator function that returns null when isError is false', () => {
            const validator = service.createCustomValidator(false, 'testError');
            const control = new FormControl('test');
            expect(validator(control)).toBeNull();
        });
    });

    describe('setConditionalValidators', () => {
        let control: FormControl;

        beforeEach(() => {
            control = new FormControl('');
        });

        it('should set validators when condition is true', () => {
            const validators = [() => null];
            const result = service.setConditionalValidators(true, control, validators);
            expect(result).toBe(true);
            expect(control.validator).toBeTruthy();
        });

        it('should clear validators when condition is false', () => {
            const validators = [() => null];
            const result = service.setConditionalValidators(false, control, validators);
            expect(result).toBe(false);
            expect(control.validator).toBeNull();
        });
    });

    describe('createModSevenValidator', () => {
        let control: FormControl;
        let validator: any;

        beforeEach(() => {
            control = new FormControl('');
            validator = service.createModSevenValidator();
        });

        it('should return null for empty value', () => {
            expect(validator(control)).toBeNull();
        });

        it('should return null for valid mod seven number', () => {
            control.setValue('1234567890');
            expect(validator(control)).toBeNull();
        });

        it('should return error for invalid mod seven number', () => {
            control.setValue('1234567891');
            expect(validator(control)).toEqual({ modseven: true });
        });
    });

    describe('isValidModSeven', () => {
        it('should return true for valid C-prefix number', () => {
            expect(service.isValidModSeven('C123456')).toBe(true);
        });

        it('should return true for valid 10-digit number with correct mod seven', () => {
            expect(service.isValidModSeven('1234567890')).toBe(true);
        });

        it('should return false for invalid 10-digit number', () => {
            expect(service.isValidModSeven('1234567891')).toBe(false);
        });

        it('should return false for invalid length', () => {
            expect(service.isValidModSeven('12345')).toBe(false);
        });

        it('should return false for non-numeric characters in 10-digit number', () => {
            expect(service.isValidModSeven('123456789A')).toBe(false);
        });
    });
});
