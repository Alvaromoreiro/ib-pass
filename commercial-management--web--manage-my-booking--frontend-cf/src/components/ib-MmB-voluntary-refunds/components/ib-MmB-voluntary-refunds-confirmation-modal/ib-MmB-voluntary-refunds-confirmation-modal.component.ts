import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IbMmbVoluntaryRefundsService } from "../../services/ib-MmB-voluntary-refunds.service";
import { MmBHttpResponse } from "@src/app/core/models/generic-models";
import { VoluntaryRefundsConfirmationModel } from "@src/components/ib-MmB-booking-dashboard/components/ib-MmB-voluntary-refunds-tab/models/ib-voluntary-refunds-confirmation-model";
import { IbCModalService } from 'ib-web-commons/ib-modal';
import { IbMmBVoluntaryRefundsErrorModalComponent } from "../ib-MmB-voluntary-refunds-error-modal/ib-MmB-voluntary-refunds-error-modal.component";
import { MMBDatalayerConstants } from "@src/components/services/ib-MmB-datalayer/constants/ib-MmB-datalayer-constants";
import { MmBAppConstants } from "@src/ib-MmB-constants";
import { IbMmbVoluntaryRefundsConfirmationService } from "../../services/ib-mmb-voluntary-refunds-confirmation.service";


@Component({
    selector: 'ib-mmb-voluntary-refunds-confirmation-modal',
    templateUrl: './ib-MmB-voluntary-refunds-confirmation-modal-view.component.html',
    styleUrls: ['./ib-mmb-voluntary-refunds-confirmation-modal-styles.component.scss']
})

export class IbMmBVoluntaryRefundsConfirmationModalComponent implements OnInit {
    @Input() currentStep: number;
    @Input() getNewCurrentStep;
    @Input() refundType: string;
    @Output() confirmationData = new EventEmitter<VoluntaryRefundsConfirmationModel>();
    showSpinner: boolean = false;

    constructor(
        private NgbActiveModal: NgbActiveModal,
        private IbMmbVoluntaryRefundsService: IbMmbVoluntaryRefundsService,
        private IbCModalService: IbCModalService,
        private IbMmbVoluntaryRefundsConfirmationService: IbMmbVoluntaryRefundsConfirmationService
    ) {
        this.IbMmbVoluntaryRefundsService.updateWorkflowDatalayerInfo(MMBDatalayerConstants.DIGITAL_DATA_STEP.REFVCO, MmBAppConstants.QUADRIGAM.VOL_REFUND_MODAL_CONFIRMATION);
    }

    ngOnInit = (): void => {
    };

    closeModal = () => {
        this.NgbActiveModal.close();
    }

    accept = (): void => {
        this.showSpinner = true;
        this.requestVoluntaryRefundsConfirmation(this.refundType);
    }

    private requestVoluntaryRefundsConfirmation = (refundType: string) => {
        this.IbMmbVoluntaryRefundsConfirmationService.voluntaryRefundsItinRefundConfirmationPromised(refundType)
            .then((res) => this.voluntaryRefundsConfirmationSuccess(res), (err) => this.voluntaryRefundsConfirmationError(err));
    };

    private voluntaryRefundsConfirmationSuccess = (res: MmBHttpResponse<VoluntaryRefundsConfirmationModel>) => {
        this.confirmationData?.emit(res.data);
        this.refundConfirmationResponseIsOk();
    }

    private voluntaryRefundsConfirmationError = (error): void => {
        if (this.isControlledConflictError(error)) {
            this.emitCaseNumberFromError(error);
            this.refundConfirmationResponseIsOk();
            return;
        }

        this.handleRefundConfirmationGenericError();
    };

    private emitCaseNumberFromError = (error): void => {
        const { caseNumber } = this.extractErrorInfo(error);
        if (caseNumber) {
            this.confirmationData?.emit({ caseNumber } as VoluntaryRefundsConfirmationModel);
        }
    };

    private isControlledConflictError = (error): boolean => {
        const { code } = this.extractErrorInfo(error);
        return error?.status === 409 && this.isAllowedConflictErrorCode(code);
    };

    private extractErrorInfo = (error): { code: string | undefined; caseNumber: string | undefined } => {
        const errorBody = error?.error;
        return { code: errorBody?.code, caseNumber: errorBody?.caseNumber };
    };

    private isAllowedConflictErrorCode = (code?: string): boolean => {
        return [
            "HAL_SSE_ORM_0039",
            "SSE_MMB_1015"
        ].includes(code);
    };

    private handleRefundConfirmationGenericError = (): void => {
        this.showSpinner = false;
        this.closeModal();

        this.IbCModalService.showGenericComponentModal(
            IbMmBVoluntaryRefundsErrorModalComponent,
            {
                windowClass: "ib-modals ib-modals--md",
                modalBlocked: true
            }
        );
    };

    private refundConfirmationResponseIsOk = (): void => {
        this.showSpinner = false;
        this.currentStep += 1;
        this.getNewCurrentStep.emit(this.currentStep);
        this.closeModal();
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }
}
