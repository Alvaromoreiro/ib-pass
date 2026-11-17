import { IbCModalService } from 'ib-web-commons/ib-modal';
import { Injectable } from '@angular/core';
import { downgradeToAJSService } from 'ib-web-commons/utils';
import { IbLotusOtpModalComponent } from './ib-lotus-otp-modal.component';
import { OtpModalModel, OtpModalOutput } from '@src/app/core/models/ib-checkin-payments/ib-checkin-payments-otp-model';

@Injectable({ providedIn: 'root' })
export class IbLotusOtpModalService {
    public modalOptions = {
        modalBlocked: true,
        windowClass: 'ib-modals bki-dialog'
    };
    constructor (
        private IbCModalService: IbCModalService
    ) { }

    showOTPModal = (viewModel): Promise<OtpModalOutput> => {
        const modalRef = this.IbCModalService.showGenericComponentModal(
            IbLotusOtpModalComponent,
            this.modalOptions
        );
        const componentInstance = modalRef.componentInstance as { model: OtpModalModel | undefined; };
        componentInstance.model = viewModel;
        return modalRef.result;
    };
}
downgradeToAJSService('IbLotusOtpModalService', IbLotusOtpModalService, 'ib-shared-components-module');
