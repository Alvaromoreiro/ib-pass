import angular from "angular";
import { Component, Inject, OnInit } from "@angular/core";
import { AJSRootScope, CommonsSessionStorageService, downgradeToAJSComponent } from 'ib-web-commons/utils';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IbMmBVoluntaryRefundsConfirmationModalComponent } from "./components/ib-MmB-voluntary-refunds-confirmation-modal/ib-MmB-voluntary-refunds-confirmation-modal.component";
import { IbCModalService } from "ib-web-commons/ib-modal";
import { IbMmBVoluntaryRefundsCloseModalComponent } from "./components/ib-MmB-voluntary-refunds-close-modal/ib-MmB-voluntary-refunds-close-modal.component";
import { AJSMmbModalService, MmbModalServiceType } from '../ib-reusable-components/ib-MmB-modal/services/upgraded/ib-Mmb-modal-service-bridge.service';
import { IbMmbVoluntaryRefundsService } from "./services/ib-MmB-voluntary-refunds.service";
import { VoluntaryRefundsTransformerModel } from "../ib-MmB-booking-dashboard/components/ib-MmB-voluntary-refunds-tab/models/ib-voluntary-refunds-tab-transformer-model";
import { VoluntaryRefundsConfirmationModel } from "../ib-MmB-booking-dashboard/components/ib-MmB-voluntary-refunds-tab/models/ib-voluntary-refunds-confirmation-model";

@Component({
    selector: 'ib-mmb-voluntary-refunds',
    templateUrl: './ib-Mmb-voluntary-refunds-view.component.html',
    providers: [
        IbMmbVoluntaryRefundsService
    ]
})
export class IbMmBVoluntaryRefundsComponent implements OnInit {
    imgUrl: string = this.$rootScope.routes.images + '/logos/logo_iberia_red.svg';
    currentStep: number = 0;
    steps: string[] = ['MMB_CASH_REFUND_MODAL_STEP_1_TITLE', 'MMB_CASH_REFUND_MODAL_STEP_3_TITLE'];
    totalSteps: number = this.steps.length;
    dataModelRefund: VoluntaryRefundsTransformerModel;
    confirmationResponse: VoluntaryRefundsConfirmationModel;

    constructor(
        private NgbActiveModal: NgbActiveModal,
        private IbCModalService: IbCModalService,
        @Inject(AJSMmbModalService) private MmBModalService: MmbModalServiceType,
        @Inject(AJSRootScope) private $rootScope: any,
        private IbMmbVoluntaryRefundsService: IbMmbVoluntaryRefundsService,
        private CommonsSessionStorageService: CommonsSessionStorageService
    ) {}

    ngOnInit = (): void => {
        // this.steps = this.getSteps(this.dataModelRefund);
    };

    private getSteps = (data) => {
        if (data.withPayments === true) {
            return ['MMB_CASH_REFUND_MODAL_STEP_1_TITLE', 'MMB_CASH_REFUND_MODAL_STEP_2_TITLE', 'MMB_CASH_REFUND_MODAL_STEP_3_TITLE'];
        }
        return ['MMB_CASH_REFUND_MODAL_STEP_1_TITLE', 'MMB_CASH_REFUND_MODAL_STEP_3_TITLE']
    }

    closeModal = () => {
        this.NgbActiveModal.close();
    };

    checkStep = () => {
        if(this.isConfirmationStep()) {
            this.CommonsSessionStorageService.clearAll();
            window.location.href = window.location.origin;
        } else {
            this.showModalAndClose();
        }
    }

    isConfirmationStep = (): boolean => {
        return this.steps[this.currentStep] === 'MMB_CASH_REFUND_MODAL_STEP_3_TITLE';
    }

    showModalAndClose = (tpl = IbMmBVoluntaryRefundsCloseModalComponent) => {
        const optionsModal = {
            windowClass: 'ib-modals ib-modals--md',
            modalBlocked: true
        };
        const modalRef = this.IbCModalService.showGenericComponentModal(tpl, optionsModal);
        modalRef.componentInstance.currentStep = this.currentStep;
        modalRef.componentInstance.steps = this.steps;
    }
}

downgradeToAJSComponent('ibMmbVoluntaryRefunds', {
  component: IbMmBVoluntaryRefundsComponent,
  inputs: ['model']
}, 'ib-MmB-voluntary-refunds-module');
