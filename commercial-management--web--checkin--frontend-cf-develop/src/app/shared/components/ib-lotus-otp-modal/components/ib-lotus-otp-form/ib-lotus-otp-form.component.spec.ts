import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { IbLotusOtpFormComponent } from './ib-lotus-otp-form.component';
import { AJSGetCKICachedInformationServiceToken, AJSGetCKICachedInformationServiceType } from '@src/app/shared/http-services/pac-prm/bridges/ib-get-cached-information-bridge.service';
import { IbLotusOtpInputComponent } from '@src/app/shared/components/ib-lotus-otp-modal/components/ib-lotus-otp-input/ib-lotus-otp-input.component';
import { OtpErrorInternalCodeEnum, OtpFormStatesEnum, OtpLotusError } from '@src/app/core/models/ib-pmt-voucher-otp-models';

const mockBookingInfo = { checkinId: '' };

type IbLotusOtpFormPrivateMethods = {
    initTimer: () => void;
    clearTimerInterval: () => void;
    resetOtpWithoutChangeEvent: () => void;
};

describe('IbLotusOtpFormComponent', () => {
    let component: IbLotusOtpFormComponent;
    let fixture: ComponentFixture<IbLotusOtpFormComponent>;
    let getCkiCachedInformationService: jasmine.SpyObj<AJSGetCKICachedInformationServiceType>;

    beforeEach(async () => {
        getCkiCachedInformationService = jasmine.createSpyObj('GetCKICachedInformationService', ['getCachedLotus']);
        getCkiCachedInformationService.getCachedLotus.and.returnValue(Promise.resolve(mockBookingInfo));

        await TestBed.configureTestingModule({
            declarations: [IbLotusOtpFormComponent, IbLotusOtpInputComponent],
            schemas: [ NO_ERRORS_SCHEMA ],
            imports: [TranslateModule.forRoot()],
            providers: [{ provide: AJSGetCKICachedInformationServiceToken, useValue: getCkiCachedInformationService }]
        }).compileComponents();

        fixture = TestBed.createComponent(IbLotusOtpFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize timer on changes', () => {
        const privateMethods = component as unknown as IbLotusOtpFormPrivateMethods;
        spyOn(privateMethods, 'initTimer');
        component.ngOnChanges();
        expect(privateMethods.initTimer).toHaveBeenCalled();
    });

    it('should clear timer interval on destroy', () => {
        const privateMethods = component as unknown as IbLotusOtpFormPrivateMethods;
        spyOn(privateMethods, 'clearTimerInterval');
        component.ngOnDestroy();
        expect(privateMethods.clearTimerInterval).toHaveBeenCalled();
    });

    it('should reset OTP input without change event', () => {
        const resetSpy = spyOn(component.inputs, 'reset');
        (component as unknown as IbLotusOtpFormPrivateMethods).resetOtpWithoutChangeEvent();
        expect(resetSpy).toHaveBeenCalledWith(false);
    });

    it('should validate the invalid code error', () => {
        const errorDataMock: OtpLotusError = {
            data: {},
            errorCode: 403,
            internalErrorCode: OtpErrorInternalCodeEnum.PAC_PRM_6970
        };

        component.onValidationError(errorDataMock);

        expect(component.currentOTPState$.getValue()).toBe(OtpFormStatesEnum.INVALID_CODE);
    });

    it('should validate the default error', () => {
        const errorDataMock: OtpLotusError = {
            data: {},
            errorCode: 403,
            internalErrorCode: 'test'
        };

        component.onValidationError(errorDataMock);

        expect(component.currentOTPState$.getValue()).toBe(OtpFormStatesEnum.ERROR);
    });

    it('should update the current otp state to incomplete if the code is incomplete', () => {
        component.onOtpChange({ value: '' });

        expect(component.currentOTPState$.getValue()).toBe(OtpFormStatesEnum.INCOMPLETE);
    });

    it('should update call the cached-lotus service if the code is complete', fakeAsync(() => {
        const otpCode = '123456';

        component.onOtpChange({ value: otpCode });

        expect(component.currentOTPState$.getValue()).toBe(OtpFormStatesEnum.LOADING);
        expect(getCkiCachedInformationService.getCachedLotus).toHaveBeenCalledWith(otpCode, component.otpSessionId);
        tick();
        expect(component.currentOTPState$.getValue()).toBe(OtpFormStatesEnum.SUCCESS);
        flush();
    }));
});