import { Injectable } from '@angular/core';
import { IbCModalService, IbModalRef } from 'ib-web-commons/ib-modal';
import { StepsControlModalComponent, StepModalControl } from '../../components/ib-booking-steps-control-modal/ib-booking-steps-control-modal.component';

@Injectable({providedIn: 'root'})
export class StepsControlService {
    constructor (
        private IbCModalService: IbCModalService
    ) { }
    
    private modalRef: IbModalRef<StepsControlModalComponent> | null = null;


    public showStepsControlModal = ( { nextStep, currentStep }: StepModalControl ): IbModalRef<StepsControlModalComponent> => {
        if (this.modalRef) {
            return this.modalRef;
        }
        const modalOptions = {
            modalBlocked: true,
            windowClass: 'ib-modals bki-dialog ib-modals--mmd'
        };
        const modalRef = this.IbCModalService.showGenericComponentModal( StepsControlModalComponent, modalOptions);
        const componentInstance = modalRef.componentInstance as unknown as { model: StepModalControl | undefined; };
        componentInstance.model = {
            nextStep,
            currentStep
        };

        this.modalRef = modalRef;
        this.modalRef.result.finally(() => {
            this.modalRef = null;
        });
        return modalRef;
    };
}