
import { Component, Inject, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OtpFormState, OtpModalModel, OtpFormStatesEnum, OtpModalOutput, OtpFormStatesEnumValues } from '../../../core/models/ib-pmt-voucher-otp-models';
import { LiteralFormatterPipe } from '../../../shared/pipes/literalFormatter.pipe';
import { IbCLinkPipe } from 'ib-web-commons/pipes';
import { TranslateService } from '@ngx-translate/core';
import { IbCheckVoucherCodeService } from '../../../shared/http-services/sse-orm/services/ib-check-voucher-code.service';
import { AJSRootScope, CommonsRootScope } from 'ib-web-commons/utils';


@Component({
    selector: 'ib-pmt-voucher-otp-modal',
    templateUrl: './ib-pmt-voucher-otp-modal.component.html',
    styleUrls: [ './ib-pmt-voucher-otp-modal.component.scss' ],
    providers: [
        LiteralFormatterPipe,
        IbCLinkPipe
    ]
})
export class IbPmtOrmVoucherOtpModalComponent implements OnInit {
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
        private IbCheckVoucherCodeService: IbCheckVoucherCodeService,
        
        @Inject(AJSRootScope) private $rootScope: CommonsRootScope

    ) {

    }

    ngOnInit () {
        this.ccLinkTag.link.href = this.IbCLinkPipe.transform( 'CALL_CENTER_LINK' );
        this.ccLinkTag.link.title = this.TranslateService.instant( 'CALL_CENTER' );
        this.textsModel.EXPLANATION = this.LiteralFormatterPipe.transform( this.TranslateService.instant(('OTP_MODAL_EXPLANATION')).replace( '#email#', this.model.email ) );
        this.textsModel.CC_TEXT = this.LiteralFormatterPipe.transform( this.TranslateService.instant('OTP_MODAL_CALL_CENTER_TEXT'), this.ccLinkTag );
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

    public resendCode = () => {
        this.sendNewDisabled = true;
        this.reloadingSession=true;
        this.showLoading = true;
        return this.IbCheckVoucherCodeService.checkVoucherCode(this.$rootScope.serviceURI, this.model.voucherCode, this.model.flowId)
            .then((response)=> {
                const { otpSessionId, otpSessionExpired, otpSessionRequested, otpEmail} = response.data.otpValidation;
                const viewModel = {
                    sessionId: otpSessionId,
                    sessionExpiration: otpSessionExpired,
                    sessionRequested: otpSessionRequested,
                    email: otpEmail
                };
                Object.assign(this.model, viewModel);
            }, () => {
                this.dismiss(this.OtpFormStatesEnum.ERROR);
            }).finally(()=>{
                this.reloadingSession = false;
                this.showLoading = false;
            });
       
    };

    public onOtpStatesUpdate = ({state}: OtpFormState) => {
        this.showLoading =  this.OtpFormStatesEnum.LOADING === state;
        if (this.OtpFormStatesEnum.PRISTINE === state){
            this.sendNewDisabled = true;
            return;
        }
        if(this.SET_ENABLE_SEND_NEW.has(state)){
            this.sendNewDisabled = false;
            return;
        }

        if (this.OtpFormStatesEnum.SUCCESS === state){
            return this.close(state);
        }
        if (this.FINAL_ERRORS_SET.has(state)){
            return this.dismiss(state);
        }
    };


}

