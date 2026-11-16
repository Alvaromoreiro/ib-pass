
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OtpFormState, OtpModalModel, OtpFormStatesEnum, OtpFormStatesEnumValues } from '@src/app/core/models/ib-lotus-otp-models';
import { LiteralFormatterPipe } from '@shared/pipes/literalFormatter.pipe';
import { IbCLinkPipe } from 'ib-web-commons/pipes';
import { TranslateService } from '@ngx-translate/core';
import { IbMmbRetrieveOrderService } from '../../../../components/services/ib-MmB-retrieve-order.service';
import { LoadingSpinnerService } from '@src/app/shared/components/loading-spinner/loading-spinner.service';

import { MmbCommonsErrorsResponseGeneral } from '@src/app/core/models/general-errors-model';
import { IbMmbRetrieveOrderOtpProtectedService } from '../../../../components/services/ib-MmB-retrieve-order-otp-protected.service';

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
        private IbMmbRetrieveOrderService: IbMmbRetrieveOrderService,
        private LoadingSpinnerService: LoadingSpinnerService,
        private IbMmbRetrieveOrderOtpProtectedService: IbMmbRetrieveOrderOtpProtectedService
    ) {

    }

    ngOnInit () {
        this.LoadingSpinnerService.hide();
        this.ccLinkTag.link.href = this.IbCLinkPipe.transform('CALL_CENTER_LINK');
        this.ccLinkTag.link.title = this.TranslateService.instant('CALL_CENTER');
        this.textsModel.EXPLANATION = this.LiteralFormatterPipe.transform(this.TranslateService.instant(('OTP_MODAL_LOTUS_EXPLANATION_TEXT')).replace('#email#', this.model.email));
        this.textsModel.CC_TEXT = this.LiteralFormatterPipe.transform(this.TranslateService.instant('OTP_MODAL_CALL_CENTER_TEXT'), this.ccLinkTag);
    }

    public close = (state: OtpFormState) => {
        this.NgbActiveModal.close(state);
        this.LoadingSpinnerService.show();
    };
    public dismiss = (state?: OtpFormState) => {
        this.NgbActiveModal.dismiss(state);
        this.LoadingSpinnerService.show();
    };

    public resendCode = () => {
        this.sendNewDisabled = true;
        this.reloadingSession = true;
        this.showLoading = true;
        this.IbMmbRetrieveOrderService.retrieveOrderPostPromised(this.model.surname, this.model.pnr)
            .then(() => {
                this.dismiss();
            }).catch((error: MmbCommonsErrorsResponseGeneral) => {
                if (error?.errorCode === 403 &&  error.internalErrorCode === 'SSE_ORM_6969') {
                    const viewModel: OtpModalModel = this.IbMmbRetrieveOrderOtpProtectedService.generateOtpModel(this.model.pnr, this.model.surname, error);
                    Object.assign(this.model, viewModel);
                    return
                }
                this.dismiss({state: OtpFormStatesEnum.ERROR, errorData: error} as OtpFormState);
                
            }).finally(() => {
                this.reloadingSession = false;
                this.showLoading = false;
            });
    };

    public onOtpStatesUpdate = (state: OtpFormState) => {
        const { state: stateValue } = state;
        this.showLoading = this.OtpFormStatesEnum.LOADING === stateValue;
        if (this.OtpFormStatesEnum.PRISTINE === stateValue) {
            this.sendNewDisabled = true;
            return;
        }
        if (this.SET_ENABLE_SEND_NEW.has(stateValue)) {
            this.sendNewDisabled = false;
            return;
        }

        if (this.OtpFormStatesEnum.SUCCESS === stateValue) {
            return this.close(state);
        }
        if (this.FINAL_ERRORS_SET.has(stateValue)) {
            return this.dismiss(state);
        }
    };
};

