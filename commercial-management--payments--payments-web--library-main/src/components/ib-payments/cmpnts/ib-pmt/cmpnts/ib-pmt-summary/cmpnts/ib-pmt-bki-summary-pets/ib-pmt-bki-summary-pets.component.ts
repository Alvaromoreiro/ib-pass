import { Component, Input, OnInit } from '@angular/core';
import { downgradeToAJSComponent, CommonsSessionStorageService } from 'ib-web-commons/utils';
import { PetC } from 'src/app/core/models/ib-pmt-summary-model';

@Component({
    selector: 'ib-pmt-bki-summary-passengers',
    templateUrl: './ib-pmt-bki-summary-pets.component.html'
})
export class IbPmtBkiSummaryPetsComponent {

    @Input() model: PetC;
    @Input() step: string;


    constructor () { }


}

downgradeToAJSComponent('ibPmtSummaryBkiPets', { component: IbPmtBkiSummaryPetsComponent, inputs: ['model']}, 'ib-pmt-summary-module');
