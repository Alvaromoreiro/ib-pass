import { Component, Input } from '@angular/core';
import { GeneralInfo } from '@src/app/core/models/ib-booking-on-hold-confirmation/ib-general-info-on-hold-conf-model';

@Component({
    selector: 'ib-trip-info-on-hold-conf',
    templateUrl: './ib-trip-info-on-hold-conf.component.html',
    styleUrls: ['./ib-trip-info-on-hold-conf.component.scss']
})
export class IbTripInfoOnHoldConfComponent {

    @Input() generalInfo:GeneralInfo;
}
