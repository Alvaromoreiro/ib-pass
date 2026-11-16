import { Component, Input, OnInit} from "@angular/core";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PetcFlightInfo, PetcModel, PetcPet } from "../../models/petc-info.model";
import { MmBAppConstants } from '@src/ib-MmB-constants';

@Component({
    selector: 'ib-mmb-manage-petc-info-modal',
    templateUrl: './ib-MmB-manage-petc-info-modal-view.component.html'
})

export class IbMmbManagePetcInfoModalComponent implements OnInit {
    @Input() model: PetcModel;

    constructor(
        private NgbActiveModal: NgbActiveModal
    ) { }

    ngOnInit = (): void => {};

    closeModal = () => {
        this.NgbActiveModal.close();
    }

    accept = (): void => {
        this.NgbActiveModal.close();
    };

    isShowPendingPayment(flight: PetcFlightInfo): boolean {
        return flight.pets.some(pet => pet.emd === MmBAppConstants.PETS_STATUS.PENDING_PAYMENT);
    }

    trackByOrderItemId(index: number, pet: PetcPet): string {
        return pet.orderItemId;
    };

    trackBySliceId(index: number, flight: PetcFlightInfo): string {
        return flight.sliceId;
    };
};
