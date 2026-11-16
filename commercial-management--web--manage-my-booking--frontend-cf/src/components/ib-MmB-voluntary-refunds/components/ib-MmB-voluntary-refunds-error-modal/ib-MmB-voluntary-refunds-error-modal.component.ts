import { Component, OnInit} from "@angular/core";
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IbMmbVoluntaryRefundsService } from "../../services/ib-MmB-voluntary-refunds.service";
import { MMBDatalayerConstants } from "@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants";
import { MmBAppConstants } from "@src/ib-MmB-constants";

@Component({
    selector: 'ib-mmb-voluntary-refunds-error-modal',
    templateUrl: './ib-MmB-voluntary-refunds-error-modal-view.component.html'
})

export class IbMmBVoluntaryRefundsErrorModalComponent implements OnInit {
    constructor(
        private NgbActiveModal: NgbActiveModal,
        private IbMmbVoluntaryRefundsService: IbMmbVoluntaryRefundsService,
        private NgbModal: NgbModal,
    ) {
        this.IbMmbVoluntaryRefundsService.updateWorkflowDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_STEP.REFVER, MmBAppConstants.QUADRIGAM.VOL_REFUND_MODAL_ERROR_REFUND);
    }

    ngOnInit = (): void => {
    };

    closeModal = () => {
        this.NgbActiveModal.close();
    }

    accept = (): void => {
        this.NgbActiveModal.close();
    }
}
