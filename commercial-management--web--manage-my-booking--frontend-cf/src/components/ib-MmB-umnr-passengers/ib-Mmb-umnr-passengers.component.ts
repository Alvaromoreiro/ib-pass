import { Component, OnDestroy, OnInit } from "@angular/core";
import { downgradeToAJSComponent } from 'ib-web-commons/utils';
import { IbCModalService } from "ib-web-commons/ib-modal";
import { IbMmBUmnrDataModalComponent } from './components/ib-MmB-umnr-data-modal/ib-MmB-umnr-data-modal.component';
import { Subscription } from 'rxjs';
import { IbMmbUmnrUtilsService } from "./services/ib-Mmb-umnr-utils.service";

@Component({
    selector: 'ib-mmb-umnr-passengers',
    templateUrl: './ib-Mmb-umnr-passengers-view.component.html'
})
export class IbMmBUmnrPassengersComponent implements OnInit, OnDestroy {
    private modalSubscription?: Subscription;
    isDataUmnrCompleted:boolean = false;
    umnrData: any = null; // ✅ Persistimos datos de la modal

    constructor(
        private IbCModalService: IbCModalService,
        private IbMmbUmnrUtilsService: IbMmbUmnrUtilsService
    ) {
        this.isDataUmnrCompleted = this.IbMmbUmnrUtilsService.isDataUmnrCompleted();
    }

    ngOnInit = (): void => {
        
    };

    openDataModal = (viewModel) => {
        const options = {
            windowClass: 'ib-modals ib-modals--right mmb-modals mmb-modals--right ib-modals--full-mobile',
            modalBlocked: false
        };
        const modalRef = this.IbCModalService.showGenericComponentModal(
            IbMmBUmnrDataModalComponent,
            { ...options }
        );

        // ✅ Si ya hay datos guardados, los inyectamos en la modal
        if (this.umnrData) {
            modalRef.componentInstance.model = this.umnrData;
        }

        modalRef.result.then((data)=> {
            this.isDataUmnrCompleted = true;

            // ✅ Persistimos datos al cerrar correctamente
            if (data) {
                this.umnrData = data;
            }
        }).catch(()=> {
            // eslint-disable-next-line no-console
            console.log('se cerró la modal sin guardar');
        });

        return modalRef;
    };

    ngOnDestroy() {
        this.modalSubscription?.unsubscribe();
    };

    downloadPDF = () => {
        alert('prueba descarga PDF');
    };

    closeModal = () => {
        // this.NgbActiveModal.close();
    };

}

downgradeToAJSComponent('ibMmbUmnrPassengers', {
  component: IbMmBUmnrPassengersComponent,
  inputs: ['model'],
  outputs: []
}, 'ib-mmb-umnr-passengers-module');
