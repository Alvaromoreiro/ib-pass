import { IbCModalService } from 'ib-web-commons/ib-modal';
import { Injectable } from '@angular/core';
import { downgradeToAJSService } from 'ib-web-commons/utils';
import { IbPmtOrmVoucherOtpModalComponent } from './ib-pmt-orm-voucher-otp-modal.component';
import { IbPmtAssfassVoucherOtpModalComponent } from './ib-pmt-assfass-voucher-otp-modal.component'; 
import { OtpModalModel, OtpModalOutput } from '../../../core/models/ib-pmt-voucher-otp-models';
import { withIbPmtStylesHostClass } from '../../../../styles/ib-pmt-styles-host';

@Injectable({ providedIn: 'root' })
export class IbCoupletPmtVoucherOtpModalService {
    public modalOptions = {
        modalBlocked: true,
        windowClass: withIbPmtStylesHostClass('ib-modals bki-dialog')
    };
    constructor (
        private IbCModalService: IbCModalService
    ) { }

    showOrmOTPModal = ( viewModel ): Promise<OtpModalOutput> => {
        const modalRef = this.IbCModalService.showGenericComponentModal(
            IbPmtOrmVoucherOtpModalComponent,
            this.modalOptions
        );
        const componentInstance = modalRef.componentInstance as { model: OtpModalModel | undefined; };
        componentInstance.model = viewModel;
        return modalRef.result;
    };
    showAssFassOtpModal = ( viewModel ): Promise<OtpModalOutput> => {
        const modalRef = this.IbCModalService.showGenericComponentModal(
            IbPmtAssfassVoucherOtpModalComponent,
            this.modalOptions
        );
        const componentInstance = modalRef.componentInstance as { model: OtpModalModel | undefined; };
        componentInstance.model = viewModel;
        return modalRef.result;
    };
}
downgradeToAJSService('IbCoupletPmtVoucherOtpModalService', IbCoupletPmtVoucherOtpModalService, 'ib-pmt-voucher-otp-module');
