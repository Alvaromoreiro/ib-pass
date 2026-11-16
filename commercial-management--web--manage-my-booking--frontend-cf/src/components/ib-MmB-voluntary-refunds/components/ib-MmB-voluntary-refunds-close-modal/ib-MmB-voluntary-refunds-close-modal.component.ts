import { Component, Input, OnInit } from "@angular/core";
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IbMmbVoluntaryRefundsService } from "../../services/ib-MmB-voluntary-refunds.service";
import { MMBDatalayerConstants } from "@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants";
import { MmBAppConstants } from "@src/ib-MmB-constants";

@Component({
  selector: 'ib-mmb-voluntary-refunds-close-modal',
  templateUrl: './ib-MmB-voluntary-refunds-close-modal-view.component.html'
})

export class IbMmBVoluntaryRefundsCloseModalComponent implements OnInit {
    @Input() currentStep: number;
    @Input() steps: string[];

    constructor(
        private NgbActiveModal: NgbActiveModal,
        private NgbModal: NgbModal,
        private IbMmbVoluntaryRefundsService: IbMmbVoluntaryRefundsService
    ) {
        this.IbMmbVoluntaryRefundsService.updateWorkflowDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_STEP.REFVEX, MmBAppConstants.QUADRIGAM.VOL_REFUND_MODAL_EXIT_REFUND);
    }

    ngOnInit = (): void => { };

    closeModal = () => {
        this.NgbActiveModal.close();
    }

    closeAllModal = (): void => {
        this.NgbModal.dismissAll();
    }
}
