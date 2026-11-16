import { IbCModalService } from 'ib-web-commons/ib-modal';
import { Injectable } from '@angular/core';
import { downgradeToAJSService } from 'ib-web-commons/utils';
import { IbPmtVoucherOtpModalComponent } from './ib-pmt-voucher-otp-modal.component';
import { OtpModalModel, OtpModalOutput } from '@src/app/core/models/ib-pmt-voucher-otp-models';

@Injectable({ providedIn: 'root' })
export class IbPmtVoucherOtpModalService {
    public modalOptions = {
        modalBlocked: true,
        windowClass: 'ib-modals bki-dialog'
    };
    constructor (
        private IbCModalService: IbCModalService
    ) { }

    showOTPModal = ( viewModel ): Promise<OtpModalOutput> => {
        const modalRef = this.IbCModalService.showGenericComponentModal(
            IbPmtVoucherOtpModalComponent,
            this.modalOptions
        );
        const componentInstance = modalRef.componentInstance as { model: OtpModalModel | undefined; };
        componentInstance.model = viewModel;
        return modalRef.result;
    };
}
downgradeToAJSService('IbPmtVoucherOtpModalService', IbPmtVoucherOtpModalService, 'ib-pmt-voucher-otp-module');
