import { Component, Output, EventEmitter, Input, OnDestroy, ElementRef } from "@angular/core";
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonsSessionStorageService } from "ib-web-commons/utils";
import { IbMmbUmnrComunicationService } from "../../services/ib-Mmb-umnr-comunication.service";
import { FormControl, FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { ScrollDispatcher, CdkScrollable } from '@angular/cdk/scrolling';



export interface UmnrPayload {
  id: number;
  name: string;
  type: string;
}

@Component({
  selector: 'ib-mmb-umnr-custodians-modal-modal',
  templateUrl: './ib-MmB-umnr-custodians-modal-view.component.html',
  styleUrls: ['./ib-MmB-umnr-custodians-modal.component.scss']
})


export class IbMmBUmnrCustodiansModalComponent implements OnDestroy  {
    @Output() saveDataUmnr = new EventEmitter<UmnrPayload>();
    @Input() fields: { [passengerId: string]: FormlyFieldConfig[] } = {};
    @Input() model: any = {};
    @Input() passengers:any = [];
    @Input() options: FormlyFormOptions = {};

    
    
    form: FormGroup = new FormGroup({});
    loadingForm = false;

    private scrollableContainer!: CdkScrollable;


    constructor(
        private NgbActiveModal: NgbActiveModal,
        private NgbModal: NgbModal,
        private CommonsSessionStorageService: CommonsSessionStorageService,
        private IbMmbUmnrComunicationService: IbMmbUmnrComunicationService,
        private elementRef: ElementRef,       // Nos da acceso al DOM del modal
        private scrollDispatcher: ScrollDispatcher // Motor de scroll del CDK
    ) {
        this.form.addControl('copyDataToAllPassengers', new FormControl(false));
        this.form.addControl('acceptTermsAndConditions', new FormControl(false));

        this.form.get('copyDataToAllPassengers')?.valueChanges.subscribe(checked => {
            if (checked) {
                this.copyFirstPassengerDataToOthers();
                this.toggleOtherPassengersFields(true);
            } else {
                this.toggleOtherPassengersFields(false);
            }
        });
    };

    private copyFirstPassengerDataToOthers(): void {
        if (!this.passengers?.length) {
            return;
        }

        const firstPassengerId = this.passengers[0].passengerId;
        const firstPassengerData = this.model[firstPassengerId];

        if (!firstPassengerData) {
            return;
        }

        this.passengers.slice(1).forEach(passenger => {
            const passengerId = passenger.passengerId;

            this.model[passengerId] = {
                ...this.model[passengerId],
                ...firstPassengerData
            };

            // Sincronizamos también los FormControls reactivos
            Object.keys(firstPassengerData).forEach(key => {
                const controlPath = `${passengerId}.${key}`;
                const control = this.form.get(controlPath);
                if (control) {
                    control.setValue(firstPassengerData[key], { emitEvent: false });
                }
            });
        });
    }

    private toggleOtherPassengersFields(disable: boolean): void {
        if (!this.passengers?.length) {
            return;
        }

        // Controlar únicamente el estado real del FormGroup
        this.passengers.slice(1).forEach(passenger => {
            const passengerGroup = this.form.get(passenger.passengerId);

            if (passengerGroup instanceof FormGroup) {
                if (disable) {
                    passengerGroup.disable();
                } else {
                    passengerGroup.enable();
                }
            }
        });
    }


    ngOnDestroy() {
        // Es una buena práctica desregistrar el contenedor al cerrar el modal para evitar fugas de memoria
        if (this.scrollableContainer) {
            this.scrollDispatcher.deregister(this.scrollableContainer);
        }
    }

    saveCustodiansAndCloseModal(data: any): void {
        this.CommonsSessionStorageService.set('dataUmnrCompleted', true);

        if (this.form.valid) {
            this.closeModal(data);
        }
    }

    closeModal(data?: any): void {
        this.NgbActiveModal.close(data);
    }

    closeAllModal(data?: any): void {
        this.NgbModal.dismissAll(data);
    }

}
