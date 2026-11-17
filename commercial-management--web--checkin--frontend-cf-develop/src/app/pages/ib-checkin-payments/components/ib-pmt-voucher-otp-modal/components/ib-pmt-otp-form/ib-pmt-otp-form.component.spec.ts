import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OtpValidationService } from '@src/app/shared/http-services/otp-cloud/ib-otp-validation.service';
import { TranslateModule } from '@ngx-translate/core';
import { IbPmtOtpInputComponent } from '@src/app/pages/ib-checkin-payments/components/ib-pmt-voucher-otp-modal/components/ib-pmt-otp-input/ib-pmt-otp-input.component';
import { IbPmtOtpFormComponent } from './ib-pmt-otp-form.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

type IbPmtOtpFormPrivateMethods = {
    initTimer: () => void;
    clearTimerInterval: () => void;
    resetOtpWithoutChangeEvent: () => void;
};

describe('IbPmtOtpFormComponent', () => {
    let component: IbPmtOtpFormComponent;
    let fixture: ComponentFixture<IbPmtOtpFormComponent>;
    let otpValidationService: jasmine.SpyObj<OtpValidationService>;

    beforeEach(async () => {
        const otpValidationServiceSpy = jasmine.createSpyObj('OtpValidationService', ['validate']);

        await TestBed.configureTestingModule({
            declarations: [IbPmtOtpFormComponent, IbPmtOtpInputComponent],
            schemas: [ NO_ERRORS_SCHEMA ],
            imports: [TranslateModule.forRoot()],
            providers: [{ provide: OtpValidationService, useValue: otpValidationServiceSpy }]
        }).compileComponents();

        fixture = TestBed.createComponent(IbPmtOtpFormComponent);
        component = fixture.componentInstance;
        otpValidationService = TestBed.inject(OtpValidationService) as jasmine.SpyObj<OtpValidationService>;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize timer on changes', () => {
        const privateMethods = component as unknown as IbPmtOtpFormPrivateMethods;
        spyOn(privateMethods, 'initTimer');
        component.ngOnChanges();
        expect(privateMethods.initTimer).toHaveBeenCalled();
    });

    it('should clear timer interval on destroy', () => {
        const privateMethods = component as unknown as IbPmtOtpFormPrivateMethods;
        spyOn(privateMethods, 'clearTimerInterval');
        component.ngOnDestroy();
        expect(privateMethods.clearTimerInterval).toHaveBeenCalled();
    });



    it('should reset OTP input without change event', () => {
        spyOn(component.inputs, 'reset');
        (component as unknown as IbPmtOtpFormPrivateMethods).resetOtpWithoutChangeEvent();
        expect(component.inputs.reset).toHaveBeenCalledWith(false);
    });

});