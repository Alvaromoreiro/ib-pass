import { IbCModalService } from 'ib-web-commons/ib-modal';
import { Injectable } from '@angular/core';
import { IbLotusOtpModalComponent } from './ib-lotus-otp-modal.component';
import { OtpModalModel, OtpModalOutput } from '@src/app/core/models/ib-lotus-otp-models';

@Injectable({ providedIn: 'root' })
export class IbLotusOtpModalService {
    public modalOptions = {
        modalBlocked: true,
        windowClass: 'ib-modals ib-modals--otp'
    };
    constructor (
        private IbCModalService: IbCModalService
    ) { }

    showOTPModal = ( viewModel:OtpModalModel ): Promise<OtpModalOutput> => {
        const modalRef = this.IbCModalService.showGenericComponentModal(
            IbLotusOtpModalComponent,
            this.modalOptions
        );
        const componentInstance = modalRef.componentInstance as { model: OtpModalModel | undefined; };
        componentInstance.model = viewModel;
        return modalRef.result;
    };
}
