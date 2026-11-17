import { Component, Input, OnChanges, OnDestroy, Output, EventEmitter, ViewChild, Inject } from '@angular/core';
import { OtpInputChangeEvent, OtpFormStatesEnum, OtpFormState, OtpFormStatesEnumValues, OtpErrorInternalCodeEnum, OtpLotusError } from '@src/app/core/models/ib-pmt-voucher-otp-models';
import { BehaviorSubject, Subscription, distinctUntilChanged } from 'rxjs';
import { IbLotusOtpInputComponent } from '../ib-lotus-otp-input/ib-lotus-otp-input.component';
import { AJSGetCKICachedInformationServiceToken, AJSGetCKICachedInformationServiceType } from '@src/app/shared/http-services/pac-prm/bridges/ib-get-cached-information-bridge.service';
import { CommonsSessionStorageService } from 'ib-web-commons/utils';
import { CheckinAppConstants } from '@src/components/routing/ib-check-in-constants';
@Component({
    selector: 'ib-lotus-otp-form',
    templateUrl: './ib-lotus-otp-form.component.html',
    styleUrls: ['./ib-lotus-otp-form.component.scss']
})
export class IbLotusOtpFormComponent implements OnChanges, OnDestroy {

    @Input() otpTimeLimit: string;
    @Input() otpTimeStart: string;
    @Input() otpSessionId: string;
    @Output() otpFormState = new EventEmitter <OtpFormState> ();
    @ViewChild(IbLotusOtpInputComponent) inputs:IbLotusOtpInputComponent;
    private timerStart = new Date();
    private timerInterval = -1;
    private otpTimeLimitMls: number = 0;
    private otpTimeStartMls: number = 0;
    public endTimeLimit: string;
    public readonly OtpFormStatesEnum = OtpFormStatesEnum;
    private readonly SECOND_MILISECONDS = 1000;
    private readonly MINUTE_MILISECONDS = this.SECOND_MILISECONDS * 60;
    private readonly HOUR_MILISECONDS = this.MINUTE_MILISECONDS * 60;
    private readonly ALLOW_RESEND_TIME = this.MINUTE_MILISECONDS;
    public readonly  OTP_CODE_LENGTH = 6;
    public readonly  INPUT_ENABLED_STATES_SET = new Set<OtpFormStatesEnumValues>([this.OtpFormStatesEnum.PRISTINE, this.OtpFormStatesEnum.ALLOWED_RESEND_TIME, this.OtpFormStatesEnum.INCOMPLETE]);
    public readonly  INPUT_RESET_STATES_SET = new Set<OtpFormStatesEnumValues>([this.OtpFormStatesEnum.INVALID_CODE]);
    public readonly  INPUT_CLEARTIMER_STATES_SET = new Set<OtpFormStatesEnumValues>([this.OtpFormStatesEnum.ERROR, this.OtpFormStatesEnum.SUCCESS, this.OtpFormStatesEnum.INVALID_SESSION, this.OtpFormStatesEnum.TIMEOUT, this.OtpFormStatesEnum.INVALID_CODE]);
    public currentOTPState$= new BehaviorSubject(this.OtpFormStatesEnum.PRISTINE);
    private statusSub: Subscription;
    private allowResendReached = false;
    constructor (
        @Inject(AJSGetCKICachedInformationServiceToken) private GetCKICachedInformationService: AJSGetCKICachedInformationServiceType,
        private CommonsSessionStorageService: CommonsSessionStorageService
    ) {
        this.reactiveStatesUpdater();
    }
    ngOnDestroy (): void {
        this.clearTimerInterval();
        this.statusSub.unsubscribe();
    }

    ngOnChanges (): void {
        this.inputs?.reset();
        this.initTimer();
        this.currentOTPState$.next(this.OtpFormStatesEnum.PRISTINE);
    }

    private initTimer = () => {
        this.clearTimerInterval();
        this.otpTimeLimitMls = new Date(this.otpTimeLimit).getTime();
        this.otpTimeStartMls = new Date(this.otpTimeStart).getTime();
        this.timerStart = new Date();
        this.calculateTimeLimit();
        this.updateTimerInterval();
    };

    private clearTimerInterval = () => {
        if (this.timerInterval >= 0) {
            this.allowResendReached = false;
            clearInterval(this.timerInterval);
        }
        this.timerInterval = -1;
    };

    private getElapsedTime = () => {
        return new Date().getTime() - this.timerStart.getTime();
    };

    private calculateTimeLimit = (): number => {
        const limitDate = this.otpTimeLimitMls;
        const elapsedTime = this.getElapsedTime();
        const now = this.otpTimeStartMls + elapsedTime;
        const diff = limitDate - now;
        const minutes = Math.floor((diff % this.HOUR_MILISECONDS) / this.MINUTE_MILISECONDS);
        const seconds = Math.floor((diff % this.MINUTE_MILISECONDS) / this.SECOND_MILISECONDS);

        const minutesToShow = minutes < 10 ? `0${minutes}` : minutes;
        const secondsToShow = seconds < 10 ? `0${seconds}` : seconds;
        this.endTimeLimit = `${minutesToShow}:${secondsToShow}`;
        (diff < 0) && (this.endTimeLimit = '00:00');
        if (!this.allowResendReached && (elapsedTime >= this.ALLOW_RESEND_TIME)) { 
            this.allowResendReached = true;
            this.currentOTPState$.next(this.OtpFormStatesEnum.ALLOWED_RESEND_TIME);
        }
        return diff;
    };

    private updateTimerInterval = () => {
        this.timerInterval = window.setInterval(() => {
            const diff = this.calculateTimeLimit();
            if (diff < 0) {
                this.currentOTPState$.next(this.OtpFormStatesEnum.TIMEOUT);
                this.clearTimerInterval();
            }
        }, this.SECOND_MILISECONDS / 4);
    };

    public onOtpChange = (otpCodeEvent: OtpInputChangeEvent) => {
        const otpCode = otpCodeEvent.value;
        if(otpCode.length === this.OTP_CODE_LENGTH) {
            this.onOtpComplete(otpCode);
        } else {
            this.currentOTPState$.next(this.OtpFormStatesEnum.INCOMPLETE);
        }
    };

    private onOtpComplete = (otpCode :string) => {
        this.currentOTPState$.next(this.OtpFormStatesEnum.LOADING);
        this.GetCKICachedInformationService.getCachedLotus(otpCode, this.otpSessionId)
            .then((data) => { 
                this.CommonsSessionStorageService.set(CheckinAppConstants.STORAGE_KEYS.BOOKING_INFO, data);
                this.CommonsSessionStorageService.set('flowId', (data as CkiBookingInfo.BookingInfo).checkinId);
                this.currentOTPState$.next(this.OtpFormStatesEnum.SUCCESS); 
            }, this.onValidationError);
    };

    public onValidationError = (errorData: OtpLotusError) => {
        switch (errorData?.internalErrorCode) {
                case OtpErrorInternalCodeEnum.PAC_PRM_6970:
                    this.currentOTPState$.next(this.OtpFormStatesEnum.INVALID_CODE);
                    this.reactiveStatesUpdater();
                    break;
                default:
                    this.currentOTPState$.next(this.OtpFormStatesEnum.ERROR);
        }
    };

    private resetOtpWithoutChangeEvent = ()=> {
        this.inputs?.reset(false);
    };

    private reactiveStatesUpdater = () => {
        this.statusSub = this.currentOTPState$.pipe(distinctUntilChanged()).subscribe(
            (state) => {
                this.inputs?.setEnabled(this.INPUT_ENABLED_STATES_SET.has(state));
                this.INPUT_CLEARTIMER_STATES_SET.has(state) && (this.clearTimerInterval());
                this.INPUT_RESET_STATES_SET.has(state) && this.resetOtpWithoutChangeEvent();
                this.otpFormState.emit({state});
            });
    };
}
