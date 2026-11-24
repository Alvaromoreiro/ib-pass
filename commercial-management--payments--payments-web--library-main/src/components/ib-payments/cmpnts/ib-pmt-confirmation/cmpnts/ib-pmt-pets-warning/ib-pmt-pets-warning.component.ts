import { Component } from '@angular/core';
import { downgradeToAJSComponent } from 'ib-web-commons/utils';

@Component({
    selector: 'ib-pmt-pets-warning',
    templateUrl: './ib-pmt-pets-warning.component.html',
    styleUrls: ['./ib-pmt-pets-warning.component.scss']
})
export class IbPmtPetsWarningComponent {

    constructor () { }
}

downgradeToAJSComponent('ibPmtPetsWarning', { component: IbPmtPetsWarningComponent, inputs: []}, 'ib-pmt-order-confirmation-module');
