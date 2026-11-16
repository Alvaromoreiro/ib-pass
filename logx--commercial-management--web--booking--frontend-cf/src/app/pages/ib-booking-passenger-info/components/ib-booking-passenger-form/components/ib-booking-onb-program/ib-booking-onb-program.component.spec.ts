import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IbBookingOnbProgramComponent } from '@pages/ib-booking-passenger-info/components/ib-booking-passenger-form/components/ib-booking-onb-program/ib-booking-onb-program.component';
import { IbBookingPassengerFormValidationService } from '@src/app/shared/services/ib-booking-passenger-form/ib-booking-passenger-form-validation.service';
import { BookingAppConstants } from '@src/app/core/constants/ib-booking-constants';

class IbBookingPassengerFormValidationServiceMock {
    createModSevenValidator = jasmine.createSpy('createModSevenValidator').and.returnValue(() => null);
}

describe('IbBookingOnbProgramComponent', () => {
    let component: IbBookingOnbProgramComponent;
    let fixture: ComponentFixture<IbBookingOnbProgramComponent>;
    let validationService: IbBookingPassengerFormValidationServiceMock;
    let fb: FormBuilder;

    const INDEX = 0;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [IbBookingOnbProgramComponent],
            imports: [
                FormsModule,
                ReactiveFormsModule,
                TranslateModule.forRoot()
            ],
            providers: [
                { provide: IbBookingPassengerFormValidationService, useClass: IbBookingPassengerFormValidationServiceMock },
                FormBuilder
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();

        validationService = TestBed.inject(IbBookingPassengerFormValidationService) as any;
        fb = TestBed.inject(FormBuilder);

        fixture = TestBed.createComponent(IbBookingOnbProgramComponent);
        component = fixture.componentInstance;

        component.index = INDEX;
        component.passengerForm = fb.group({
            [`check_obn_${INDEX}`]: [false],
            [`ob_number_card_${INDEX}`]: [''],
            [`businessCodeType_${INDEX}`]: ['']
        });

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have submitState false by default', () => {
        expect(component.submitState).toBe(false);
    });

    describe('checkOnBFormValues', () => {
        describe('when check_obn is true', () => {
            beforeEach(() => {
                component.passengerForm.get(`check_obn_${INDEX}`)?.setValue(true);
                component.checkOnBFormValues();
            });

            it('should patch ob_number_card with "OB"', () => {
                expect(component.passengerForm.get(`ob_number_card_${INDEX}`)?.value).toBe('OB');
            });

            it('should patch businessCodeType with { code: "OB" }', () => {
                expect(component.passengerForm.get(`businessCodeType_${INDEX}`)?.value).toEqual({ code: 'OB' });
            });

            it('should set maxLength to 10', () => {
                expect(component.maxLength).toBe(10);
            });

            it('should set digitLength to 8', () => {
                expect(component.digitLength).toBe(8);
            });

            it('should set pattern with ONBUSINESS_NUMBER_PATTERN', () => {
                const expectedPattern = '^OB' + BookingAppConstants.bookingPatterns.ONBUSINESS_NUMBER_PATTERN + '{8}';
                expect(component.pattern).toBe(expectedPattern);
            });

            it('should set cleaner to "OB"', () => {
                expect(component.cleaner).toBe('OB');
            });

            it('should call createModSevenValidator', () => {
                expect(validationService.createModSevenValidator).toHaveBeenCalled();
            });

            it('should set validators (required + modSeven) on ob_number_card control', () => {
                const cardControl = component.passengerForm.get(`ob_number_card_${INDEX}`);
                expect(cardControl?.validator).toBeTruthy();
            });

            it('ob_number_card should be invalid when empty after validators set', () => {
                component.passengerForm.get(`ob_number_card_${INDEX}`)?.setValue('');
                component.passengerForm.get(`ob_number_card_${INDEX}`)?.updateValueAndValidity();
                expect(component.passengerForm.get(`ob_number_card_${INDEX}`)?.hasError('required')).toBeTrue();
            });
        });

        describe('when check_obn is false', () => {
            beforeEach(() => {
                component.passengerForm.get(`check_obn_${INDEX}`)?.setValue(false);
                component.checkOnBFormValues();
            });

            it('should clear validators on ob_number_card control', () => {
                const cardControl = component.passengerForm.get(`ob_number_card_${INDEX}`);
                expect(cardControl?.validator).toBeNull();
            });

            it('ob_number_card should be valid even when empty', () => {
                component.passengerForm.get(`ob_number_card_${INDEX}`)?.setValue('');
                expect(component.passengerForm.get(`ob_number_card_${INDEX}`)?.valid).toBeTrue();
            });
        });
    });
});
