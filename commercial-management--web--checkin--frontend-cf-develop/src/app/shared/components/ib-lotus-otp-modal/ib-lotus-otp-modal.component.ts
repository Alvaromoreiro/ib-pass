
import { Component, Inject, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IbCLinkPipe } from 'ib-web-commons/pipes';
import { TranslateService } from '@ngx-translate/core';
import { AJSRootScope, CommonsRootScope } from 'ib-web-commons/utils';
import { OtpFormState, OtpModalModel, OtpFormStatesEnum, OtpModalOutput, OtpFormStatesEnumValues } from '@src/app/core/models/ib-checkin-payments/ib-checkin-payments-otp-model';
import { LiteralFormatterPipe } from '@src/app/shared/pipes/literalFormatter.pipe';


@Component({
    selector: 'ib-lotus-otp-modal',
    templateUrl: './ib-lotus-otp-modal.component.html',
    styleUrls: ['./ib-lotus-otp-modal.component.scss'],
    providers: [
        LiteralFormatterPipe,
        IbCLinkPipe
    ]
})
export class IbLotusOtpModalComponent implements OnInit {
    ccLinkTag = {
        link: {
            tag: 'a',
            class: 'link link-underline',
            title: '',
            href: '',
            target: '_blank'
        }
    };
    textsModel = {
        EXPLANATION: '',
        CC_TEXT: ''
    };
    @Input() public model: OtpModalModel;
    public showLoading = false;
    public reloadingSession: boolean = false;
    public readonly OtpFormStatesEnum = OtpFormStatesEnum;
    public sendNewDisabled = true;
    private readonly FINAL_ERRORS_SET = new Set<OtpFormStatesEnumValues>([this.OtpFormStatesEnum.ERROR]);
    private readonly SET_ENABLE_SEND_NEW = new Set<OtpFormStatesEnumValues>([this.OtpFormStatesEnum.ALLOWED_RESEND_TIME, this.OtpFormStatesEnum.TIMEOUT, this.OtpFormStatesEnum.INVALID_SESSION]);

    constructor (
        private NgbActiveModal: NgbActiveModal,
        private LiteralFormatterPipe: LiteralFormatterPipe,
        private TranslateService: TranslateService,
        private IbCLinkPipe: IbCLinkPipe,
        @Inject(AJSRootScope) private $rootScope: CommonsRootScope
    ) { }

    ngOnInit () {
        this.ccLinkTag.link.href = this.IbCLinkPipe.transform('CALL_CENTER_LINK');
        this.ccLinkTag.link.title = this.TranslateService.instant('CALL_CENTER');
        this.textsModel.EXPLANATION = this.LiteralFormatterPipe.transform(this.TranslateService.instant(('OTP_MODAL_LOTUS_EXPLANATION_TEXT')).replace('#email#', this.model.email));
        this.textsModel.CC_TEXT = this.LiteralFormatterPipe.transform(this.TranslateService.instant('OTP_MODAL_CALL_CENTER_TEXT'), this.ccLinkTag);
    }

    public close = (state: OtpFormStatesEnumValues) => {
        const output: OtpModalOutput = {
            sessionId: this.model.sessionId,
            state: state
        };
        this.NgbActiveModal.close(output);
    };
    public dismiss = (state?: OtpFormStatesEnumValues) => {
        const output: OtpModalOutput = {
            sessionId: this.model.sessionId,
            state: state ?? this.OtpFormStatesEnum.CLOSED
        };
        this.NgbActiveModal.dismiss(output);
    };

    public onOtpStatesUpdate = ({ state }: OtpFormState) => {
        this.showLoading = this.OtpFormStatesEnum.LOADING === state;
        if (this.OtpFormStatesEnum.PRISTINE === state) {
            this.sendNewDisabled = true;
            return;
        }
        if (this.SET_ENABLE_SEND_NEW.has(state)) {
            this.sendNewDisabled = false;
            return;
        }

        if (this.OtpFormStatesEnum.SUCCESS === state) {
            return this.close(state);
        }
        if (this.FINAL_ERRORS_SET.has(state)) {
            return this.dismiss(state);
        }
    };

    public resendCode = () => {
        this.dismiss(this.OtpFormStatesEnum.RESEND_CODE);
    };
}

