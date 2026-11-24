import { Component, Input, OnChanges, OnDestroy, Output, EventEmitter, ViewChild } from '@angular/core';
import { OtpInputChangeEvent, OtpFormStatesEnum, OtpError, OtpFormState, OtpFormStatesEnumValues } from '../../../../../core/models/ib-pmt-voucher-otp-models';
import { OtpValidationService } from '../../../../../shared//http-services/otp/ib-otp-validation.service';
import { BehaviorSubject, Subscription, distinctUntilChanged } from 'rxjs';
import { IbPmtOtpInputComponent } from '../ib-pmt-otp-input/ib-pmt-otp-input.component';


@Component({
    selector: 'ib-pmt-otp-form',
    templateUrl: './ib-pmt-otp-form.component.html',
    styleUrls: ['./ib-pmt-otp-form.component.scss']
})
export class IbPmtOtpFormComponent implements OnChanges, OnDestroy {

    @Input() otpTimeLimit: string;
    @Input() otpTimeStart: string;
    @Input() otpSessionId: string;
    @Output() otpFormState = new EventEmitter <OtpFormState> ();
    @ViewChild(IbPmtOtpInputComponent) inputs:IbPmtOtpInputComponent;
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
    public readonly  INPUT_ENABLED_STATES_SET = new Set<OtpFormStatesEnumValues>([this.OtpFormStatesEnum.PRISTINE, this.OtpFormStatesEnum.ALLOWED_RESEND_TIME, this.OtpFormStatesEnum.INCOMPLETE, this.OtpFormStatesEnum.INVALID_CODE]);
    public readonly  INPUT_RESET_STATES_SET = new Set<OtpFormStatesEnumValues>([this.OtpFormStatesEnum.INVALID_CODE]);
    public readonly  INPUT_CLEARTIMER_STATES_SET = new Set<OtpFormStatesEnumValues>([this.OtpFormStatesEnum.ERROR, this.OtpFormStatesEnum.SUCCESS, this.OtpFormStatesEnum.INVALID_SESSION, this.OtpFormStatesEnum.TIMEOUT]);
    public currentOTPState$ = new BehaviorSubject(this.OtpFormStatesEnum.PRISTINE);
    private statusSub: Subscription;
    private allowResendReached = false;
    constructor (
        private OtpValidationService: OtpValidationService
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
        this.OtpValidationService.validate({otpCode, sessionToken:this.otpSessionId})
            .then(() => {this.currentOTPState$.next(this.OtpFormStatesEnum.SUCCESS);}, this.onValidationError);
    };


    public onValidationError = (errorData: OtpError) => {
        switch (errorData?.code) {
                case 'OTP008':
                    this.currentOTPState$.next(this.OtpFormStatesEnum.INVALID_CODE);
                    break;
                case 'OTP005':
                case 'OTP006':
                case 'OTP007':
                    this.currentOTPState$.next(this.OtpFormStatesEnum.INVALID_SESSION);
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
