import { Component, Input } from '@angular/core';
import { IbCModalService } from 'ib-web-commons/ib-modal';
import { IbSpecialNeedsModalComponent } from './components/ib-special-needs-modal/ib-special-needs-modal.component';
import { SpecialNeeds } from '@core/models/ib-booking-on-hold-confirmation/ib-special-needs-modal-model';
import { PassengerInfo } from '@src/app/core/models/ib-booking-on-hold-confirmation/ib-general-info-on-hold-conf-model';

@Component({
    selector: 'ib-passenger-info-on-hold-conf',
    templateUrl: './ib-passenger-info-on-hold-conf.component.html',
    styleUrls: ['./ib-passenger-info-on-hold-conf.component.scss']
})
export class IbPassengerInfoOnHoldConfComponent {

    @Input() passengerInfo:PassengerInfo;

    constructor (private IbCModalService:IbCModalService){

    }
    openSpecialNeedsModal (specialNeeds:SpecialNeeds[]) {
        const modalOptions = {
            windowClass: 'ib-modals bki-dialog'
        };
        const modal = this.IbCModalService.showGenericComponentModal( IbSpecialNeedsModalComponent, modalOptions);
        const componentInstance = modal.componentInstance as { model: SpecialNeeds[] | undefined; };
        componentInstance.model = specialNeeds;
        modal.result.then(()=>{}, ()=>{});
    }
}
