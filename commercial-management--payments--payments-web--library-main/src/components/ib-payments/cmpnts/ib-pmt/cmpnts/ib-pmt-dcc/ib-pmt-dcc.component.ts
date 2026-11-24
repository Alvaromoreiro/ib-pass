import { Component, ViewEncapsulation, Inject, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { downgradeToAJSComponent} from 'ib-web-commons/utils';
import { DccService } from './ib-pmt-dcc.service';

@Component({
    selector:'ib-pmt-dcc',
    templateUrl:'./ib-pmt-dcc.component.html',
    styleUrls: ['./ib-pmt-dcc.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class IbPmtDccComponent {
    @Input() currentDccData: DccModel.CurrentDccData;
    @Input() donationEnabled: boolean;

    constructor (
        private DccService: DccService
    ) {}

}

downgradeToAJSComponent('ibPmtDcc', {
    component: IbPmtDccComponent
}, 'ib-pmt-dcc-module');
